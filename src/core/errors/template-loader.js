/**
 * @fileoverview Error template loader.
 *
 */

'use strict';

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

/**
 * Loads predefined error templates
 *
 * @class TemplateLoader
 */
class TemplateLoader {
  /**
   * Set the template ID for the loader
   * @param {String} templateId
   * @returns {void}
   */
  setTemplateId(templateId) {
    this._templatePath = path.resolve(__dirname, `./messages/${templateId}.txt`);
  }

  /**
   * Returns if the error template exists
   * @returns {Boolean}
   */
  exist() {
    return fs.existsSync(this._templatePath);
  }

  /**
   * Loads template with lodash.template
   * @returns {Function} Lodash.template parameters interpolate function
   */
  load() {
    return lodash.template(fs.readFileSync(this._templatePath, 'utf-8'));
  }
}

module.exports = TemplateLoader;