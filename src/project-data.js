import {InvalidArgumentError} from '@e22m4u/js-format';
import {validateProjectionSchema} from './validate-projection-schema.js';

/**
 * Project data.
 *
 * @param {object|string} schemaOrName
 * @param {object} data
 * @param {object|undefined} options
 * @returns {*}
 */
export function projectData(schemaOrName, data, options = undefined) {
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
    if (
      options.resolver !== undefined &&
      (!options.resolver || typeof options.resolver !== 'function')
    ) {
      throw new InvalidArgumentError(
        'Option "resolver" must be a Function, but %v was given.',
        options.resolver,
      );
    }
  }
  const strict = Boolean(options && options.strict);
  const scope = (options && options.scope) || undefined;
  const resolver = (options && options.resolver) || undefined;
  // если вместо схемы передана строка,
  // то строка используется как название
  // зарегистрированной схемы проекции
  let schema = schemaOrName;
  if (typeof schemaOrName === 'string') {
    if (!resolver) {
      throw new InvalidArgumentError(
        'Unable to resolve the named schema %v without ' +
          'a specified projection schema resolver.',
        schemaOrName,
      );
    }
    schema = resolver(schemaOrName);
    // если не удалось извлечь схему проекции
    // по имени, то выбрасывается ошибка
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
      throw new InvalidArgumentError(
        'Projection schema resolver must return an Object, but %v was given.',
        schema,
      );
    }
  }
  // валидация полученной схемы проекции
  // без проверки вложенных схем (shallowMode)
  validateProjectionSchema(schema, true);
  // если данные не являются объектом (null, undefined, примитив),
  // то значение возвращается без изменений
  if (data === null || typeof data !== 'object') {
    return data;
  }
  // если данные являются массивом, то проекция
  // применяется к каждому элементу
  if (Array.isArray(data)) {
    return data.map(item =>
      projectData(schema, item, {strict, scope, resolver}),
    );
  }
  // если данные являются объектом,
  // то создается проекция согласно схеме
  const result = {};
  // в обычном режиме итерация выполняется по ключам исходного
  // объекта, а в строгом режиме по ключам, описанным в схеме
  // (исключая ключи прототипа Object.keys(x))
  const keys = Object.keys(strict ? schema : data);
  for (const key of keys) {
    // если свойство отсутствует в исходных
    // данных, то свойство игнорируется
    if (!(key in data)) continue;
    const propOptionsOrBoolean = schema[key];
    // проверка доступности свойства для данной
    // области проекции (если определена)
    if (_shouldSelect(propOptionsOrBoolean, strict, scope)) {
      const value = data[key];
      // если определена вложенная схема,
      // то проекция применяется рекурсивно
      if (
        propOptionsOrBoolean &&
        typeof propOptionsOrBoolean === 'object' &&
        propOptionsOrBoolean.schema
      ) {
        result[key] = projectData(propOptionsOrBoolean.schema, value, {
          strict,
          scope,
          resolver,
        });
      }
      // иначе значение присваивается
      // свойству без изменений
      else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Should select (internal).
 *
 * Определяет, следует ли включать свойство в результат.
 * Приоритет: правило для области -> общее правило -> по умолчанию true.
 *
 * @param {object|boolean|undefined} propOptionsOrBoolean
 * @param {boolean|undefined} strict
 * @param {string|undefined} scope
 * @returns {boolean}
 */
function _shouldSelect(propOptionsOrBoolean, strict, scope) {
  // если настройки свойства являются логическим значением,
  // то значение используется как индикатор видимости
  if (typeof propOptionsOrBoolean === 'boolean') {
    return propOptionsOrBoolean;
  }
  // если настройки свойства являются объектом,
  // то проверяется правило области и общее правило
  if (typeof propOptionsOrBoolean === 'object') {
    const propOptions = propOptionsOrBoolean;
    // если определена область проекции,
    // то выполняется проверка правила области
    if (
      scope &&
      propOptions.scopes &&
      typeof propOptions.scopes === 'object' &&
      propOptions.scopes[scope] != null
    ) {
      const scopeOptionsOrBoolean = propOptions.scopes[scope];
      // если настройки области являются логическим значением,
      // то значение используется как индикатор видимости
      if (typeof scopeOptionsOrBoolean === 'boolean') {
        return scopeOptionsOrBoolean;
      }
      // если настройки области являются объектом,
      // то используется опция select
      if (
        scopeOptionsOrBoolean &&
        typeof scopeOptionsOrBoolean === 'object' &&
        typeof scopeOptionsOrBoolean.select === 'boolean'
      ) {
        return scopeOptionsOrBoolean.select;
      }
    }
    // если область проекции не указана,
    // то проверяется общее правило
    if (typeof propOptionsOrBoolean.select === 'boolean') {
      return propOptionsOrBoolean.select;
    }
  }
  // если для свойства нет правил, то свойство
  // по умолчанию доступно (недоступно в режиме strict)
  return !strict;
}
