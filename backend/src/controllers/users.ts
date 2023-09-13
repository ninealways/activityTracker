import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if (!authenticatedUserId) {
            throw createHttpError(401, "User is not authenticated!");
        }

        const user = await UserModel.findById(authenticatedUserId).select("+username").exec();

        res.status(200).json(user);

    } catch (error) {
        next(error)
    }
}
interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Paramaters Missing!")
        }

        const existingUser = await UserModel.findOne({ username: username }).exec();
        if (existingUser) {
            throw createHttpError(409, "Username already taken!")
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already taken!")
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username,
            email,
            password: passwordHashed
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);

    } catch (error) {
        next(error)
    }
}

interface LoginBody {
    email?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Please enter your email and password!");
        }

        const user = await UserModel.findOne({ email: email }).select("+password +username").exec();

        if (!user) {
            throw createHttpError(401, "Invalid Credentails!");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid Credentails!");
        }

        req.session.userId = user._id;

        res.status(201).json(user);

    } catch (error) {
        next(error)
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};