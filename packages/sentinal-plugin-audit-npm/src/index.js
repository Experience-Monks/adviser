'use strict';

const path = require('path');
const requireIndex = require('requireindex');

module.exports = {
  rules: requireIndex(path.join(__dirname, '/rules')),
  config: {
    type: 'static'
  }
};
