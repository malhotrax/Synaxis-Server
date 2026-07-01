import { Unauthorized } from "../util/apiErrors.mjs";
import { verifyToken } from "./verifyToken.mjs";
import jwt from "jsonwebtoken";

export const authSocket = async (socket, next) => {
	try {
		const authToken = socket.handshake.auth?.token;
		if (!authToken) {
			throw new Unauthorized("No auth token found");
		}
		const user = await verifyToken(authToken);
		socket.username = user.username;
		socket.userId = user.id;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return next(new TokenExpired());
		}
		if (error instanceof jwt.JsonWebTokenError) {
			return next(new Unauthorized("Invalid token"));
		}
		next(error);
	}
};
