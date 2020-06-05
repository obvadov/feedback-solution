const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router.route('/login').post(authController.login)
router.route('/signUp').post(authController.signUp)

router
    .route('/')
    .get(authController.authenticateRoute, userController.getCurrentUser)
    .patch(authController.authenticateRoute, userController.updateUser)

module.exports = router
