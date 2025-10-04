import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from "http";
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/UserRoutes.js';
import messageRouter from './routes/MessageRoutes.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
// intialize socket.io to sever
export const io = new Server(server, {
  cors: {origin:'*'}
});
const allowedOrigins = ['http://localhost:5173'];
export const userSocketMap = {}; // { userId : socketId }

io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("User got connected ",userId);
  if(userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers",Object.keys(userSocketMap));
  socket.on("disconnect",() => {
    console.log("user disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  })
})

app.use(express.json({limit:"4mb"}));
app.use(cors({
  origin:allowedOrigins,
  credentials:true
}));
app.use(cookieParser());

app.use('/api/status',(req,res) => {
  res.send("Server is live")
})
app.use('/api/auth',userRouter)
app.use('/api/message',messageRouter);

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT,() => {
  console.log(`Server is live running on ${PORT}`);
});
