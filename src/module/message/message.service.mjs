import { BadRequest, NotFound } from "../../util/apiErrors.mjs";
import { chatService } from "../chat/chat.service.mjs";
import { messageRepository } from "./message.repository.mjs";

export const messageService = {
	sendMessage: async ({ text, id, senderId, chatId, createdAt, status }) => {
		if (!text || !senderId || !chatId || !createdAt) {
			throw new BadRequest("Please provide the necessary details");
		}

		return await messageRepository.insertMessage({
			id,
			text,
			senderId,
			chatId,
			status,
			createdAt,
		});
	},
	deleteMessage: async (id) => {
		return messageRepository.deleteMessage(id);
	},
	updateMessage: async ({ id, content }) => {
		return messageRepository.updateMessages({ id, content });
	},

	getMessages: async ({ chatId, cursor, limit }) => {
		const chat = await chatService.findById(chatId);
		if (!chat) {
			throw new NotFound("Chat not found");
		}
		return messageRepository.getMessages({ chatId, cursor, limit });
	},
};
