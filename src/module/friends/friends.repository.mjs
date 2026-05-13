import { prisma } from "../../../prisma/prisma.mjs";
import { handleDatabaseError } from "../../db/db.errors.mjs";
import { FriendRequestStatus } from "../../generated/prisma/enums.ts";

export const friendsRepository = {
	sendFriendRequest: async ({ senderId, receiverId }) => {
		try {
			await prisma.friend_requests.create({
				data: {
					sender_id: senderId,
					receiver_id: receiverId,
				},
			});
		} catch (error) {
			throw new handleDatabaseError(error);
		}
	},
	acceptFriendRequest: async (friendRequestId) => {
		try {
			await prisma.friend_requests.update({
				where: {
					id: friendRequestId,
				},
				data: {
					status: FriendRequestStatus.ACCEPTED,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	rejectFriendRequest: async (friendRequestId) => {
		try {
			await prisma.friend_requests.update({
				where: {
					id: friendRequestId,
				},
				data: {
					status: FriendRequestStatus.REJECTED,
				},
			});
		} catch (error) {}
	},
	removeFriend: async ({ yourId, friendId }) => {
		try {
			await prisma.friend_requests.deleteMany({
				where: {
					OR: [
						{ sender_id: yourId, receiver_id: friendId },
						{ sender_id: friendId, receiver_id: yourId },
					],
					status: FriendRequestStatus.ACCEPTED,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	deleteFriendRequestById: async (friendRequestId) => {
		try {
			await prisma.friend_requests.delete({
				where: {
					id: friendRequestId,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	getFriends: async (userId) => {
		try {
			const request = await prisma.friend_requests.findMany({
				where: {
					OR: [{ sender_id: userId }, { receiver_id: userId }],
					status: FriendRequestStatus.ACCEPTED,
				},
				include: {
					sender: true,
					receiver: true,
				},
			});

			return request.map(({ sender_id, receiver_id }) =>
				sender_id === userId ? receiver : sender,
			);
		} catch (error) {
			handleDatabaseError(error);
		}
	},
};
