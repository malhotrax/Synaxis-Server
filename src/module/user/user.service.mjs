import bcrypt from "bcryptjs";
import { userRepository } from "./user.repository.mjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.mjs";
import {
	Conflict,
	InternalServerError,
	NotFound,
	TokenExpired,
	Unauthorized,
} from "../../util/apiErrors.mjs";
import { friendsService } from "../friends/friends.service.mjs";

export const userService = {
	generateTokens: async (user) => {
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

		await userRepository.addRefreshToken(user.id, refreshToken);
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
		const tokens = await userService.generateTokens(user);
		if (!tokens) {
			throw new InternalServerError("Failed to generate token");
		}
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
			user.hashedPassword,
		);
		if (!isPasswordValid) {
			throw new Unauthorized("Wrong password");
		}
		const tokens = await userService.generateTokens(user);
		if (!tokens) {
			throw new InternalServerError("Failed to generate tokens");
		}

		const authUser = {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				fullName: user.fullName,
				createdAt: user.createdAt,
				avatarUrl: user.avatarUrl,
			},
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		};
		return authUser;
	},
	searchUser: async ({ query, limit, yourId }) => {
		const result = await userRepository.searchUser({ query, limit });
		if (result.length == 0) return [];
		const users = [];
		const friends = await friendsService.getFriends(yourId);
		for (const user of result) {
			users.push({
				...user,
				isFriend: friends.includes(user.id),
			});
		}
		return users;
	},
	refreshTokens: async (refreshToken) => {
		let decodedToken;
		try {
			decodedToken = await jwt.verify(
				refreshToken,
				config.REFRESH_TOKEN_SECRET,
			);
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new TokenExpired("Refresh token expired");
			}
			throw new Unauthorized("Invalid refresh token");
		}

		const user = await userRepository.findById(decodedToken?.id);
		if (!user) {
			throw new Unauthorized("No user found with associated token");
		}
		if (user.refreshToken !== refreshToken) {
			throw new Unauthorized(
				"Invalid refresh token: Not matched with actual token",
			);
		}
		const tokens = await userService.generateTokens(user);
		if (!tokens) {
			throw new InternalServerError("Failed to generate tokens");
		}
		return tokens;
	},
	logout: async (userId) => {
		await userRepository.removeRefreshToken(userId);
	},
};
