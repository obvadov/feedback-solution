const mongoose = require('mongoose');

const Survey = require('../models/surveyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createNewSurvey = catchAsync(async (req, res, next) => {
    const newSurvey = new Survey({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        url: req.body.url,
        questions: req.body.questions,
    });

    newSurvey.save((err, survey) => {
        if (err) {
            return next(new AppError(err, 400));
        }
        res.status(201).json({
            message: 'succesfully',
            data: { id: survey.id },
        });
    });
});

exports.showSurvey = catchAsync(async (req, res, next) => {
    const surveyId = req.params.surveyId;

    if (!mongoose.Types.ObjectId.isValid(surveyId))
        return next(new AppError('wrong survey id parameter', 400));

    const survey = await Survey.findById(surveyId);

    if (survey) {
        return res.json(survey);
    }
    return next(new AppError(`No survey with id ${surveyId}`, 404));
});

exports.deleteSurvey = catchAsync(async (req, res, next) => {
    const surveyId = req.params.surveyId;

    if (!mongoose.Types.ObjectId.isValid(surveyId))
        return next(new AppError('wrong survey id parameter', 400));

    const deleted = await Survey.findByIdAndRemove(surveyId);

    if (deleted) {
        return res.status(204).json({});
    } else {
        return next(new AppError(`No survey with id ${surveyId}`, 404));
    }
});

exports.updateSurvey = catchAsync(async (req, res, next) => {
    const surveyId = req.params.surveyId;

    if (!mongoose.Types.ObjectId.isValid(surveyId))
        return next(new AppError('wrong survey id parameter', 400));

    const userBody = req.body;

    const verifiedSurveyData = {};

    const allowedFields = ['name', 'url', 'questions'];

    Object.keys(userBody).map((field) => {
        if (allowedFields.includes(field))
            verifiedSurveyData[field] = userBody[field];
    });

    await Survey.findByIdAndUpdate(
        surveyId,
        verifiedSurveyData,
        {
            new: false,
        },
        function (err, model) {
            if (!err && model) {
                return res.json({ message: 'successfully updated' });
            } else {
                return next(new AppError(`No survey with id ${surveyId}`, 404));
            }
        }
    );
});
