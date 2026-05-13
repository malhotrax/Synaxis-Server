import { Conflict, InternalServerError } from "../util/apiErrors.mjs";

const UNIQUE_VOILATION = "P2002";
const FOREIGN_KEY_VOILATION = "P2003";
const NOT_NULL_VOILATION = "P2011";
const CONNECTION_EXCEPTION = "P1001";

export const handleDatabaseError = (err) => {
    console.error(`[DB_ERROR)] : ${err.message}`);
    switch (err.code) {
        case UNIQUE_VOILATION: {
            const column = err.detail?.match(/Key \((\w+)\)/)?.[1] ?? "field";
            throw new Conflict(`${column} already exists`);
        }

        case FOREIGN_KEY_VOILATION:
            throw new BadRequest("Invalid reference");

        case NOT_NULL_VOILATION:
            throw new BadRequest("Missing required field");

        case CONNECTION_EXCEPTION:
            throw new InternalServerError("Problem in database connection");

        default:
            throw new InternalServerError();
    }
};
