import express from "express";

import { protectRoute } from "../middleware/auth.js";

import { getMessages, getUserforSidebar, markMessageAsSeen, sendMessage } from "../controllers/MessageController.js";
const messageRouter = express.Router();

messageRouter.get('/users',protectRoute,getUserforSidebar);
messageRouter.get('/users/:id',protectRoute,getMessages);
messageRouter.put('/mark/:id',protectRoute,markMessageAsSeen);
messageRouter.post('/send/:id',protectRoute,sendMessage)

export default messageRouter;