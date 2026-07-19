// Global Error handling middleware
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// const err = new Error("Hello");
// console.log(err.message); // Hello

// const e = { ...err };
// console.log(e.message); // undefined

// so we do manually e.message = err.message
// now console.log(e.message); // Hello


// Express call it automatically when error occurs in any route handler or middleware
const errorMiddleware = (err, req, res, next) => {
    try {
        // use spread operator to make copy of err
        let e = { ...err };
        e.message = err.message;

        // Log to console for dev
        console.error(err);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = `Resource not found with id of ${err.value}`;
            e = new ErrorResponse(message, 404);
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            e = new ErrorResponse(message, 400);
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            // Object.values() : returns all the values of an object as an array.
            // map : create new array
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            e = new ErrorResponse(message, 400);
        }

        res.status(e.statusCode || 500).json({
            success: false,
            error: e.message || 'Server Error'
        });
    }
    // If error middleware itself throws an error, it passes that new error to Express's next error handler instead of hanging the request.
    catch (e) {
        next(e);
    }
}

export default errorMiddleware;