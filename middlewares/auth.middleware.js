// Authorization middleware to protect routes and ensure that the user is authenticated before accessing certain endpoints.
// Authentication (Sign In) = "Who are you?"
// Authorization (This middleware) = "Now that I know who you are, are you allowed to access this route?"

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header is present and starts with 'Bearer'
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            // split(' ') gives an array of two elements, the first is 'Bearer' and the second is the actual token
            // "Bearer eyJhbGc123456789" so split can split when it see space and we take the second part which is the actual token
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).send({message: 'Unauthorized'});
        }

        // jwt.verify(token, secretOrPublicKey) and it returns the decoded payload if the token is valid, otherwise it throws an error.
        // there is userId field and other field like iat, exp etc in decoded payload
        // iat means issued at and exp means expiration time
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        // now we authorize user and put all user detail in request body
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({message: 'Unauthorized', error: error.message});
    }
}

export default authorize;