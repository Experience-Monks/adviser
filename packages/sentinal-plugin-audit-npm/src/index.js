'use strict';

const path = require('path');
const requireIndex = require('requireindex');

const plugin = {
  rules: requireIndex(path.join(__dirname, '/rules'))
};

module.exports = plugin;
