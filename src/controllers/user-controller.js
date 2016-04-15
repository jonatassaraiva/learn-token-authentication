'use strict';

let moment = require('moment');
let jwt = require('../services/jwt');
let User = require('../models/user-model');
let responseModel = require('../models/response-model');

function authorized(req, res) {
  let response = responseModel.simpleResponde(200, 'OK', req.authentication);
  res.json(response);
}

function register(req, res) {
  let user = req.body;

  let newUser = new User({
    email: user.email,
    password: user.password
  });

  newUser.save((err) => {
    if (err) {
      let response = responseModel.simpleResponde(500, err.errmsg);
      if(err.code === 11000)
        response = responseModel.simpleResponde(409, `User, ${newUser.email}, already registered.`);

      res.status(response.status).send(response);
    }
    else {
      res.status(201);

      let token = _createToken(newUser._id);

      let response = responseModel.simpleResponde(201, 'Created', {
        user: newUser.toJSON(),
        token
      });
      res.json(response);
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
      _responseError(err, user, err);
    }
    else if (user) {
      user.comparePassword(req.user.password, function (err, isMatch) {
        if (err) {
          _responseError(err, user, err);
        }
        else {
          if (isMatch) {
            let token = _createToken(user._id);

            let response = responseModel.simpleResponde(200, 'OK', {
              user: user.toJSON(),
              token
            });

            res.json(response);
          }
          else {
            let response = responseModel.simpleResponde(403, 'Authentication faild. Email or password invalid.');
            res.json(response);
          }
        }
      });
    }
    else {
      let response = responseModel.simpleResponde(404, 'User not found.');
      res.json(response);
    }
  });
}

function _createToken(userId) {
  let payload = {
    userId,
    expires: moment().add(10, 'days').unix()
  };

  return jwt.encode(payload);
}

function _responseError(req, res, err) {
  let response = responseModel.simpleResponde(500, `${err.code} - ${err.errmsg}`);
  res.send(response);
}

module.exports = {
  authorized,
  register,
  signIn
};