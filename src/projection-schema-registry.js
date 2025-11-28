import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {validateProjectionSchema} from './validate-projection-schema.js';

/**
 * Projection schema registry.
 */
export class ProjectionSchemaRegistry extends Service {
  /**
   * Schema map.
   */
  _schemas = new Map();

  /**
   * Define schema.
   *
   * @param {string} name
   * @param {object} schema
   * @returns {this}
   */
  defineSchema(name, schema) {
    if (!name || typeof name !== 'string') {
      throw new InvalidArgumentError(
        'Schema name must be a non-empty String, but %v was given.',
        name,
      );
    }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
      throw new InvalidArgumentError(
        'Projection schema must be an Object, but %v was given.',
        schema,
      );
    }
    if (this._schemas.has(name)) {
      throw new InvalidArgumentError(
        'Projection schema %v is already registered.',
        name,
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
    if (!name || typeof name !== 'string') {
      throw new InvalidArgumentError(
        'Schema name must be a non-empty String, but %v was given.',
        name,
      );
    }
    const schema = this._schemas.get(name);
    if (!schema) {
      throw new InvalidArgumentError(
        'Projection schema %v is not found.',
        name,
      );
    }
    return schema;
  }
}
