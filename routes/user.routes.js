import { Router } from 'express';

const userRoutes = Router();

userRoutes.get('/', (req, res) => res.send('Get all users'));

userRoutes.get('/:id', (req, res) => res.send(`Get user with id ${req.params.id}`));

userRoutes.post('/', (req, res) => res.send('Create a new user'));

userRoutes.put('/:id', (req, res) => res.send(`Update user with id ${req.params.id}`));

userRoutes.delete('/:id', (req, res) => res.send(`Delete user with id ${req.params.id}`));

export default userRoutes;