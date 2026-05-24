import { Router } from "express";

import { friendController } from "./friends.controller.mjs";
import { verifyJWT } from "../../middleware/verifyJWT.mjs";
import { verifyAuthReq } from "../../middleware/authInterceptor.mjs";
import { friendsService } from "./friends.service.mjs";

export const friendsRouter = Router();

friendsRouter.use(verifyJWT, verifyAuthReq);

friendsRouter.get("/", friendController.getFriends);
friendsRouter.delete(
	"/request/delete/:id",
	friendController.deleteFriendRequest,
);
friendsRouter.post("/request/send/:userId", friendController.sendFriendRequest);
friendsRouter.post("/request/accept/:id", friendController.acceptFriendRequest);
friendsRouter.post("/request/reject/:id", friendController.rejectFriendRequest);
friendsRouter.delete("/remove/:friendId", friendController.removeFriend);
friendsRouter.get("/requests", friendController.getFriendRequests);
