import { json } from "express";
import { chatService } from "../module/chat/chat.service.mjs";
import { messageService } from "../module/message/message.service.mjs";
import { act } from "react";
import { userService } from "../module/user/user.service.mjs";

const online_users = new Map();

export const registerHandler = (io) => {
	io.on("connection", (socket) => {
		const { username, userId } = socket;
		console.log(username + " has joined");

		socket.join(`user:${userId}`);

		if (!online_users.has(userId)) {
			online_users.set(userId, new Set());
		}
		online_users.get(userId).add(socket.id);

		socket.on("chat:join", (chatId) => {
			console.log(`${socket.username} has joined chat ${chatId}`);
			socket.join(`chat:${chatId}`);
		});

		socket.on("chat:leave", (chatId) => {
			console.log(`${socket.username} has leave chat ${chatId}`);
			socket.leave(`chat:${chatId}`);
		});

		socket.on("message:send", async (rawData) => {
			try {
				const data =
					typeof rawData == "string" ? JSON.parse(rawData) : rawData;
				console.log(data);

				// send the message to all members who are currently in room
				io.to(`chat:${data.chatId}`).emit("message:new", data);

				//save the message in the DB
				await messageService.sendMessage({
					id: data.id,
					text: data.text,
					senderId: data.senderId,
					chatId: data.chatId,
					status: data.status,
					createdAt: data.createdAt,
				});

				//Update chat's last activity
				await chatService.updateLastActivity({
					id: data.chatId,
					lastActivity: data.createdAt,
				});

				//Update chat's last Message
				await chatService.updateLastMessage({
					id: data.chatId,
					lastMessage: data.text,
				});

				//Those who 're online but on in the room
				const sender = await userService.findById(data.senderId);
				const senderName = sender.fullName
					? sender.fullName
					: sender.username;
				const socketsInChat = await io
					.in(`chat:${data.chatId}`)
					.fetchSockets();

				const activeInChat = socketsInChat.map(
					(socket) => socket.userId,
				);
				console.log(activeInChat);

				const chat = await chatService.getAllMembers(data.chatId);
				const members = chat.members;
				console.log(members);
				for (const member of members) {
					if (!activeInChat.includes(member.id)) {
						console.log("Sending notification to", member.id);
						io.to(`user:${member.id}`).emit(
							"notification:new_message",
							{ data, senderName },
						);
					}
				}

				//Those who are offline
			} catch (error) {
				console.log(error);
				socket.emit("error", error);
			}
		});
	});
};
