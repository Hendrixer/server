'use strict';

// this is the same express and passport in every
// other file, its not a new one.
var express = require('express');
var passport = require('passport');

// load up the local strategy
require('./local/passport.js');

// load up the facebook strategy
// require('./facebook/passport.js');

// creat a router for just for auth

var router = express.Router();

// we're requiring a folder here and not a file because
// in the folder './local' there is an 'index.js'. Node
// looks for an index.js and will require that file
// when we require the folder. There are sub routers
// in those index.js files
router.use('/local', require('./local'));
// router.user('/facebook', require('./facebook'));

module.exports = router;
