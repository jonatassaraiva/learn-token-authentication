'use strict';

let moment = require('moment');
let jwt = require('../services/jwt');
let User = require('../models/user-model');

function authorized(req, res) {
  res.json(req.authentication);
}

function register(req, res) {
  let user = req.body;

  let newUser = new User({
    email: user.email,
    password: user.password
  });

  newUser.save((err) => {
    if (err) {
      res.send(err);
    }
    else {
      res.status(201);

      let payload = {
        userId: newUser._id,
        expires: moment().add(10, 'days').unix()
      };

      let token = jwt.encode(payload);

      res.json({
        user: newUser.toJSON(),
        token
      });
    }
  });
}

module.exports = {
  authorized,
  register
};