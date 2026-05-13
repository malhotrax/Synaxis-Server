import { prisma } from "../../../prisma/prisma.mjs";
import { handleDatabaseError } from "../../db/db.errors.mjs";
import bcrypt from "bcryptjs";

export const userRepository = {
	createUser: async ({ email, username, hashedPassword }) => {
		try {
			return await prisma.users.create({
				data: {
					email: email.toLowerCase().trim(),
					username: username.toLowerCase().trim(),
					hashed_password: hashedPassword.trim(),
				},
				select: {
					id: true,
					email: true,
					username: true,
					full_name: true,
					created_at: true,
					avatar_url: true,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	addRefreshToken: async (id, refreshToken) => {
		try {
			return await prisma.users.update({
				where: { id },
				data: { refresh_token: refreshToken },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	findUserByEmailOrUsername: async ({ email, username }) => {
		try {
			return await prisma.users.findFirst({
				where: {
					OR: [{ email }, { username }],
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	deleteById: async (userId) => {
		try {
			return await prisma.users.delete({
				where: { id: userId },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	updateUsername: async ({ userId, username }) => {
		try {
			return await prisma.users.update({
				where: { id: userId },
				data: { username },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	updateFullName: async ({ userId, fullName }) => {
		try {
			return await prisma.users.update({
				where: { id: userId },
				data: { full_name: fullName },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	findByUsername: async (username) => {
		try {
			return await prisma.users.findFirst({
				where: { username },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	findByEmail: async (email) => {
		try {
			return await prisma.users.findFirst({
				where: { email },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	findById: async (userId) => {
		try {
			return await prisma.users.findFirst({
				where: { id: userId },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	searchUser: async ({ query, limit }) => {
		try {
			return await prisma.users.findMany({
				where: {
					OR: [
						{
							username: {
								contains: query,
								mode: "insensitive",
							},
						},
						{
							full_name: {
								contains: query,
								mode: "insensitive",
							},
						},
					],
				},
				take: Number(limit),
				select: {
					username: true,
					avatar_url: true,
					full_name: true,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
};
