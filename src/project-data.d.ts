import {ProjectionSchema} from './projection-schema.js';

/**
 * Projection schema resolver.
 */
export type ProjectionSchemaResolver = (
  schemaName: string,
) => ProjectionSchema;

/**
 * Project data options.
 */
export type ProjectDataOptions = {
  strict?: boolean;
  scope?: string;
  resolver?: ProjectionSchemaResolver;
};

/**
 * Project data.
 *
 * @param schemaOrName
 * @param data
 * @param options
 */
export declare function projectData<T>(
  schemaOrName: string | ProjectionSchema,
  data: T,
  options?: ProjectDataOptions,
): T;
