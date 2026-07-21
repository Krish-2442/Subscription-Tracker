// authorization part is here
import User from "../models/user.model.js";

export const getUsers = async function (req, res, next)  {
    try {
        // use .select('-password') to exclude the password field from the returned user documents
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

export const getUser = async function (req, res, next)  {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}