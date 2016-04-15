'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
mongoose.connect('mongodb://localhost/learn-token-authentication');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

let userRoute = require('./routes/user-route');
app.use('/user', userRoute);

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

app.listen(3000);