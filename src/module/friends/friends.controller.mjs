import { asyncWrapper } from "../../util/asyncWrapper.mjs";
import { BadRequest, NotFound } from "../../util/apiErrors.mjs";
import { validateInput } from "../../util/validateInput.mjs";
import { friendsService } from "./friends.service.mjs";

export const friendController = {
	sendFriendRequest: asyncWrapper(async (req, res) => {
		const userId = req.params.userId;
		if (!userId) {
			throw new BadRequest(
				"Please provide the user id that you want to be friend with.",
			);
		}
		await friendsService.sendFriendRequest({
			senderId: req.user.id,
			receiverId: userId,
		});

		return res.status(200).json({ message: "Request sent sucessfully" });
	}),
	acceptFriendRequest: asyncWrapper(async (req, res) => {
		const id = req.params.id;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.acceptFriendRequest(id);
		return res
			.status(200)
			.json({ message: "Friend request accepted successfully" });
	}),
	rejectFriendRequest: asyncWrapper(async (req, res) => {
		const id = req.params.id;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.rejectFriendRequest(id);
		return res
			.status(200)
			.json({ message: "Friend request rejected successfully" });
	}),
	removeFriend: asyncWrapper(async (req, res) => {
		const friendId = req.params.friendId;
		if (!friendId) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.removeFriend({ yourId: req.user.id, friendId });
		return res.status(200).json({ message: "Friend removed successfully" });
	}),
	deleteFriendRequest: asyncWrapper(async (req, res) => {
		const id = req.params.id;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.deleteFriendRequestById(id);
	}),
	getFriends: asyncWrapper(async (req, res) => {
		const { cursor, limit } = req.query;
		const friends = await friendsService.getFriends({
			userId: req.user.id,
			cursor: cursor,
			limit: limit,
		});
		console.log(friends);
		return res.status(200).json({
			items: friends.friends,
			hasMore: friends.hasMore,
			nextCursor: friends.nextCursor,
		});
	}),
	getFriendRequests: asyncWrapper(async (req, res) => {
		const requests = await friendsService.getFriendRequests(req.user.id);
		return res.status(200).json({ requests });
	}),
};
