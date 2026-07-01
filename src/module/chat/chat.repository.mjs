import { prisma } from "../../../prisma/prisma.mjs";
import { handleDatabaseError } from "../../db/db.errors.mjs";

export const chatRepository = {
	findById: async (chatId) => {
		try {
			return prisma.chats.findFirst({
				where: {
					id: chatId,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	createChat: async ({ id, members, createAt, avatar }) => {
		try {
			return await prisma.chats.create({
				data: {
					id: id,
					createdAt: createAt,
					avatarUrl: avatar,
					members: {
						connect: members.map((userId) => ({ id: userId })),
					},
				},
				include: {
					members: {
						select: {
							id: true,
						},
					},
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	chatExistsBetween: async ({ yourId, friendId }) => {
		try {
			return await prisma.chats.findFirst({
				where: {
					AND: [
						{ members: { some: { id: yourId } } },
						{ members: { some: { id: friendId } } },
					],
				},
				include: {
					members: {
						select: {
							id: true,
						},
					},
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	getChats: async ({ userId, cursor, limit }) => {
		try {
			const pageSize = limit ? parseInt(limit, 10) : 10;
			const chats = await prisma.chats.findMany({
				where: {
					members: {
						some: { id: userId },
					},
				},
				take: pageSize + 1,
				include: {
					members: {
						select: {
							id: true,
							username: true,
							fullName: true,
							avatarUrl: true,
						},
					},
				},
				cursor: cursor ? { createdAt: cursor } : undefined,
				skip: cursor ? 1 : undefined,
			});
			const formattedChat = chats.map((chat) => {
				const friend = chat.members.find(
					(member) => member.id !== userId,
				);
				return {
					...chat,
					name: friend.fullName ? friend.fullName : friend.username,
					avatarUrl: friend.avatarUrl,
				};
			});
			const hasMore = chats.length > pageSize;
			if (hasMore) {
				chats.pop();
			}
			const nextCursor =
				hasMore && chats.length > 0 ? chats[chats.length - 1].id : null;

			return {
				items: formattedChat,
				hasMore: hasMore,
				nextCursor: nextCursor,
			};
		} catch (error) {
			handleDatabaseError(error);
		}
	},

	getAllMembers: async (chatId) => {
		try {
			return prisma.chats.findFirst({
				where: { id: chatId },
				select: {
					members: {
						select: {
							id: true,
						},
					},
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	updateLastActivity: async ({ id, lastActivity }) => {
		try {
			await prisma.chats.update({
				where: {
					id: id,
				},
				data: {
					lastActivity: lastActivity,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},

	updateLastMessage: async ({ id, lastMessage }) => {
		try {
			await prisma.chats.update({
				where: {
					id: id,
				},
				data: {
					lastMessage: lastMessage,
				},
			});
		} catch (error) {}
	},
};
