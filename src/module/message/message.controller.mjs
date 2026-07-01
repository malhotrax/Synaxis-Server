import { BadRequest, NotFound } from "../../util/apiErrors.mjs";
import { asyncWrapper } from "../../util/asyncWrapper.mjs";
import { validateInput } from "../../util/validateInput.mjs";
import { messageService } from "./message.service.mjs";

export const messageController = {
	getMessages: asyncWrapper(async (req, res) => {
		const validatetionError = validateInput(
			["chatId", "cursor", "limit"],
			req.query,
		);
		if (validatetionError > 0) {
			throw new BadRequest(validatetionError.join(","));
		}
		const { chatId, cursor, limit } = req.query;
		const messages = await messageService.getMessages({
			chatId,
			cursor,
			limit,
		});
		if (!messages) {
			throw new NotFound("No message found");
		}
		console.log(messages);
		return res.status(200).json({
			items: messages.items,
			hasMore: messages.hasMore,
			nextCursor: messages.nextCursor,
		});
	}),
	sendUndeliveredMessages: asyncWrapper(async (req, res) => {}),
};
