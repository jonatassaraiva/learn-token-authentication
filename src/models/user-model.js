'use strict';
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String }
}, { versionKey: false });

userSchema.methods.toJSON = function () {
  let user = this.toObject();

  delete user.password;

  return user;
};

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        next(err);

      bcrypt.hash(this.password, salt, null, (err, hash) => {
        if (err)
          next(err);

        this.password = hash;
        next();
      });
    });
  }
  else {
    next();
  }
});

module.exports = mongoose.model('user', userSchema);