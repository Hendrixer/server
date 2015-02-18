'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/userModel.js');

var validateJwt = expressJwt({ secret: $config.secrets.jwt });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      // so you can put the jwt on the header as header.authorization = jwt
      // or on the query string like /api/model?access_token=jwt
      // where jwt is the long ass jwt string
      // validateJwt will expect it to be on the header, so if not
      // put it on the header here
      // the Bearer thing is just a convention
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    // after the token is decoded, attatch it to req.user
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

        req.user = user;
        next();
      });
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(data) {
  return jwt.sign(data, $config.secrets.jwt, { expiresInMinutes: 60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 * we need this cookie because of the pop ups
 */

function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user);
  res.cookie('daas_token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
