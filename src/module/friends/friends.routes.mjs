import { Router } from "express";

import { friendController } from "./friends.controller.mjs";
export const friendsRouter = Router();
friendsRouter.get("/", friendController.getFriends);
friendsRouter.delete("/delete", friendController.deleteFriendRequest);
friendsRouter.post("/send", friendController.sendFriendRequest);
friendsRouter.post("/accept", friendController.acceptFriendRequest);
friendsRouter.post("/reject", friendController.rejectFriendRequest);
friendsRouter.delete("/remove", friendController.removeFriend);
