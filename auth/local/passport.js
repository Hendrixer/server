var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../api/user/userModel.js');

// this will run when user tries to sign in with username password
passport.use('local-signin', new LocalStrategy({
    passwordField: 'password'
  },
  function(email, password, done) {
    // first
      // look to see if user (most mongoose quiries return promises)
    User.findOne({ email: email }).then(function(user) {
      // if not user then pass a message that we will using in the routing
      // that we can send back to the client in local/index.js
      if (!user) {
        return done(null, false, { message: 'This email is not registered.' });
      }

      // if bcrypt fails, then send back that message
      // in local/index.js
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'This password is not correct.' });
      }
      // if all is good, then just send back the user
      // we will sign this user object, or some part of it
      // as a JWT in the controller function
      // in local/index.js
      return done(null, user);
    })
    .catch(function(e) {
      done(e);
    });
  }
));

// used for sign up with username password
passport.use('local-signup', new LocalStrategy({
    passwordField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    // search for the user
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(e);
      }
      // this user already exists with this username
      // they can't sign up again!!
      if (user) {
        return done(null, false, { message: 'That username is already taken' });
      }

      // create a new User document
      // password will be hashed before saved
      console.log(password);
      User.create({ username: username, password: password })
      .then(function(user) {
        done(null, user);
      }, function(e) {
        done(e);
      })
    });
  }
));
