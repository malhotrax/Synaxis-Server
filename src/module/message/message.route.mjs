import { Router } from "express";
import { verifyJWT } from "../../middleware/verifyJWT.mjs";
import { verifyAuthReq } from "../../middleware/authInterceptor.mjs";
import { messageController } from "./message.controller.mjs";

export const messageRouter = Router();

messageRouter.use(verifyJWT, verifyAuthReq);
messageRouter.get("/", messageController.getMessages);
