import {
	BadRequest,
	InternalServerError,
	NotFound,
	Unauthorized,
} from "../../util/apiErrors.mjs";
import { asyncWrapper } from "../../util/asyncWrapper.mjs";
import { validateInput } from "../../util/validateInput.mjs";
import { userService } from "./user.service.mjs";

export const userController = {
	createUser: asyncWrapper(async (req, res) => {
		const validatetionError = validateInput(
			["email", "username", "password"],
			req.body,
		);
		if (validatetionError.length > 0) {
			throw new BadRequest(validatetionError.join(","));
		}
		const { email, password, username } = req.body;
		const authUser = await userService.createUser({
			email,
			password,
			username,
		});
		const user = {
			id: authUser.user.id,
			email: authUser.user.email,
			username: authUser.user.username,
			fullName: authUser.user.fullName,
			createdAt: authUser.user.createdAt,
			avatarUrl: authUser.user.avatarUrl,
		};
		return res.status(200).json({
			user: user,
			accessToken: authUser.accessToken,
			refreshToken: authUser.refreshToken,
		});
	}),
	login: asyncWrapper(async (req, res) => {
		const validatetionError = validateInput(
			["email", "password"],
			req.body,
		);
		if (validatetionError.length > 0) {
			throw new BadRequest(validatetionError.join(","));
		}
		const { email, password } = req.body;
		const authUser = await userService.login({ email, password });
		return res.status(200).json({
			user: authUser.user,
			accessToken: authUser.accessToken,
			refreshToken: authUser.refreshToken,
		});
	}),
	logout: asyncWrapper(async (req, res) => {
		await userService.logout(req.user.id);
		return res.status(200).json({ message: "Logout successfully" });
	}),
	deleteAccount: asyncWrapper(async (req, res) => {
		await userService.deleteAccount(req.user.id);
		return res
			.status(200)
			.json({ message: "Account deleted successfully" });
	}),
	updateUsername: asyncWrapper(async (req, res) => {
		const validatetionError = validateInput(["username"], req.body);
		if (validatetionError.length > 0) {
			throw new BadRequest(validatetionError.join(","));
		}
		const { username } = req.body;
		await userService.updateUsername({ userId: req.user.id, username });
		return res
			.status(200)
			.json({ message: "Username updated successfully" });
	}),
	updateFullName: asyncWrapper(async (req, res) => {
		const validatetionError = validateInput(["fullName"], req.body);
		if (validatetionError.length > 0) {
			throw new BadRequest(validatetionError.join(","));
		}
		const { fullName } = req.body;
		await userService.updateFullName({ userId: req.user.id, fullName });
		return res
			.status(200)
			.json({ message: "Full name updated successfully" });
	}),

	searchUser: asyncWrapper(async (req, res) => {
		const { query, limit = 20 } = req.query;
		if (!query) {
			throw new BadRequest("Please enter valid query");
		}

		const users = await userService.searchUser({
			query,
			limit,
			yourId: req.user.id,
		});
		console.log(users);
		if (!users || users.length < 0) {
			throw new NotFound("No user found");
		}
		return res.status(200).json({ users: users });
	}),
	getCurrentUser: asyncWrapper(async (req, res) => {
		const currentUser = req.user;
		return res.status(200).json({
			user: {
				id: currentUser.id,
				username: currentUser.username,
				fullName: currentUser.fullName,
				avatarUrl: currentUser.avatarUrl,
				email: currentUser.email,
			},
		});
	}),
	refreshTokens: asyncWrapper(async (req, res) => {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			throw new BadRequest("Refresh token not found.");
		}
		const tokens = await userService.refreshTokens(refreshToken);

		return res.status(200).json({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		});
	}),
};
