const sentinalPluginAuditNpm = require('../../src/');

// Global object
console.log(sentinalPluginAuditNpm);

// Create function called
sentinalPluginAuditNpm.rules['min-vulnerabilities-allowed'].create();
