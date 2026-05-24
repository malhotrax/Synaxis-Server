import { prisma } from "../../../prisma/prisma.mjs";
import { handleDatabaseError } from "../../db/db.errors.mjs";
import { FriendRequestStatus } from "../../generated/prisma/enums.ts";
import { Conflict } from "../../util/apiErrors.mjs";

const canonicalPair = (id1, id2) => {
	return [id1, id2].sort();
};

export const friendsRepository = {
	findRequestById: async (id) => {
		try {
			return await prisma.friend_requests.findUnique({
				where: {
					id: id,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	sendFriendRequest: async ({ senderId, receiverId }) => {
		try {
			await prisma.friend_requests.create({
				data: {
					senderId: senderId,
					receiverId: receiverId,
				},
			});
		} catch (error) {
			throw new handleDatabaseError(error);
		}
	},
	friendRequestExist: async ({ senderId, receiverId }) => {
		try {
			return await prisma.friend_requests.findUnique({
				where: {
					senderId_receiverId: { senderId, receiverId },
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
	acceptFriendRequest: async (request) => {
		try {
			const [userAId, userBId] = canonicalPair(
				request.senderId,
				request.receiverId,
			);
			await prisma.$transaction(async (tx) => {
				await tx.friendships.create({
					data: {
						userAId: userAId,
						userBId: userBId,
					},
				});
				await tx.friend_requests.deleteMany({
					where: {
						OR: [
							{
								senderId: request.senderId,
								receiverId: request.receiverId,
							},
							{
								senderId: request.receiverId,
								receiverId: request.senderId,
							},
						],
					},
				});
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	removeFriend: async ({ yourId, friendId }) => {
		try {
			const [userAId, userBId] = canonicalPair(yourId, friendId);
			await prisma.friendships.delete({
				where: {
					userAId_userBId: { userAId, userBId },
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
			const friends = await prisma.friendships.findMany({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
				select: {
					id: true,
					createdAt: true,
					userAId: true,
					userBId: true,
					userA: {
						select: {
							id: true,
							username: true,
							fullName: true,
							createdAt: true,
							avatarUrl: true,
						},
					},
					userB: {
						select: {
							id: true,
							username: true,
							fullName: true,
							createdAt: true,
							avatarUrl: true,
						},
					},
				},
			});
			return friends.map((friendship) => {
				const friend =
					friendship.userAId === userId
						? friendship.userB
						: friendship.userA;
				return {
					id: friendship.id,
					createdAt: friendship.createdAt,
					friend: friend,
				};
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	isFriend: async ({ yourId, friendId }) => {
		try {
			const [userAId, userBId] = canonicalPair(yourId, friendId);
			return await prisma.friendships.findUnique({
				where: {
					userAId_userBId: { userAId, userBId },
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	getFriendRequests: async (userId) => {
		try {
			const requests = await prisma.friend_requests.findMany({
				where: {
					receiverId: userId,
					status: FriendRequestStatus.PENDING,
				},
				include: {
					sender: {
						select: {
							id: true,
							createdAt: true,
							username: true,
							avatarUrl: true,
							fullName: true,
						},
					},
				},
			});
			return requests;
		} catch (error) {
			handleDatabaseError(error);
		}
	},
};
