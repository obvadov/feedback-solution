const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCurrentUser = catchAsync(async (req, res) => {
    const currentUser = await User.findById(req.user.id);
    res.json({ message: 'success', data: { currentUser } });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const userBody = req.body;
    const verifiedUserData = {};
    const allowedFields = ['name', 'new_password', 'current_password'];

    Object.keys(userBody).map((field) => {
        if (allowedFields.includes(field))
            verifiedUserData[field] = userBody[field];
    });

    if (verifiedUserData['current_password'] === undefined)
        return next(new AppError('current_password is required', 400));

    const user = await User.findById(req.user.id).select('+password');

    const isVerifiedPassword = await user.comparePassword(
        verifiedUserData.current_password,
        user.password
    );

    if (!isVerifiedPassword)
        return next(new AppError('wrong current password', 400));

    if (verifiedUserData.new_password !== undefined)
        user.changePassword(verifiedUserData.new_password);

    if (verifiedUserData.name) user.changeName(verifiedUserData.name);

    await user.save((err, success) => {
        if (success) return res.json({ message: 'success' });
        return next(new AppError(err, 500));
    });
});
