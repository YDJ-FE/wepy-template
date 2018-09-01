const path = require('path')
const isDev = process.env.NODE_ENV === 'dev'

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  cliLogs: true,
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  compilers: {
    sass: {
      outputStyle: 'compressed'
    },
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: [
        'babel-plugin-transform-class-properties',
        'transform-export-extensions',
        'syntax-export-extensions',
        'transform-object-rest-spread'
      ]
    }
  },
  plugins: {
    replace: {
      filter: /config\.js$/,
      config: {
        find: '__env__',
        replace: process.env.NODE_ENV
      }
    }
  },
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}

if (!isDev) {
  module.exports.cliLogs = false

  delete module.exports.compilers.babel.sourcesMap
  // 压缩sass
  module.exports.compilers['sass'] = { outputStyle: 'compressed' }

  // 压缩js
  module.exports.plugins = {
    replace: {
      filter: /config\.js$/,
      config: {
        find: '__env__',
        replace: process.env.NODE_ENV
      }
    },
    uglifyjs: {
      filter: /\.js$/,
      config: {}
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  }
}
