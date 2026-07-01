import { NotFound, TokenExpired, Unauthorized } from "../util/apiErrors.mjs";
import { verifyToken } from "./verifyToken.mjs";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, _, next) => {
	try {
		const authHeader = req.header("Authorization");
		if (authHeader === undefined || authHeader === null) {
			throw new Unauthorized("Unauthorized request");
		}
		const accessToken =
			req.cookies?.accessToken ||
			authHeader.replace("Bearer ", "").trim();
		if (!accessToken) {
			throw new Unauthorized("No access token found");
		}
		const user = await verifyToken(accessToken);
		req.user = user;
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
