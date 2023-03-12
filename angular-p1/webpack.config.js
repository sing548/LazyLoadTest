const {
    share,
    withModuleFederationPlugin,
  } = require("@angular-architects/module-federation/webpack");
  
  let config = withModuleFederationPlugin({
    name: "portal",
  
    shared: share({
      "@angular/animations":  { singleton: true, strictVersion: false, requiredVersion: 'auto' },
      "@angular/common":      { singleton: true, strictVersion: false, requiredVersion: 'auto' },
      "@angular/common/http": { singleton: true, strictVersion: false, requiredVersion: 'auto' },
      "@angular/core":        { singleton: true, strictVersion: false, requiredVersion: 'auto' },
      "@angular/forms":       { singleton: true, strictVersion: false, requiredVersion: 'auto' },
      "@angular/router":      { singleton: true, strictVersion: false, requiredVersion: 'auto' }
    })
  });
  
  module.exports = config;
  
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  const environment = require('./environment');
  
  environment.config.merge({
    devServer: {
      hot: false,
      inline: false,
      liveReload: false
    }
  });
  
  module.exports = environment.toWebpackConfig();