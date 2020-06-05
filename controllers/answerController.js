const mongoose = require('mongoose');

const Answer = require('../models/answerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.answersList = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = process.env.DOCUMENTS_PER_PAGINATION_PAGE * 1 || 10;
    const skip = (page - 1) * limit;
    const countDocuments = await Answer.countDocuments({});
    const totalPages = Math.ceil(countDocuments / limit);

    if (skip >= countDocuments)
        return next(new AppError('No more answers', 404));

    const result = await Answer.find()
        .skip(skip)
        .limit(limit)
        .populate('user')
        .populate('survey');

    const resObject = {
        current_page: page,
        total_pages: totalPages,
        next_page: `${process.env.HOSTNAME_API_V1}/answers?page=${page + 1}`,
        data: { ...result },
    };

    if (page >= totalPages) delete resObject.next_page;
    res.json(resObject);
});

exports.createNewAnswer = catchAsync(async (req, res, next) => {
    const newAnswer = new Answer({
        user: req.user.id,
        survey: req.body.surveyId,
        data: req.body.data,
    });

    newAnswer.save((err, answer) => {
        if (err) {
            return next(new AppError(err, 400));
        }
        res.status(201).json({
            message: 'succesfully',
            data: {
                id: answer.id,
            },
        });
    });
});

exports.showAnswer = catchAsync(async (req, res, next) => {
    const answerId = req.params.answerId;

    if (!mongoose.Types.ObjectId.isValid(answerId))
        return next(new AppError('wrong answer Id parameter', 400));

    const answer = await Answer.findById(answerId)
        .populate('user')
        .populate('survey');

    if (answer) {
        return res.json(answer);
    }
    return next(new AppError(`No answer with id ${answerId}`, 404));
});
