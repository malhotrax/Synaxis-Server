import { Router } from "express";
import { chatController } from "./chat.controller.mjs";
import { verifyJWT } from "../../middleware/verifyJWT.mjs";
import { verifyAuthReq } from "../../middleware/authInterceptor.mjs";

export const chatRouter = Router();

chatRouter.use(verifyJWT, verifyAuthReq);
chatRouter.post("/create", chatController.createChat);
chatRouter.get("/", chatController.getChats);
