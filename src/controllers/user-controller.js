'use strict';

let moment = require('moment');
let jwtService = require('../services/jwt-service');
let User = require('../models/user-model');
let responseHttpService = require('../services/response-http-service');
let responseMongooseErrorService = require('../services/response-mongoose-error-service');

function authorized(req, res) {
  responseHttpService.ok(res, null, req.authentication);
}

function register(req, res) {
  let user = req.body;

  //TODO: User exists?
  //TODO: Create password crypt.

  let newUser = new User({
    email: user.email,
    password: user.password
  });

  newUser.save((err) => {
    if (err) {
      responseMongooseErrorService.internalServerError(res, err);
    }
    else {
      let token = _createToken(newUser._id);
      let resultUser = {
        user: newUser.toJSON(),
        token
      };

      responseHttpService.created(res, null, resultUser);
    }
  });
}

function signIn(req, res) {
  req.user = req.body;

  let query = {
    email: req.user.email
  };

  User.findOne(query, function (err, user) {
    if (err) {
      responseMongooseErrorService.internalServerError(res, err);
    }
    else if (user) {
      user.comparePassword(req.user.password, function (err, isMatch) {
        if (err) {
          responseMongooseErrorService.internalServerError(res, err);
        }
        else {
          if (isMatch) {
            let token = _createToken(user._id);

            let resultUser = {
              user: user.toJSON(),
              token
            };

            responseHttpService.ok(res, resultUser);
          }
          else {
            responseHttpService.forbidden(res, 'Email or password invalid.');
          }
        }
      });
    }
    else {
      responseHttpService.forbidden(res, 'Email or password invalid.');
    }
  });
}

function _createToken(userId) {
  let payload = {
    userId,
    expires: moment().add(10, 'days').unix()
  };

  return jwtService.encode(payload);
}

module.exports = {
  authorized,
  register,
  signIn
};