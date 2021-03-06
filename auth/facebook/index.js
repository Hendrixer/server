var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jsonwebtoken');
var expressToken = require('express-jwt');

var router = express.Router();

router.use(passport.initialize());
router.use(passport.session());


passport.use(new FacebookStrategy({
    clientID: $config.facebook.FACEBOOK_ID,
    clientSecret: $config.facebook.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3000/api/fb/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

router.get('/facebook', passport.authenticate('facebook'), function (req, res) {
});

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/signup' }), function (req, res) {
  console.log('User information name: '+ req.user.displayName);
  var token = jwt.sign({foo:'foobar'}, $config.JWT_SECRET, {expiresInMinutes: 60*5});
  res.status(200).json({token: token});
});

module.exports = router;
