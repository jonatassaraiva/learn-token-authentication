'use strict';

let crypto = require('crypto');

const SECRECT = 'shhhh...';

function encode(payload) {

  let header = {
    typ: 'JWT',
    alg: 'HS256'
  };

  let jwt = `${base64Encode(header)}.${base64Encode(payload)}`;
  jwt += `.${sign(jwt)}`;

  return jwt;
}

function decode(headersAuthorization, callback) {
  let token = headersAuthorization.split(' ');
  if (token.length !== 2) {
    callback(new Error('Token structure incorrect.'), null);
  }
  else {

    let segments = token[1].split('.');
    if (segments.length !== 3) {
      callback(new Error('Token structure incorrect.'), null);
    }
    else {

      let rawSignature = `${segments[0]}.${segments[1]}`;
      if (segments[2] === sign(rawSignature)) {
        let payload = base64Dencode(segments[1]);
        callback(null, payload);
      }
      else {

        callback(new Error('Token verification faield.'), null);
      }
    }
  }
}

function sign(value) {
  return crypto.createHmac('sha256', SECRECT)
    .update(value)
    .digest('base64');
}

function base64Encode(value) {
  return new Buffer(JSON.stringify(value)).toString('base64');
}

function base64Dencode(value) {
  let result = new Buffer(value, 'base64').toString();
  return JSON.parse(result);
}

module.exports = {
  encode,
  decode
};