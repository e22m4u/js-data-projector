import {Service} from '@e22m4u/js-service';
import {ProjectionSchema} from './projection-schema.js';

/**
 * Projection schema registry.
 */
export declare class ProjectionSchemaRegistry extends Service {
  /**
   * Define schema.
   *
   * @param name
   * @param schema
   */
  defineSchema(name: string, schema: ProjectionSchema): this;

  /**
   * Get schema.
   *
   * @param name
   */
  getSchema(name: string): ProjectionSchema;
}
