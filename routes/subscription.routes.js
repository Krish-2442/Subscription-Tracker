import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscription } from "../controllers/subscription.controller.js";

const subscriptionRoutes = new Router();

subscriptionRoutes.get('/', (req, res) => res.send('Get all subscriptions'));
subscriptionRoutes.get('/:id', (req, res) => res.send('Get subscription'));
subscriptionRoutes.post('/', authorize, createSubscription);
subscriptionRoutes.put('/:id', authorize, (req, res) => res.send('Update subscription'));
subscriptionRoutes.delete('/:id', authorize, (req, res) => res.send('Delete subscription'));

subscriptionRoutes.get('/user/:id', authorize, getUserSubscription);
subscriptionRoutes.put('/:id/cancel', authorize, (req, res) => res.send('Cancel subscription'));
subscriptionRoutes.get('/upcoming-renewals', authorize, (req, res) => res.send('Get Upcoming Renewal'));

export default subscriptionRoutes;