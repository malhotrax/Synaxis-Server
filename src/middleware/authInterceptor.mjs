import { Unauthorized } from "../util/apiErrors.mjs";

export const verifyAuthReq = async (req, _, next) => {
    if (!req.user) {
        throw new Unauthorized("Unauthorized request");
    }
    next();
};
