'use strinc';

function response(status, message, result) {
  return {
    status,
    message,
    result
  };
}

module.exports = {
  simpleResponde: response
};