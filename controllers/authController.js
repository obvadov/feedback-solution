const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/userModel');
const { authSignToken } = require('../utils/helpers');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new AppError('Check your login and password', 400));

    User.findOne({ email }, function (err, user) {
        if (!user) {
            return next(new AppError('Check your login and password', 400));
        } else {
            user.comparePassword(password, user.password).then((isEquals) => {
                if (!isEquals) {
                    return next(
                        new AppError('Check your login and password', 400)
                    );
                }

                const token = authSignToken(user);
                return res.json({ token });
            });
        }
    }).select('+password');
});

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    newUser.save((err, user) => {
        if (err) {
            return next(err);
        }

        const token = authSignToken(user);
        res.status(201).json({
            message: `User with e-mail: ${req.body.email} was successfully added`,
            data: {
                token,
                id: user.id,
            },
        });
    });
});

exports.authenticateRoute = passport.authenticate('jwt', { session: false });
