/**
 * Projection schema.
 */
export type ProjectionSchema = {
  [property: string]: boolean | ProjectionSchemaPropertyOptions | undefined;
}

/**
 * Projection schema property options.
 */
export type ProjectionSchemaPropertyOptions = {
  select?: boolean;
  scopes?: ProjectionSchemaScopes;
  schema?: string | ProjectionSchema;
}

/**
 * Projection schema scopes.
 */
export type ProjectionSchemaScopes = {
  [scope: string]: boolean | ProjectionSchemaScopeOptions | undefined;
}

/**
 * Projection schema scope options.
 */
export type ProjectionSchemaScopeOptions = {
  select?: boolean;
}
