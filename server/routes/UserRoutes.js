import express from "express";
import { checkAuth, login, logout, signup, updateUserProfile } from "../controllers/UserController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateUserProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.post("/logout",logout);

export default userRouter;