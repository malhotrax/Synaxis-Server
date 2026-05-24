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
					hashedPassword: hashedPassword.trim(),
				},
				select: {
					id: true,
					email: true,
					username: true,
					fullName: true,
					createdAt: true,
					avatarUrl: true,
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
				data: { refreshToken: refreshToken },
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
	removeRefreshToken: async (userId) => {
		try {
			await prisma.users.update({
				where: { id: userId },
				data: { refreshToken: "" },
			});
		} catch (error) {}
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
				data: { fullName: fullName.trim() },
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
							fullName: {
								contains: query,
								mode: "insensitive",
							},
						},
					],
				},
				take: Number(limit),
				select: {
					id: true,
					username: true,
					avatarUrl: true,
					fullName: true,
				},
			});
		} catch (error) {
			handleDatabaseError(error);
		}
	},
};
