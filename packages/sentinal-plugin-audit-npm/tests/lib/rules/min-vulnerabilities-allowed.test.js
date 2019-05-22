const Sentinal = require('sentinal');
const minVulnerabilitiesAllowed = require('../../../src/rules/min-vulnerabilities-allowed');

describe('Rule configuration', () => {
  test('Documentation is set', () => {
    expect(minVulnerabilitiesAllowed.meta).toHaveProperty('category');
    expect(minVulnerabilitiesAllowed.meta).toHaveProperty('description');
    expect(minVulnerabilitiesAllowed.meta).toHaveProperty('docsUrl');
    expect(minVulnerabilitiesAllowed.meta).toHaveProperty('schema');
  });
});

describe('Rule definition', () => {
  test('Rule is extending from Sentinal Rule', () => {
    expect(minVulnerabilitiesAllowed.prototype instanceof Sentinal.Rule).toBeTruthy();
  });
});
