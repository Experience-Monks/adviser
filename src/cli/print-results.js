/**
 * @fileoverview Translate options from CLI to Engine.
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const logger = require('../utils/logger');

function printResults(engine, results, format, outputFile) {
  let formatter;

  try {
    formatter = engine.getFormatter(format);
  } catch (e) {
    logger.error(e.message);
    return false;
  }

  const output = formatter(results);

  if (output) {
    if (outputFile) {
      const filePath = path.resolve(process.cwd(), outputFile);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        logger.error('Cannot write to output file path, it is a directory: %s', outputFile);
        return false;
      }

      try {
        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, output);
      } catch (ex) {
        logger.error('There was a problem writing the output file:\n%s', ex);
        return false;
      }
    } else {
      logger.info(output);
    }
  }

  return true;
}

module.exports = printResults;
