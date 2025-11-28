import {Service} from '@e22m4u/js-service';
import {ProjectDataOptions} from './project-data.js';
import {ProjectionSchema} from './projection-schema.js';

/**
 * Data projector.
 */
export declare class DataProjector extends Service {
  /**
   * Define schema.
   *
   * @param name
   * @param schema
   */
  defineSchema(name: string, schema: ProjectionSchema): this;

  /**
   * Project.
   *
   * @param schemaOrName
   * @param data
   * @param options
   */
  project<T>(
    schemaOrName: string | ProjectionSchema,
    data: T,
    options?: Omit<ProjectDataOptions, 'resolver'>,
  ): T;

  /**
   * Project with "input" scope.
   *
   * @param schemaOrName
   * @param data
   * @param options
   */
  projectInput<T>(
    schemaOrName: string | ProjectionSchema,
    data: T,
    options?: Omit<ProjectDataOptions, 'resolver' | 'scope'>,
  ): T;

  /**
   * Project with "output" scope.
   *
   * @param schemaOrName
   * @param data
   * @param options
   */
  projectOutput<T>(
    schemaOrName: string | ProjectionSchema,
    data: T,
    options?: Omit<ProjectDataOptions, 'resolver' | 'scope'>,
  ): T;
}
