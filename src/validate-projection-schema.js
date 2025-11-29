import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Validate projection schema.
 *
 * @param {object} schema
 * @param {boolean} shallowMode
 * @returns {undefined}
 */
export function validateProjectionSchema(schema, shallowMode = false) {
  // schema
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new InvalidArgumentError(
      'Projection schema must be an Object, but %v was given.',
      schema,
    );
  }
  // shallowMode
  if (typeof shallowMode !== 'boolean') {
    throw new InvalidArgumentError(
      'Parameter "shallowMode" must be a Boolean, but %v was given.',
      shallowMode,
    );
  }
  Object.keys(schema).forEach(propName => {
    // schema[k]
    const options = schema[propName];
    if (options === undefined) {
      return;
    }
    if (
      options === null ||
      (typeof options !== 'boolean' && typeof options !== 'object') ||
      Array.isArray(options)
    ) {
      throw new InvalidArgumentError(
        'Property options must be a Boolean or an Object, but %v was given.',
        options,
      );
    }
    if (typeof options === 'boolean') {
      return;
    }
    // schema[k].select
    if (options.select !== undefined && typeof options.select !== 'boolean') {
      throw new InvalidArgumentError(
        'Property option "select" must be a Boolean, but %v was given.',
        options.select,
      );
    }
    // schema[k].schema
    if (options.schema !== undefined) {
      if (
        !options.schema ||
        (typeof options.schema !== 'string' &&
          typeof options.schema !== 'object') ||
        Array.isArray(options.schema)
      ) {
        throw new InvalidArgumentError(
          'Embedded schema must be an Object or a non-empty String ' +
            'that represents a schema name, but %v was given.',
          options.schema,
        );
      }
      if (!shallowMode && typeof options.schema === 'object') {
        validateProjectionSchema(options.schema, shallowMode);
      }
    }
    // schema[k].scopes
    if (options.scopes !== undefined) {
      if (
        !options.scopes ||
        typeof options.scopes !== 'object' ||
        Array.isArray(options.scopes)
      ) {
        throw new InvalidArgumentError(
          'Property option "scopes" must be an Object, but %v was given.',
          options.scopes,
        );
      }
      Object.keys(options.scopes).forEach(scopeName => {
        // schema[k].scopes[k]
        const scopeOptions = options.scopes[scopeName];
        if (scopeOptions === undefined) {
          return;
        }
        if (
          scopeOptions === null ||
          (typeof scopeOptions !== 'boolean' &&
            typeof scopeOptions !== 'object') ||
          Array.isArray(scopeOptions)
        ) {
          throw new InvalidArgumentError(
            'Scope options must be a Boolean or an Object, but %v was given.',
            scopeOptions,
          );
        }
        if (typeof scopeOptions === 'boolean') {
          return;
        }
        // schema[k].scopes[k].select
        if (scopeOptions.select !== undefined) {
          if (typeof scopeOptions.select !== 'boolean') {
            throw new InvalidArgumentError(
              'Scope option "select" must be a Boolean, but %v was given.',
              scopeOptions.select,
            );
          }
        }
      });
    }
  });
}
