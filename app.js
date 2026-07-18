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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/user', userRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Welcome to Learning Backend");
})

app.listen(PORT, async () => {
    console.log(`App running on http://localhost:${PORT}`);

    await connectToDatabase()
})

export default app;