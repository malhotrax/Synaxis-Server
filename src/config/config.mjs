import "dotenv/config";

const required = [
    "DATABASE_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY",
];

required.forEach((item) => {
    if (!process.env[item]) {
        throw new Error(`Missing required env var: ${item}`);
    }
});

export const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: parseInt(process.env.PORT ?? 8080, 10),
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    NODE_ENV: process.env.NODE_ENV,
};
