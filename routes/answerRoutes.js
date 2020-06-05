const express = require('express');
const router = express.Router();

const answerController = require('../controllers/answerController');
const authController = require('../controllers/authController');

router
    .route('/')
    .get(authController.authenticateRoute, answerController.answersList)
    .post(authController.authenticateRoute, answerController.createNewAnswer);

router
    .route('/:answerId')
    .get(authController.authenticateRoute, answerController.showAnswer);

module.exports = router;
