import { withTranscation } from "../../../prisma/prisma.mjs";
import { Conflict, Forbidden, NotFound } from "../../util/apiErrors.mjs";
import { userRepository } from "../user/user.repository.mjs";
import { friendsRepository } from "./friends.repository.mjs";

export const friendsService = {
	sendFriendRequest: async ({ senderId, receiverId }) => {
		if (senderId === receiverId) {
			throw new Forbidden("You can't send friend request to yourself");
		}
		const receiver = await userRepository.findById(receiverId);
		if (!receiver) {
			throw new NotFound("Receiver not found with given Id");
		}
		const requestExist = await friendsRepository.friendRequestExist({
			senderId,
			receiverId,
		});
		if (requestExist) {
			throw new Conflict("Request already exists");
		}
		await friendsRepository.sendFriendRequest({ senderId, receiverId });
	},
	acceptFriendRequest: async (friendRequestId) => {
		const request =
			await friendsRepository.findRequestById(friendRequestId);
		if (!request) {
			throw new NotFound("Request with given Id not found");
		}
		await friendsRepository.acceptFriendRequest(request);
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
		return await friendsRepository.getFriends(userId);
	},
	isFriend: async ({ yourId, friendId }) => {
		return await friendsRepository.isFriend({ yourId, friendId });
	},
	getFriendRequests: async (userId) => {
		return await friendsRepository.getFriendRequests(userId);
	},
};
