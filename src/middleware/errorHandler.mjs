import { ApiError } from "../util/apiErrors.mjs";

export const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({
        message: "Internal Server Error",
    });
};
