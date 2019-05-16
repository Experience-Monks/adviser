'use strict';

const REPO_URL = 'https://github.com/jam3/sentinal-plugin-audit-npm';

function docsUrl(ruleName) {
  return `${REPO_URL}/tree/master/docs/rules/${ruleName}.md`;
}

module.exports = docsUrl;
