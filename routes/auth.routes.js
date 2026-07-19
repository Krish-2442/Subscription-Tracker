import { Router } from "express";

import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

// Path : /api/v1/auth/sign-up (POST)
authRouter.post('/sigh-up', signUp);
authRouter.post('/sigh-in', signIn);
authRouter.post('/sigh-out', signOut);

export default authRouter;