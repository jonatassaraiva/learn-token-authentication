'use strict';

let moment = require('moment');
let jwtService = require('../services/jwt-service');
let responseHttpService = require('../services/response-http-service');

function verify(req, res, next) {

  if (req.headers.authorization) {
    let payload;
    jwtService.decode(req.headers.authorization, (err, data) => {
      if (err) {
        //TODO: Log
        responseHttpService.forbidden(res, err);
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
        responseHttpService.forbidden(res, 'Token expired.');
      }
    }
    else {
      responseHttpService.forbidden(res);
    }
  }
  else {
    responseHttpService.forbidden(res, 'User is not authenticated.');
  }
}

module.exports = {
  verify
};