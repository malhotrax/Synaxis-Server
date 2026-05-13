import { BadRequest } from "./apiErrors.mjs";

export const validateInput = (field, body) => {
	if (!body) {
		throw new BadRequest("No data found");
	}
	return field
		.filter((field) => body[field] === undefined || body[field] === null)
		.map((field) => `${field} is required`);
};
