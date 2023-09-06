import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoute from './routes/notes';
import morgan from 'morgan';

const app = express();

app.use(morgan("dev")); //this is just to log api end point and status code in console.

app.use(express.json());

app.use("/api/notes", notesRoute); //defines the actual route to be used for all api's

//this handles for any endpoints that does not exist in our application
app.use((req, res, next) => {
    next(Error("Endpoint not found!"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
});

export default app;