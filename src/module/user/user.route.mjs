import { Router } from "express";
import { userController } from "./user.controller.mjs";
import { verifyJWT } from "../../middleware/verifyJWT.mjs";
import { verifyAuthReq } from "../../middleware/authInterceptor.mjs";

export const userRouter = Router();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.login);

userRouter.delete(
    "/delete-account",
    verifyJWT,
    verifyAuthReq,
    userController.deleteAccount,
);
userRouter.patch(
    "/update/username",
    verifyJWT,
    verifyAuthReq,
    userController.updateUsername,
);
userRouter.patch(
    "/update/full-name",
    verifyJWT,
    verifyAuthReq,
    userController.updateFullName,
);
userRouter.post("/logout", verifyJWT, verifyAuthReq, userController.logout);
userRouter.get("/", userController.searchUser);
