'use strict';

let ResponseBase = require('../models/response-base-model');

function internalServerError(res, err) {
  //TODO: Log
  _responde(res, 500, 'Internal Server Error.', err.errmsg);
}

function _responde(res, statusCode, statusMessage, customMessage, result) {
  if (customMessage)
    statusMessage = `${statusMessage} ${customMessage}`;

  let response = new ResponseBase(statusCode, statusMessage, result);
  res.status(statusCode).json(response);
}


module.exports = {
  internalServerError
};