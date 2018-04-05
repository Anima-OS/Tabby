"use strict";

var { utils: Cu } = Components;
var { Services } = Cu.import("resource://gre/modules/Services.jsm", {});
var { Loader, descriptor, resolveURI } = Cu.import("resource://gre/modules/commonjs/toolkit/loader.js", {});

this.EXPORTED_SYMBOLS = ["DevToolsLoader", "devtools", "BuiltinProvider",
                         "require", "loader"];

/**
 * Providers are different strategies for loading the devtools.
 */
var sharedGlobalBlocklist = ["sdk/indexed-db"];

/**
 * Used when the tools should be loaded from the Firefox package itself.
 * This is the default case.
 */
function BuiltinProvider() {}
BuiltinProvider.prototype = {
  load: function () {
    const paths = {
      // âš  DISCUSSION ON DEV-DEVELOPER-TOOLS REQUIRED BEFORE MODIFYING âš 
      "": "resource://gre/modules/commonjs/",
    };
    this.loader = new Loader.Loader({
      id: "fx-devtools",
      paths,
      sharedGlobal: true,
      sharedGlobalBlocklist,
      sandboxName: "DevTools (Module loader)",
      noSandboxAddonId: true,
      requireHook: (id, require) => {
        if (id.startsWith("raw!")) {
          return requireRawId(id, require);
        }
        return require(id);
      },
    });
  },

  unload: function (reason) {
    Loader.unload(this.loader, reason);
    delete this.loader;
  },
};

var gNextLoaderID = 0;

/**
 * The main devtools API. The standard instance of this loader is exported as
 * |devtools| below, but if a fresh copy of the loader is needed, then a new
 * one can also be created.
 */
this.DevToolsLoader = function DevToolsLoader() {
  this.require = this.require.bind(this);

  Services.obs.addObserver(this, "devtools-unload");
};

DevToolsLoader.prototype = {
  destroy: function (reason = "shutdown") {
    Services.obs.removeObserver(this, "devtools-unload");

    if (this._provider) {
      this._provider.unload(reason);
      delete this._provider;
    }
  },

  get provider() {
    if (!this._provider) {
      this._loadProvider();
    }
    return this._provider;
  },

  _provider: null,

  get id() {
    if (this._id) {
      return this._id;
    }
    this._id = ++gNextLoaderID;
    return this._id;
  },

  /**
   * A dummy version of require, in case a provider hasn't been chosen yet when
   * this is first called.  This will then be replaced by the real version.
   * @see setProvider
   */
  require: function () {
    if (!this._provider) {
      this._loadProvider();
    }
    return this.require.apply(this, arguments);
  },

  /**
   * Return true if |id| refers to something requiring help from a
   * loader plugin.
   */
  isLoaderPluginId: function (id) {
    return id.startsWith("raw!");
  },

  /**
   * Override the provider used to load the tools.
   */
  setProvider: function (provider) {
    if (provider === this._provider) {
      return;
    }

    if (this._provider) {
      delete this.require;
      this._provider.unload("newprovider");
    }
    this._provider = provider;

    this._provider.load();
    this.require = Loader.Require(this._provider.loader, { id: "devtools" });
  },

  /**
   * Choose a default tools provider based on the preferences.
   */
  _loadProvider: function () {
    this.setProvider(new BuiltinProvider());
  },

  /**
   * Handles "devtools-unload" event
   *
   * @param String data
   *    reason passed to modules when unloaded
   */
  observe: function (subject, topic, data) {
    if (topic != "devtools-unload") {
      return;
    }
    this.destroy(data);
  },
};

// Export the standard instance of DevToolsLoader used by the tools.
this.devtools = this.loader = new DevToolsLoader();

this.require = this.devtools.require.bind(this.devtools);

// For compatibility reasons, expose these symbols on "devtools":
Object.defineProperty(this.devtools, "Toolbox", {
  get: () => this.require("devtools/client/framework/toolbox").Toolbox
});
Object.defineProperty(this.devtools, "TargetFactory", {
  get: () => this.require("devtools/client/framework/target").TargetFactory
});
