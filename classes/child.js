const Sentinal = require('./sentinal');

class MinVulnerabilityAllowed extends Sentinal.Rule {
  run(sandbox) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        sandbox.report({ message: 'hola' });
        resolve();
      }, 1000 * Math.floor(Math.random() * Math.floor(9)));
    });

    return promise;
  }
}

MinVulnerabilityAllowed.meta = {
  category: 'hola'
};

module.exports = MinVulnerabilityAllowed;
