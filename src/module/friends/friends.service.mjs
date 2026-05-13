import { NotFound } from "../../util/apiErrors.mjs";
import { userRepository } from "../user/user.repository.mjs";
import { friendsRepository } from "./friends.repository.mjs";

export const friendsService = {
	sendFriendRequest: async ({ senderId, receiverId }) => {
		const receiver = await userRepository.findById(receiverId);
		if (!receiver) {
			throw new NotFound("Receiver not found with given Id");
		}
		await friendsRepository.sendFriendRequest({ senderId, receiverId });
	},
	acceptFriendRequest: async (friendRequestId) => {
		await friendsRepository.acceptFriendRequest(friendRequestId);
	},
	rejectFriendRequest: async (friendRequestId) => {
		await friendsRepository.rejectFriendRequest(friendRequestId);
	},
	deleteFriendRequestById: async (friendRequestId) => {
		await friendsRepository.deleteFriendRequestById(friendRequestId);
	},
	removeFriend: async ({ yourId, friendId }) => {
		const friend = await userRepository.findById(friendId);
		if (!friend) {
			throw new NotFound("Friend with given id not found");
		}
		await friendsRepository.removeFriend({ yourId, friendId });
	},
	getFriends: async (userId) => {
		const result = await friendsRepository.getFriends(userId);
		if (result.length == 0 || result.length < 0) {
			throw new NotFound("No friends found");
		}
		return result;
	},
};
