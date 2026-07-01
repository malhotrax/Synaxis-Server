import { config } from "./config/config.mjs";
import { connectDB } from "./db/connectDB.mjs";
import { app } from "./app.mjs";
import http from "http";
import { Server } from "socket.io";
import { registerHandler } from "./socket/registerHandler.mjs";
import { authSocket } from "./middleware/authSocket.mjs";

const server = http.createServer(app);
const io = new Server(server, {
	pingInterval: 25000,
	pingTimeout: 20000,
	maxHttpBufferSize: 1e6,
});

io.use(authSocket);

registerHandler(io);

const port = config.PORT;
connectDB()
	.then(() => {
		server.listen(port, () => {
			console.log(`Server started at ${port}`);
		});
	})
	.catch((err) => {
		throw new Error(err);
	});

const shutdown = () => {
	console.log("\nShutting down...");
	io.close();
	server.close(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
