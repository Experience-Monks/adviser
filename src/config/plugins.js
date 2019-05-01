'use strict';

const debug = require('debug')('sentinal:plugins');

class Plugins {
  /**
   * Creates the plugins context
   * @param {Environments} environmentContext - env context
   * @param {function(string, Rule): void} defineRule - Callback for when a plugin is defined which introduces rules
   */
  constructor(currentDirectory) {
    this.currentDirectory = currentDirectory;

    this._plugins = Object.create(null);
  }

  /**
   * Gets a plugin with the given name.
   * @param {string} pluginName The name of the plugin to retrieve.
   * @returns {Object} The plugin or null if not loaded.
   */
  get(pluginName) {
    return this._plugins[pluginName] || null;
  }

  /**
   * Returns all plugins that are loaded.
   * @returns {Object} The plugins cache.
   */
  getAll() {
    return this._plugins;
  }

  /**
   * Loads all plugins from an array.
   * @param {string[]} pluginNames An array of plugins names.
   * @returns {void}
   * @throws {Error} If a plugin cannot be loaded.
   * @throws {Error} If "plugins" in config is not an array
   */
  loadAll(pluginNames) {
    // if "plugins" in config is not an array, throw an error so user can fix their config.
    if (!Array.isArray(pluginNames)) {
      const pluginNotArrayMessage = 'Sentinal configuration error: "plugins" value must be an array';

      debug(`${pluginNotArrayMessage}: ${JSON.stringify(pluginNames)}`);

      throw new Error(pluginNotArrayMessage); // TODO: Change Error Instance to a custom error with message
    }

    // load each plugin by name
    pluginNames.forEach(this.load, this);
  }

  load(pluginName) {
    const normalizePluginName = this.normalizePluginName(pluginName);
    let plugin = null;

    if (normalizePluginName.match(/\s+/u)) {
      throw new Error(`Whitespace found in plugin name '${pluginName}'`); // TODO: Change for custom Error object
    }

    if (!this._plugins[normalizePluginName]) {
      try {
        const pluginPath = require.resolve(normalizePluginName, { paths: [this.currentDirectory] });
        plugin = require(pluginPath);
      } catch (pluginLoadErr) {
        try {
          require.resolve(normalizePluginName);
        } catch (missingPluginErr) {
          // If the plugin can't be resolved, display the missing plugin error (usually a config or install error)
          debug(`Failed to load plugin ${normalizePluginName}.`);

          throw new Error(`Failed to load plugin ${pluginName}: ${missingPluginErr.message}`); // TODO: Change by custom Error
        }

        // Otherwise, the plugin exists and is throwing on module load for some reason, so print the stack trace.
        throw pluginLoadErr;
      }

      this.define(pluginName, plugin);
    }
  }

  define(pluginName, plugin) {
    const normalizePluginName = this.normalizePluginName(pluginName);

    this._plugins[normalizePluginName] = plugin;
  }

  normalizePluginName(pluginName) {
    return `sentinal-plugin-${pluginName}`.toLowerCase();
  }
}

module.exports = Plugins;
