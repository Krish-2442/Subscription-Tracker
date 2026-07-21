// Authentication Part
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";


export const signUp = async function (req, res, next) {
    // start Database Transaction
    // A transaction groups database changes together. If every step succeeds, it saves them; if something fails, it cancels them.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Get user data from request body
        const { name, email, password } = req.body;

        // check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        // Hash the Password
        // A salt is random data added during password hashing. It ensures that two users using the same password do not get the same stored hash.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = new User({ name, email, password: hashedPassword });

        // Save the new user to the database within the transaction session
        await newUsers.save({ session });

        // generate fresh new Token
        // syntax of token.sign(payload, secretKey, options)
        const token = jwt.sign({userId: newUsers._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        await session.endSession();

        res.status(201).json({ message: 'User created successfully', user: newUsers, token });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
}
    
export const signIn = async function (req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User does not exist');
            error.status = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid Password');
            error.status = 401;
            throw error;
        }

        // generate fresh new Token
        const token = jwt.sign({userId: user._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({ message: 'User signed in successfully', user, token });
    } catch (error) {
        next(error);
    }
}

export const signOut = async function (req, res) {

}