/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Dan Abramov
 Shamelessly based on bundle-loader by Tobias Koppers @sokra
 */

module.exports = function () {};
module.exports.pitch = function (remainingRequest) {
  this.cacheable && this.cacheable();
  var query = this.query.substring(1).split(','),
    promiseLib = query[0],
    bundleName = query[1] || '';
  var fileName = remainingRequest.match(/\/([^\/]+)$/)[1];
  var name = fileName.split('.')[0];
  
  bundleName = bundleName.replace(/\[fileName\]/g, fileName).replace(/\[name\]/g, name);

  if (!promiseLib) {
    throw new Error('You need to specify your Promise library of choice, e.g. require("promise?bluebird!./file.js")');
  }

  var result = [
    (promiseLib !== "global") ? 'var Promise = require(' + JSON.stringify(promiseLib) + ');\n' : '',
    'module.exports = function () {\n',
    '  return new Promise(function (resolve) {\n',
    '    require.ensure([], function (require) {\n',
    '      resolve(require(', JSON.stringify('!!' + remainingRequest), '));\n',
    '    }' + (bundleName && (', ' + JSON.stringify(bundleName))) + ');\n',
    '  });\n',
    '}'
  ];

  return result.join('');
};
