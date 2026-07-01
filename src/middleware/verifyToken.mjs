import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";
import { userRepository } from "../module/user/user.repository.mjs";
import { Unauthorized } from "../util/apiErrors.mjs";

export const verifyToken = async (token) => {
	const decodedToken = await jwt.verify(token, config.ACCESS_TOKEN_SECRET);
	const user = await userRepository.findById(decodedToken?.id);
	if (!user) {
		throw new Unauthorized("No user found with associated token");
	}
	return user;
};
