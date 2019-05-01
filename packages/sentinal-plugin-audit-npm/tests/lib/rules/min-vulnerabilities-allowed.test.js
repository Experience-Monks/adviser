const minVulnerabilitiesAllowed = require('../../../src/rules/min-vulnerabilities-allowed');

describe('Rule configuration', () => {
  test('Documentation is set', () => {
    expect(minVulnerabilitiesAllowed.meta.docs).toHaveProperty('category');
    expect(minVulnerabilitiesAllowed.meta.docs).toHaveProperty('description');
    expect(minVulnerabilitiesAllowed.meta.docs).toHaveProperty('url');
  });
});

describe('Create function', () => {
  test('Create function exists', () => {
    expect(minVulnerabilitiesAllowed.create).toBeInstanceOf(Function);
  });
});
