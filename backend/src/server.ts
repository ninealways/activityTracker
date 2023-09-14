
import app from "./app";
import env from "./utils/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.MONGO_CONN_STRING)
    .then(() => {
        console.log("moongoose connected!");
        app.listen(port, () => {
            console.log("Server Runnning on port: " + port);
        });
    })
    .catch(console.error);

