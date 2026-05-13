import { asyncWrapper } from "../../util/asyncWrapper.mjs";
import { BadRequest } from "../../util/apiErrors.mjs";
import { validateInput } from "../../util/validateInput.mjs";
import { friendsService } from "./friends.service.mjs";

export const friendController = {
	sendFriendRequest: asyncWrapper(async (req, res) => {
		const { userId } = req.body;
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
		const { id } = req.body;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.acceptFriendRequest(id);
		return res
			.status(200)
			.json({ message: "Friend request accepted successfully" });
	}),
	rejectFriendRequest: asyncWrapper(async (req, res) => {
		const { id } = req.body;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.rejectFriendRequest(id);
		return res
			.status(200)
			.json({ message: "Friend request rejected successfully" });
	}),
	removeFriend: asyncWrapper(async (req, res) => {
		const { friendId } = req.body;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.removeFriend({ yourId: req.user.id, friendId });
	}),
	deleteFriendRequest: asyncWrapper(async (req, res) => {
		const { id } = req.body;
		if (!id) {
			throw new BadRequest("Friend request id not found");
		}
		await friendsService.deleteFriendRequestById(id);
	}),
	getFriends: asyncWrapper(async (req, res) => {
		const friends = await friendsService.getFriends(req.user.id);
		return res.status(200).json({ friends });
	}),
};
