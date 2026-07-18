import { Router} from "express";

const authRouter = Router();

authRouter.post('/sigh-up', (req, res) => res.send('Sigh Up'));
authRouter.post('/sigh-in', (req, res) => res.send('sigh In'));
authRouter.post('/sigh-out', (req, res) => res.send('sigh Out'));

export default authRouter;