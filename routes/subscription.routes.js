import { Router } from 'express';

const subscriptionRoutes = new Router();

subscriptionRoutes.get('/', (req, res) => res.send('Get all subscriptions'));
subscriptionRoutes.get('/:id', (req, res) => res.send('Get subscription'));
subscriptionRoutes.post('/', (req, res) => res.send('Post subscriptions'));
subscriptionRoutes.put('/:id', (req, res) => res.send('Put subscription'));
subscriptionRoutes.delete('/:id', (req, res) => res.send('Delete subscription'));

subscriptionRoutes.get('/user/:id', (req, res) => res.send('Get all user Subscriptions'));
subscriptionRoutes.put('/:id/cancel', (req, res) => res.send('Cancel subscription'));
subscriptionRoutes.get('/upcoming-renewals', (req, res) => res.send('Get Upcoming Renewal'));

export default subscriptionRoutes;