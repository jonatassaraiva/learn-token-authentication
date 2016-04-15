'use strict';
let moment = require('moment');
let jwt = require('../services/jwt');
let responseModel = require('../models/response-model');

function verify(req, res, next) {

  if (req.headers.authorization) {
    let payload;
    jwt.decode(req.headers.authorization, (err, data) => {
      if (err) {
        //TODO: Log
        _responseAuthenticationFaild(res, err);
        return;
      }
      payload = data;
    });

    if (payload.userId && payload.userId !== 0 && payload.expires) {
      //TODO: Check if user exists
      if (payload.expires > moment().unix()) {
        let authentication = {
          userId: payload.userId
        };
        req.authentication = authentication;
        next();
      }
      else {
        _responseAuthenticationFaild(res, 'Token expired.');
      }
    }
    else {
      _responseAuthenticationFaild(res);
    }
  }
  else {
    _responseAuthenticationFaild(res, 'User are not authenticated.');
  }
}

function _responseAuthenticationFaild(res, message) {
  let code = 403;
  let authenticatedMessage = 'Authentication faild.';
  if (message)
    authenticatedMessage = `${authenticatedMessage} ${message}`;

  let response = responseModel.simpleResponde(code, authenticatedMessage);
  res.status(code).json(response);
}

module.exports = {
  verify
};