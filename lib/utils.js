'use strict';

exports.getVersion = function getVersion() {
  const pkg = require('../package');
  return `${pkg.name}@${pkg.version}`;
};

