import { config } from "../config/config.mjs";
import { NotFound, TokenExpired, Unauthorized } from "../util/apiErrors.mjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../module/user/user.repository.mjs";

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
		const decodedToken = await jwt.verify(
			accessToken,
			config.ACCESS_TOKEN_SECRET,
		);
		const user = await userRepository.findById(decodedToken?.id);
		if (!user) {
			throw new NotFound("No user found with associated token");
		}
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
