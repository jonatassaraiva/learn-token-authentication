'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let moment = require('moment');
let jwt = require('./services/jwt');
let authorizationMiddleware = require('./routes/authorization-middleware');

let app = express();
mongoose.connect('mongodb://localhost/learn-token-authentication');

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

let User = require('./models/user');
app.post('/register', (req, res) => {
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
        userId: user._id,
        expires: moment().add(10, 'days').unix()
      };

      let token = jwt.encode(payload);

      res.json({
        user: newUser.toJSON(),
        token
      });
    }
  });
});

app.get('/', (req, res) => {

  let appInfo = require('./package.json');
  let result = {
    version: appInfo.version,
    name: appInfo.name,
    description: appInfo.description,
    readme: appInfo.homepage,
    author: appInfo.author
  };
  res.json(result);
});

app.use('/authorized', authorizationMiddleware.verify);
app.get('/authorized', (req, res) => {
  res.json(req.authentication);
});

app.listen(3000);