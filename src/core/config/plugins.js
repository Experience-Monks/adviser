/**
 * @fileoverview Adviser Plugins.
 *
 */

'use strict';

const debug = require('debug')('adviser:plugins');

const Plugin = require('../plugin/plugin');

const PluginError = require('../errors/exceptions/plugin-error');

const { BLACKLIST_NAMES } = require('../constants/plugins');

/**
 * CRUD for the plugins
 *
 * @class Plugins
 */
class Plugins {
  constructor() {
    this._pluginScope = 'adviser-plugin-';
    this._plugins = {};
  }

  /**
   * Add plugin to the instance
   *
   * @param {String} pluginId
   * @param {Object} plugin
   * @memberof Plugins
   */
  add(plugin, PluginSource) {
    if (!plugin.id) return;

    const normalizePluginId = this._normalizePluginId(plugin.id);

    this._plugins[normalizePluginId] = new Plugin(plugin.id, plugin.settings, PluginSource);

    debug(`Plugin ${plugin.id} added`);
  }

  /**
   * Gets a plugin with the given name.
   * @param {string} pluginId The name of the plugin to retrieve.
   * @returns {Object} The plugin or null if not loaded.
   * @memberof Plugins
   */
  get(pluginId) {
    const normalizePluginId = this._normalizePluginId(pluginId);
    return this._plugins[normalizePluginId] || null;
  }

  /**
   * Returns all plugins that are loaded.
   * @returns {Object} The plugins cache.
   * @memberof Plugins
   */
  getAll() {
    return this._plugins;
  }

  /**
   * Return all the rules defined in the plugins
   *
   * @returns {Map} Rules
   * @memberof Plugins
   */
  getAllRules() {
    const allRules = new Map();

    Object.keys(this._plugins).forEach(pluginName => {
      const plugin = this.get(pluginName);

      if (plugin.definedRules) {
        Object.keys(plugin.definedRules).forEach(ruleId => {
          const qualifiedRuleId = `${pluginName}/${ruleId}`;
          const rule = plugin.definedRules[ruleId];

          allRules.set(qualifiedRuleId, {
            pluginName,
            ruleId,
            qualifiedRuleId,
            rule
          });
        });
      }
    });
    return allRules;
  }

  /**
   * Loads all plugins from an array.
   * @param {string[]} pluginNames An array of plugins names.
   * @returns {void}
   * @throws {Error} If a plugin cannot be loaded.
   */
  loadAll(plugins = [], directory) {
    plugins.forEach(plugin => {
      this.load(plugin, directory);
    });
  }

  /**
   * Loads a plugin
   *
   * @param {String} pluginId
   * @param {Path} directory
   * @memberof Plugins
   */
  load(plugin, directory) {
    if (BLACKLIST_NAMES.includes(plugin.id)) {
      throw new PluginError(
        'Invalid plugin name',
        plugin.id,
        `The plugin name ${plugin.id} can not be used because it has been blacklisted`
      );
    }

    if (plugin.id.match(/\s+/u)) {
      debug(`Failed to load plugin ${plugin.id}.`);
      throw new PluginError('Invalid plugin name', plugin.id, 'Whitespace found in the plugin name');
    }

    const normalizePluginId = this._normalizePluginId(plugin.id);

    if (!this._plugins[normalizePluginId]) {
      const pluginSource = this._loadFromDirectory(normalizePluginId, directory);
      this.add(plugin, pluginSource);
    }
  }

  /**
   * Destroy all the loaded plugins
   *
   * @memberof Plugins
   */
  reset() {
    this._plugins = {};
  }

  /**
   * Resolves and try to load a plugin
   *
   * @param {String} pluginId
   * @param {Path} directory
   * @returns
   * @memberof Plugins
   */
  _loadFromDirectory(pluginId, directory) {
    try {
      const pluginPath = require.resolve(pluginId, { paths: [directory] });
      return require(pluginPath);
    } catch (pluginLoadErr) {
      debug(`Failed to retrieve the path of the plugin ${pluginId}.`, pluginLoadErr);

      try {
        require.resolve(pluginId);
      } catch (missingPluginErr) {
        // If the plugin can't be resolved, display the missing plugin error (usually a config or install error)
        debug(`Failed to load plugin ${pluginId}.`, missingPluginErr);

        throw new PluginError(
          `Failed to load plugin ${pluginId}`,
          pluginId,
          `The plugin was not found, review if the name is right or is installed`
        );
      }

      // Otherwise, the plugin exists and is throwing on module load for some reason, so print the stack trace.
      throw new PluginError(
        `Failed to load plugin ${pluginId}`,
        pluginId,
        `There was an issue loading the plugin, trace: \n ${pluginLoadErr.message}`
      );
    }
  }

  /**
   * Add Plugin Scope if doesn't exist from the plugin Id
   *
   * @param {String} pluginId
   * @returns
   * @memberof Plugins
   */
  _normalizePluginId(pluginId) {
    if (pluginId.indexOf(this._pluginScope) < 0) {
      return `${this._pluginScope}${pluginId}`.toLowerCase();
    }

    return pluginId.toLowerCase();
  }
}

module.exports = new Plugins();
