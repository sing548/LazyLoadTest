const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'))


  module.exports = {
    output: {
      uniqueName: "p2_modules",
      publicPath: "auto",
      scriptType: 'text/javascript'
    },
    optimization: {
      runtimeChunk: false
    },   
    resolve: {
      alias: {
        ...sharedMappings.getAliases(),
      }
    },
    plugins: [
      new ModuleFederationPlugin({
        
          // For remotes (please adjust)
          name: "p2",
          filename: "remoteEntry.js",
          exposes: {
            './Startup': './src/app/startup/startup.module.ts',
            './P2': './src/app/p2/p2.module.ts'
          },        
          shared: share({
            "@angular/core": { singleton: true, strictVersion: false,  requiredVersion: '>=14'  }, 
            "@angular/common": { singleton: true, strictVersion: false, requiredVersion: '>=14'  }, 
            "@angular/router": { singleton: true, strictVersion: false, requiredVersion: '>=14' },
            "@angular/forms": { singleton: true, strictVersion: false, requiredVersion: '>=14' },
            "@angular/common/http": { singleton: true, strictVersion: false, requiredVersion: '>=14' },
  
            ...sharedMappings.getDescriptors()
          })
      }),
      sharedMappings.getPlugin()
    ],
  };