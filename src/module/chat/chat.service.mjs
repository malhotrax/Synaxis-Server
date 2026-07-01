import { BadRequest, Conflict, NotFound } from "../../util/apiErrors.mjs";
import { userService } from "../user/user.service.mjs";
import { chatRepository } from "./chat.repository.mjs";

export const chatService = {
	createChat: async ({ id, members, createdAt, yourId }) => {
		if (!members || members.length === 0) {
			throw new BadRequest("No members found");
		}
		const friendId = members[0].id;
		if (!friendId) {
			throw new BadRequest("Members are invalid");
		}
		if (friendId === yourId) {
			throw new Conflict("You can't create the chat with yourself");
		}
		const friend = await userService.findById(friendId);
		if (!friend) {
			throw new NotFound("Friend not found with given id");
		}
		const chat = await chatRepository.chatExistsBetween({
			yourId,
			friendId: friend.id,
		});

		if (chat) {
			return chat;
		}

		const chatMembers = [friend.id, yourId];
		return await chatRepository.createChat({
			id,
			members: chatMembers,
			createdAt,
			avatar: friend.avatarUrl,
		});
	},

	findById: async (chatId) => {
		return await chatRepository.findById(chatId);
	},
	getChats: async ({ userId, cursor, limit }) => {
		return await chatRepository.getChats({ userId, cursor, limit });
	},
	getAllMembers: async (chatId) => {
		return await chatRepository.getAllMembers(chatId);
	},
	updateLastActivity: async ({ id, lastActivity }) => {
		return await chatRepository.updateLastActivity({ id, lastActivity });
	},
	updateLastMessage: async ({ id, lastMessage }) => {
		return await chatRepository.updateLastMessage({ id, lastMessage });
	},
};
