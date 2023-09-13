import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoute from './routes/notes';
import morgan from 'morgan';
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./routes/users";
import session from "express-session";
import env from "./utils/validateEnv";
import MongoStore from "connect-mongo";
const app = express();

app.use(morgan("dev")); //this is just to log api end point and status code in console.

app.use(express.json());

//adding session from mongo db
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONN_STRING
    }),
}));

app.use("/api/users", userRoutes); //defines the actual route to be used for user api's
app.use("/api/notes", notesRoute); //defines the actual route to be used for notes api's

//this handles for any endpoints that does not exist in our application
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found!"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;