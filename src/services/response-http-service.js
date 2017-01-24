'use strict';

let ResponseBase = require('../models/response-base-model');

function ok(res, message, result) {
  _response(res, 200, 'OK', message, result);
}

function created(res, message, result) {
  _response(res, 201, 'Created.', message, result);
}

function forbidden(res, message) {
  _response(res, 403, 'Authentication faild.', message);
}

function notFound(res, message) {
  _response(res, 404, 'Not Found.', message);
}

function internalServerError(res, message) {
  //TODO: Log
  _response(res, 500, 'Internal Server Error.', message);
}

function _response(res, statusCode, statusMessage, customMessage, result) {
  if (customMessage)
    statusMessage = `${statusMessage} ${customMessage}`;

  let response = new ResponseBase(statusCode, statusMessage, result);
  res.status(statusCode).json(response);
}


module.exports = {
  ok,
  created,
  forbidden,
  notFound,
  internalServerError
};