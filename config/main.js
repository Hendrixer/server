var mainConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
  secrets: {
    jwt: 'catreactor'
  }
};

_.merge(mainConfig, require('./' + process.env.NODE_ENV) || {});


module.exports = mainConfig;
