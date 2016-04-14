'use strict';
let jwt = require('../services/jwt');
let moment = require('moment');

function verify(req, res, next) {
  let result = {
    authenticated: true,
    authenticatedMessage: 'Authentication success'
  };

  if (req.headers.authorization) {
    let payload;
    jwt.decode(req.headers.authorization, (err, data) => {
      if (err) {
        //TODO: Log
        _authenticationFaild(result, res, err);
        return;
      }
      payload = data;
    });

    if (payload.userId && payload.userId !== 0 && payload.expires) {
      //TODO: Check if user exists
      if(payload.expires > moment().unix()){
        result.userId = payload.userId;
        req.authentication = result;
        next();
      }
      else {
         _authenticationFaild(result, res, 'Token expired.');
      }
    }
    else {
      _authenticationFaild(result, res);
    }
  }
  else {
    _authenticationRequired(result, res);
  }
}

function _authenticationRequired(result, res) {
  result.authenticated = false;
  result.authenticatedMessage = 'User are not authenticated.';
  res.status(407).json(result);
}

function _authenticationFaild(result, res, message) {
  result.authenticated = false;

  let authenticatedMessage = 'Authentication faild.';
  if(message)
    authenticatedMessage = `${authenticatedMessage} ${message}`;

  result.authenticatedMessage = authenticatedMessage;
  res.status(403).json(result);
}

module.exports = {
  verify
};