const express = require('express');
const router = express.Router();

const surveyController = require('../controllers/surveyController');
const authController = require('../controllers/authController');

router
    .route('/')
    .post(authController.authenticateRoute, surveyController.createNewSurvey);

router
    .route('/:surveyId')
    .get(authController.authenticateRoute, surveyController.showSurvey)
    .patch(authController.authenticateRoute, surveyController.updateSurvey)
    .delete(authController.authenticateRoute, surveyController.deleteSurvey);
module.exports = router;
