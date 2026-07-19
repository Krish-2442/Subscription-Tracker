import { Router } from 'express';
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.get('/', authorize, getUsers);

userRoutes.get('/:id', authorize, getUser);

userRoutes.post('/', (req, res) => res.send('Create a new user'));

userRoutes.put('/:id', (req, res) => res.send(`Update user with id ${req.params.id}`));

userRoutes.delete('/:id', (req, res) => res.send(`Delete user with id ${req.params.id}`));

export default userRoutes;