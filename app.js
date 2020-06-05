const express = require('express');
require('dotenv').config();
require('./utils/passport');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const answerRoute = require('./routes/answerRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandlerMiddleware = require('./utils/errorsHandler');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    mongoose.set('debug', true);
}

app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ whitelist: [] }));
app.use(passport.initialize());

const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from your IP. Please try to repeat in a hour',
});

app.use('/api/v1/', limiter);
app.use('/api/v1/answers', answerRoute);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/users', userRoutes);

//cors policy
const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token'],
};
app.use(cors(corsOption));

app.all('*', (req, res, next) => {
    next(new AppError(`There's no route ${req.originalUrl}`, 404));
});

app.use(errorHandlerMiddleware);

module.exports = app;
