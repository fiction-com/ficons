'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var _this = this;

  return _runSwPrecache2.default.call(this).then(function () {
    return (0, _injectSwRegister2.default)(_this.public_dir);
  });
};

var _runSwPrecache = require('./run-sw-precache');

var _runSwPrecache2 = _interopRequireDefault(_runSwPrecache);

var _injectSwRegister = require('./inject-sw-register');

var _injectSwRegister2 = _interopRequireDefault(_injectSwRegister);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }