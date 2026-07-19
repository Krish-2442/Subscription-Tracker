import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDatabase = async () => {
    if (!DB_URI) {
        console.warn("DB_URI is not set; skipping database connection. Set DB_URI in env files to enable DB.");
        return;
    }

    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to Database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("Error connecting to Database:", error);
        process.exit(1);
    }
};

export default connectToDatabase;