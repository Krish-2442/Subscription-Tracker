class ErrorResponse {
    constructor(message, number) {
        this.message = message;
        this.statusCode = number;
    }
}

const errorMiddleware = (err, req, res, next) => {
    try {
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
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            e = new ErrorResponse(message, 400);
        }

        res.status(e.statusCode || 500).json({
            success: false,
            error: e.message || 'Server Error'
        });
    } catch (e) {
        next(e);
    }
}

export default errorMiddleware;