import bcrypt from "bcryptjs";
import { userRepository } from "./user.repository.mjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.mjs";
import {
	Conflict,
	InternalServerError,
	NotFound,
	Unauthorized,
} from "../../util/apiErrors.mjs";

export const userService = {
	generateTokens: (user) => {
		const accessToken = jwt.sign(
			{
				id: user.id,
			},
			config.ACCESS_TOKEN_SECRET,
			{
				expiresIn: config.ACCESS_TOKEN_EXPIRY,
			},
		);
		const refreshToken = jwt.sign(
			{
				id: user.id,
			},
			config.REFRESH_TOKEN_SECRET,
			{
				expiresIn: config.REFRESH_TOKEN_EXPIRY,
			},
		);
		return {
			accessToken,
			refreshToken,
		};
	},
	createUser: async ({ email, password, username }) => {
		const userExist = await userRepository.findUserByEmailOrUsername({
			email,
			username,
		});
		if (userExist) {
			throw new Conflict(`Email or username already exist.`);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await userRepository.createUser({
			email,
			hashedPassword,
			username,
		});
		const tokens = userService.generateTokens(user);
		if (!tokens) {
			throw new InternalServerError("Failed to generate token");
		}
		await userRepository.addRefreshToken(user.id, tokens.refreshToken);
		return {
			user: user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		};
	},
	deleteAccount: async (userId) => {
		return await userRepository.deleteById(userId);
	},

	updateUsername: async ({ userId, username }) => {
		const usernameExists = await userRepository.findByUsername(username);
		if (usernameExists) {
			throw new Conflict("Username is not available");
		}
		return await userRepository.updateUsername({ userId, username });
	},

	updateFullName: async ({ userId, fullName }) => {
		return await userRepository.updateFullName({ userId, fullName });
	},

	login: async ({ email, password }) => {
		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new NotFound("User with given email not found");
		}
		const isPasswordValid = await bcrypt.compare(
			password,
			user.hashed_password,
		);
		if (!isPasswordValid) {
			throw new Unauthorized("Wrong password");
		}
		const tokens = userService.generateTokens(user);
		if (!tokens) {
			throw new InternalServerError("Failed to generate tokens");
		}

		const authUser = {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				fullName: user.full_name,
				createdAt: user.created_at,
				avatarUrl: user.avatar_url,
			},
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		};
		return authUser;
	},
	searchUser: async ({ query, limit }) => {
		return await userRepository.searchUser({ query, limit });
	},
};
