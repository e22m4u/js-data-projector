import {Service} from '@e22m4u/js-service';
import {projectData} from './project-data.js';
import {ProjectionScope} from './projection-scope.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {ProjectionSchemaRegistry} from './projection-schema-registry.js';

/**
 * Data projector.
 */
export class DataProjector extends Service {
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
  project(schemaOrName, data, options = undefined) {
    // schemaOrName
    if (
      !schemaOrName ||
      (typeof schemaOrName !== 'string' && typeof schemaOrName !== 'object') ||
      Array.isArray(schemaOrName)
    ) {
      throw new InvalidArgumentError(
        'Projection schema must be an Object or a non-empty String ' +
          'that represents a schema name, but %v was given.',
        schemaOrName,
      );
    }
    // options
    if (options !== undefined) {
      if (!options || typeof options !== 'object' || Array.isArray(options)) {
        throw new InvalidArgumentError(
          'Parameter "options" must be an Object, but %v was given.',
          options,
        );
      }
      // options.strict
      if (options.strict !== undefined && typeof options.strict !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "strict" must be a Boolean, but %v was given.',
          options.strict,
        );
      }
      // options.scope
      if (
        options.scope !== undefined &&
        (!options.scope || typeof options.scope !== 'string')
      ) {
        throw new InvalidArgumentError(
          'Option "scope" must be a non-empty String, but %v was given.',
          options.scope,
        );
      }
      // options.resolver
      if (options.resolver !== undefined) {
        throw new InvalidArgumentError(
          'Option "resolver" is not supported for the DataProjector.',
        );
      }
    }
    const registry = this.getService(ProjectionSchemaRegistry);
    return projectData(schemaOrName, data, {
      ...options,
      resolver: name => registry.getSchema(name),
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
  projectInput(schemaOrName, data, options = undefined) {
    options = {...options, scope: ProjectionScope.INPUT};
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
  projectOutput(schemaOrName, data, options = undefined) {
    options = {...options, scope: ProjectionScope.OUTPUT};
    return this.project(schemaOrName, data, options);
  }
}
