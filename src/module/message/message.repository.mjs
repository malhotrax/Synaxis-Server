import { prisma } from "../../../prisma/prisma.mjs";
import { handleDatabaseError } from "../../db/db.errors.mjs";

export const messageRepository = {
	insertMessage: async ({
		id,
		text,
		senderId,
		chatId,
		status,
		createdAt,
	}) => {
		try {
			return await prisma.messages.create({
				data: {
					id: id,
					text: text,
					senderId: senderId,
					chatId: chatId,
					status: status,
					createdAt: createdAt,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},

	deleteMessage: async (id) => {
		try {
			return prisma.messages.delete({
				where: {
					id: id,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},

	updateMessages: async ({ id, content }) => {
		try {
			return prisma.messages.update({
				where: {
					id: id,
				},
				data: {
					text: content,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	getMessages: async ({ chatId, limit, cursor }) => {
		try {
			const pageSize = limit ? parseInt(limit, 10) : 10;
			const result = await prisma.messages.findMany({
				where: {
					chatId: chatId,
				},
				cursor: cursor
					? {
							id: cursor,
						}
					: undefined,
				orderBy: {
					createdAt: "desc",
				},
				take: pageSize + 1,
			});

			const hasMore = result.length > pageSize;
			const nextCursor =
				hasMore && result.length > 0
					? result[result.length - 1].id
					: null;
			result.pop();
			return {
				items: result,
				hasMore: hasMore,
				nextCursor: nextCursor,
			};
		} catch (error) {
			handleDatabaseError(error);
		}
	},
};
