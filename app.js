import express from 'express';
import cookieParser from "cookie-parser";

// Now Port is coming from env.js
import { PORT } from "./config/env.js";


import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";


const app = express();

// req.body.name   // "Netflix"
// req.body.price  // 199
app.use(express.json()); // This reads a JSON request body and puts it into req.body.

// This reads html data sent by client and make available in req.body
// extended: true supports more complex/nested form values, such as:
// user[name]=Krish&user[email]=krish@example.com
app.use(express.urlencoded({ extended: true }));

// A cookie is a small piece of text that a website asks the browser to remember.
// The browser stores it for that website and automatically sends it back with later requests to the same site.
// This is middleware that reads incoming cookies and makes them easy to use.
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/user', userRoutes);

// Register the global error handler after all routes and other middleware
// so it can catch errors passed from them.
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Welcome to Learning the Backend");
})

// Here it is safe to start the server after the database connection is established
// so we we listen after the connectToDatabase()
const startServer = async () => {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`App running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();

export default app;