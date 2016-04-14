'use strict';

let express = require('express');
let userRouter = express.Router();
let authorizationMiddleware = require('./authorization-middleware-route');
let userController = require('../controllers/user-controller');

userRouter.route('/register')
  .post(userController.register);

userRouter.use('/authorized', authorizationMiddleware.verify);
userRouter.route('/authorized')
  .get(userController.authorized);

module.exports = userRouter;