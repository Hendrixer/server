var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  providers: {
    facebook: {
      id: String,
      accessToken: String,
      pic: String
    },
    twitter: {
      type: String
    }
  }
});

//bcrypt middleware
UserSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) {
    return next();
  }
  // creat hash from Sync methods and try them just in case they throw errors
  try {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
  } catch(e) {
    next(e);
  }

  next();

  // bcrypt.genSalt(10, function(err, salt) {
  //   if(err) {
  //     return next(err);
  //   };
  //   bcrypt.hash(user.password, salt, function(err, hash) {
  //     if(err) return next(err);
  //     user.password = hash;
  //     next();
  //   });
  // });
});


// Password verification
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
