import http from "http";
import { app } from "../app.mjs";
import { Server } from "socket.io";
import { messageService } from "../module/message/message.service.mjs";

export const server = http.createServer(app);

const io = new Server(server);
const ONLINE_USERS = new Map();

io.on("connection", (socket) => {
	socket.on("message:send", async (rawData) => {
		try {
			const data =
				typeof rawData === "string" ? JSON.parse(rawData) : rawData;
			const message = await messageService.sendMessage(data);
			console.log(message);
			socket.emit("message:received", message);
		} catch (error) {
			console.log("[Socket]", error);
			socket.emit("error", error);
		}
	});
	socket.on("message:update", (data) => {
		console.log("Message update ", data);
	});
	socket.on("message:delete", (data) => {
		console.log("Message delete ", data);
	});
	socket.emit("message:received", (data) => {
		console.log("Message received", data);
	});
	socket.emit("message:deleted", (data) => {
		console.log("Message deleted", data);
	});
	socket.emit("message:updated", (data) => {
		console.log("Message updated", data);
	});
});
