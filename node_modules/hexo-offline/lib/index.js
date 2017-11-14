'use strict';

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

hexo.extend.filter.register('before_exit', _lib2.default); /* global hexo */