import { config } from "./config/config.mjs";
import { connectDB } from "./db/connectDB.mjs";
import { server } from "./socket/socket.mjs";

connectDB()
    .then(() => {
        server.listen(config.PORT, () => {
            console.log(`Server started at ${config.PORT}`);
        });
    })
    .catch((err) => {
        throw new Error(err);
    });
