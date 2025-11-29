var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  DataProjector: () => DataProjector,
  ProjectionSchemaRegistry: () => ProjectionSchemaRegistry,
  ProjectionScope: () => ProjectionScope,
  projectData: () => projectData,
  validateProjectionSchema: () => validateProjectionSchema
});
module.exports = __toCommonJS(index_exports);

// src/project-data.js
var import_js_format2 = require("@e22m4u/js-format");

// src/validate-projection-schema.js
var import_js_format = require("@e22m4u/js-format");
function validateProjectionSchema(schema, shallowMode = false) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    throw new import_js_format.InvalidArgumentError(
      "Projection schema must be an Object, but %v was given.",
      schema
    );
  }
  if (typeof shallowMode !== "boolean") {
    throw new import_js_format.InvalidArgumentError(
      'Parameter "shallowMode" must be a Boolean, but %v was given.',
      shallowMode
    );
  }
  Object.keys(schema).forEach((propName) => {
    const options = schema[propName];
    if (options === void 0) {
      return;
    }
    if (options === null || typeof options !== "boolean" && typeof options !== "object" || Array.isArray(options)) {
      throw new import_js_format.InvalidArgumentError(
        "Property options must be a Boolean or an Object, but %v was given.",
        options
      );
    }
    if (typeof options === "boolean") {
      return;
    }
    if (options.select !== void 0 && typeof options.select !== "boolean") {
      throw new import_js_format.InvalidArgumentError(
        'Property option "select" must be a Boolean, but %v was given.',
        options.select
      );
    }
    if (options.schema !== void 0) {
      if (!options.schema || typeof options.schema !== "string" && typeof options.schema !== "object" || Array.isArray(options.schema)) {
        throw new import_js_format.InvalidArgumentError(
          "Embedded schema must be an Object or a non-empty String that represents a schema name, but %v was given.",
          options.schema
        );
      }
      if (!shallowMode && typeof options.schema === "object") {
        validateProjectionSchema(options.schema, shallowMode);
      }
    }
    if (options.scopes !== void 0) {
      if (!options.scopes || typeof options.scopes !== "object" || Array.isArray(options.scopes)) {
        throw new import_js_format.InvalidArgumentError(
          'Property option "scopes" must be an Object, but %v was given.',
          options.scopes
        );
      }
      Object.keys(options.scopes).forEach((scopeName) => {
        const scopeOptions = options.scopes[scopeName];
        if (scopeOptions === void 0) {
          return;
        }
        if (scopeOptions === null || typeof scopeOptions !== "boolean" && typeof scopeOptions !== "object" || Array.isArray(scopeOptions)) {
          throw new import_js_format.InvalidArgumentError(
            "Scope options must be a Boolean or an Object, but %v was given.",
            scopeOptions
          );
        }
        if (typeof scopeOptions === "boolean") {
          return;
        }
        if (scopeOptions.select !== void 0) {
          if (typeof scopeOptions.select !== "boolean") {
            throw new import_js_format.InvalidArgumentError(
              'Scope option "select" must be a Boolean, but %v was given.',
              scopeOptions.select
            );
          }
        }
      });
    }
  });
}
__name(validateProjectionSchema, "validateProjectionSchema");

// src/project-data.js
function projectData(schemaOrName, data, options = void 0) {
  if (!schemaOrName || typeof schemaOrName !== "string" && typeof schemaOrName !== "object" || Array.isArray(schemaOrName)) {
    throw new import_js_format2.InvalidArgumentError(
      "Projection schema must be an Object or a non-empty String that represents a schema name, but %v was given.",
      schemaOrName
    );
  }
  if (options !== void 0) {
    if (!options || typeof options !== "object" || Array.isArray(options)) {
      throw new import_js_format2.InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options
      );
    }
    if (options.strict !== void 0 && typeof options.strict !== "boolean") {
      throw new import_js_format2.InvalidArgumentError(
        'Option "strict" must be a Boolean, but %v was given.',
        options.strict
      );
    }
    if (options.scope !== void 0 && (!options.scope || typeof options.scope !== "string")) {
      throw new import_js_format2.InvalidArgumentError(
        'Option "scope" must be a non-empty String, but %v was given.',
        options.scope
      );
    }
    if (options.resolver !== void 0 && (!options.resolver || typeof options.resolver !== "function")) {
      throw new import_js_format2.InvalidArgumentError(
        'Option "resolver" must be a Function, but %v was given.',
        options.resolver
      );
    }
  }
  const strict = Boolean(options && options.strict);
  const scope = options && options.scope || void 0;
  const resolver = options && options.resolver || void 0;
  let schema = schemaOrName;
  if (typeof schemaOrName === "string") {
    if (!resolver) {
      throw new import_js_format2.InvalidArgumentError(
        "Unable to resolve the named schema %v without a specified projection schema resolver.",
        schemaOrName
      );
    }
    schema = resolver(schemaOrName);
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
      throw new import_js_format2.InvalidArgumentError(
        "Projection schema resolver must return an Object, but %v was given.",
        schema
      );
    }
  }
  validateProjectionSchema(schema, true);
  if (data === null || typeof data !== "object") {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(
      (item) => projectData(schema, item, { strict, scope, resolver })
    );
  }
  const result = {};
  const keys = Object.keys(strict ? schema : data);
  for (const key of keys) {
    if (!(key in data)) continue;
    const propOptionsOrBoolean = schema[key];
    if (_shouldSelect(propOptionsOrBoolean, strict, scope)) {
      const value = data[key];
      if (propOptionsOrBoolean && typeof propOptionsOrBoolean === "object" && propOptionsOrBoolean.schema) {
        result[key] = projectData(propOptionsOrBoolean.schema, value, {
          strict,
          scope,
          resolver
        });
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
__name(projectData, "projectData");
function _shouldSelect(propOptionsOrBoolean, strict, scope) {
  if (typeof propOptionsOrBoolean === "boolean") {
    return propOptionsOrBoolean;
  }
  if (typeof propOptionsOrBoolean === "object") {
    const propOptions = propOptionsOrBoolean;
    if (scope && propOptions.scopes && typeof propOptions.scopes === "object" && propOptions.scopes[scope] != null) {
      const scopeOptionsOrBoolean = propOptions.scopes[scope];
      if (typeof scopeOptionsOrBoolean === "boolean") {
        return scopeOptionsOrBoolean;
      }
      if (scopeOptionsOrBoolean && typeof scopeOptionsOrBoolean === "object" && typeof scopeOptionsOrBoolean.select === "boolean") {
        return scopeOptionsOrBoolean.select;
      }
    }
    if (typeof propOptionsOrBoolean.select === "boolean") {
      return propOptionsOrBoolean.select;
    }
  }
  return !strict;
}
__name(_shouldSelect, "_shouldSelect");

// src/data-projector.js
var import_js_service2 = require("@e22m4u/js-service");

// src/projection-scope.js
var ProjectionScope = {
  INPUT: "input",
  OUTPUT: "output"
};

// src/data-projector.js
var import_js_format4 = require("@e22m4u/js-format");

// src/projection-schema-registry.js
var import_js_service = require("@e22m4u/js-service");
var import_js_format3 = require("@e22m4u/js-format");
var _ProjectionSchemaRegistry = class _ProjectionSchemaRegistry extends import_js_service.Service {
  /**
   * Schema map.
   */
  _schemas = /* @__PURE__ */ new Map();
  /**
   * Define schema.
   *
   * @param {string} name
   * @param {object} schema
   * @returns {this}
   */
  defineSchema(name, schema) {
    if (!name || typeof name !== "string") {
      throw new import_js_format3.InvalidArgumentError(
        "Schema name must be a non-empty String, but %v was given.",
        name
      );
    }
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
      throw new import_js_format3.InvalidArgumentError(
        "Projection schema must be an Object, but %v was given.",
        schema
      );
    }
    if (this._schemas.has(name)) {
      throw new import_js_format3.InvalidArgumentError(
        "Projection schema %v is already registered.",
        name
      );
    }
    validateProjectionSchema(schema);
    this._schemas.set(name, schema);
    return this;
  }
  /**
   * Get schema.
   *
   * @param {string} name
   * @returns {object}
   */
  getSchema(name) {
    if (!name || typeof name !== "string") {
      throw new import_js_format3.InvalidArgumentError(
        "Schema name must be a non-empty String, but %v was given.",
        name
      );
    }
    const schema = this._schemas.get(name);
    if (!schema) {
      throw new import_js_format3.InvalidArgumentError(
        "Projection schema %v is not found.",
        name
      );
    }
    return schema;
  }
};
__name(_ProjectionSchemaRegistry, "ProjectionSchemaRegistry");
var ProjectionSchemaRegistry = _ProjectionSchemaRegistry;

// src/data-projector.js
var _DataProjector = class _DataProjector extends import_js_service2.Service {
  /**
   * Define schema.
   *
   * @param {string} name
   * @param {object} schema
   * @returns {this}
   */
  defineSchema(name, schema) {
    this.getService(ProjectionSchemaRegistry).defineSchema(name, schema);
    return this;
  }
  /**
   * Project.
   *
   * @param {object|string} schemaOrName
   * @param {object} data
   * @param {object|undefined} options
   * @returns {*}
   */
  project(schemaOrName, data, options = void 0) {
    if (!schemaOrName || typeof schemaOrName !== "string" && typeof schemaOrName !== "object" || Array.isArray(schemaOrName)) {
      throw new import_js_format4.InvalidArgumentError(
        "Projection schema must be an Object or a non-empty String that represents a schema name, but %v was given.",
        schemaOrName
      );
    }
    if (options !== void 0) {
      if (!options || typeof options !== "object" || Array.isArray(options)) {
        throw new import_js_format4.InvalidArgumentError(
          'Parameter "options" must be an Object, but %v was given.',
          options
        );
      }
      if (options.strict !== void 0 && typeof options.strict !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "strict" must be a Boolean, but %v was given.',
          options.strict
        );
      }
      if (options.scope !== void 0 && (!options.scope || typeof options.scope !== "string")) {
        throw new import_js_format4.InvalidArgumentError(
          'Option "scope" must be a non-empty String, but %v was given.',
          options.scope
        );
      }
      if (options.resolver !== void 0) {
        throw new import_js_format4.InvalidArgumentError(
          'Option "resolver" is not supported for the DataProjector.'
        );
      }
    }
    const registry = this.getService(ProjectionSchemaRegistry);
    return projectData(schemaOrName, data, {
      ...options,
      resolver: /* @__PURE__ */ __name((name) => registry.getSchema(name), "resolver")
    });
  }
  /**
   * Project with "input" scope.
   *
   * @param {object|string} schemaOrName
   * @param {object} data
   * @param {object|undefined} options
   * @returns {*}
   */
  projectInput(schemaOrName, data, options = void 0) {
    options = { ...options, scope: ProjectionScope.INPUT };
    return this.project(schemaOrName, data, options);
  }
  /**
   * Project with "output" scope.
   *
   * @param {object|string} schemaOrName
   * @param {object} data
   * @param {object|undefined} options
   * @returns {*}
   */
  projectOutput(schemaOrName, data, options = void 0) {
    options = { ...options, scope: ProjectionScope.OUTPUT };
    return this.project(schemaOrName, data, options);
  }
};
__name(_DataProjector, "DataProjector");
var DataProjector = _DataProjector;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DataProjector,
  ProjectionSchemaRegistry,
  ProjectionScope,
  projectData,
  validateProjectionSchema
});
