'use strinc';

class ResponseBase {
  constructor(status, message, result) {
    this.status = status;
    this.message = message;
    this.result = result;
  }
}

module.exports = ResponseBase;