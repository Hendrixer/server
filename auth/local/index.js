var express = require('express');
var passport = require('passport');
var auth = require('../authService.js');

var router = express.Router();

router.post('/login', function(req, res, next) {
  // call the appropriate passport strategety defined in local/passport.js
  // this call back is the done function in local/passport.js
  // this returns a function that needs the req, res, and next
  var responseFn = passport.authenticate('local-login', function(err, user, message) {
    var error = err || message;

    if (error) {
      return res.status(401).json(error);
    }

    // this should never happen if we do the stuff in local/passport.js right
    // there should always be an error/message or a user
    if (!user) {
      return res.status(404).json({ messsage: 'Something went wrong, please try again' });
    }

    var token = auth.signToken(user._id);

    res.json({token: token });
  });

  responseFn(req, res, next);
});

router.post('/signup', function(req, res, next) {
  // call the appropriate passport strategety defined in local/passport.js
  // this call back is the done function in local/passport.js
  // this returns a function that needs the req, res, and next
  var responseFn = passport.authenticate('local-signup', function(err, user, message) {
    var error = err || message;

    if (error) {
      console.log(error)
      return res.status(401).json(error);
    }

    // this should never happen if we do the stuff in local/passport.js right
    // there should always be an error/message or a user
    if (!user) {
      return res.status(404).json({ messsage: 'Something went wrong, please try again' });
    }

    var token = auth.signToken(user);
    console.log(token);

    res.json({token: token });
  });

  responseFn(req, res, next);
});

module.exports = router;
