const AppError = require('./appError');

const handleDuplicationFeilds = (error) => {
    const value = error.keyValue;
    const message = `Duplicate field ${value[0]}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationDbFeilds = (error) => {
    return new AppError(
        'Check your data, you have some validation rules issue',
        400
    );
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('Error happend');
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        stack: err.stack,
        message: err.message,
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || '';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }

    if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err, { message: err.message });

        if (error.code === 11000) error = handleDuplicationFeilds(error);
        if (error._message === 'User validation failed')
            error = handleValidationDbFeilds(error);
        sendErrorProd(error, res);
    }
};
