export class ApiError extends Error {
    constructor(statusCode, message = "", stack) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class BadRequest extends ApiError {
    constructor(message = "Bad request", stack) {
        super(400, message, stack);
    }
}

export class Unauthorized extends ApiError {
    constructor(message = "Unauthorized", stack) {
        super(401, message, stack);
    }
}

export class Forbidden extends ApiError {
    constructor(message = "Forbidden", stack) {
        super(403, message, stack);
    }
}
export class Conflict extends ApiError {
    constructor(message = "Conflict", stack) {
        super(409, message, stack);
    }
}

export class NotFound extends ApiError {
    constructor(message = "Resource not found", stack) {
        super(404, message, stack);
    }
}

export class InternalServerError extends ApiError {
    constructor(message = "Internal server error", stack) {
        super(500, message, stack);
    }
}
