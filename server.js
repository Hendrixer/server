process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global._ = require('lodash');
global.$config = require('./config/main');

var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var app = express();

mongoose.connect($config.mongo.url);

var whitelistUrls = [];
var optionObj = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelistUrls.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }

};
if ($config.env === 'development') {
  whitelistUrls.push('http://localhost:3000');
}
if ($config.env === 'production') {
  whitelistUrls.push($config.productionURL);
}


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize());

require('./routes')(app);

app.listen($config.port, function(){
  console.log("Listening on " + $config.port);
});

module.exports = app;
