import express from "express";
import { userRouter } from "./module/user/user.route.mjs";
import { NotFound } from "./util/apiErrors.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import { logger } from "./middleware/logger.mjs";
import helmet from "helmet";

import compression from "compression";
import { friendsRouter } from "./module/friends/friends.routes.mjs";
import { chatRouter } from "./module/chat/chat.route.mjs";
import { messageRouter } from "./module/message/message.route.mjs";

export const app = express();
app.use(compression());
app.use(helmet());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

app.get("/hello", (req, res) => {
	return res.send("Hello");
});

app.use((req, _, next) => {
	next(new NotFound(`Route ${req.originalUrl} not found`));
});

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
	console.error("Unhandled Rejection:", reason);
});

app.use(errorHandler);
