import { BadRequest } from "../../util/apiErrors.mjs";
import { asyncWrapper } from "../../util/asyncWrapper.mjs";
import { validateInput } from "../../util/validateInput.mjs";
import { chatService } from "./chat.service.mjs";

export const chatController = {
	createChat: asyncWrapper(async (req, res) => {
		const validatetionError = validateInput(
			["id", "members", "createdAt", "type"],
			req.body,
		);
		const { id, name, members, createdAt, type } = req.body;
		const chat = await chatService.createChat({
			id,
			name,
			members,
			createdAt,
			type,
			yourId: req.user.id,
		});
		console.log(chat);
		return res.status(200).json({ chat: chat });
	}),
	getChats: asyncWrapper(async (req, res) => {
		const { cursor, limit } = req.query;
		const chats = await chatService.getChats({
			userId: req.user.id,
			cursor,
			limit,
		});
		console.log(chats);
		return res.status(200).json({
			items: chats.items,
			hasMore: chats.hasMore,
			nextCursor: chats.nextCursor,
		});
	}),
};
