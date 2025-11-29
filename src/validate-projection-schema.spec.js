import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {validateProjectionSchema} from './validate-projection-schema.js';

describe('validateProjectionSchema', function () {
  it('should require the schema argument to be a object', function () {
    const throwable = v => () => validateProjectionSchema(v);
    const error = s =>
      format('Projection schema must be an Object, but %s was given.', s);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable({})();
  });

  it('should require the shallowMode parameter to be a boolean', function () {
    const throwable = v => () => validateProjectionSchema({}, v);
    const error = s =>
      format('Parameter "shallowMode" must be a Boolean, but %s was given.', s);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(null)).to.throw(error('null'));
    throwable(true)();
    throwable(false)();
    throwable(undefined)();
  });

  it('should require schema properties to be a boolean or an object', function () {
    const throwable = v => () => validateProjectionSchema({foo: v});
    const error = s =>
      format(
        'Property options must be a Boolean or an Object, but %s was given.',
        s,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    throwable({})();
    throwable(true)();
    throwable(false)();
    throwable(undefined)();
  });

  it('should require the property option "select" to be a boolean', function () {
    const throwable = v => () => validateProjectionSchema({foo: {select: v}});
    const error = s =>
      format(
        'Property option "select" must be a Boolean, but %s was given.',
        s,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    throwable(true)();
    throwable(false)();
    throwable(undefined)();
  });

  it('should require the property option "schema" to be an object or a non-empty string', function () {
    const throwable = v => () => validateProjectionSchema({foo: {schema: v}});
    const error = s =>
      format(
        'Embedded schema must be an Object or a non-empty String ' +
          'that represents a schema name, but %s was given.',
        s,
      );
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    throwable('str')();
    throwable({})();
    throwable(undefined)();
  });

  it('should require the property option "scopes" to be an object', function () {
    const throwable = v => () => validateProjectionSchema({foo: {scopes: v}});
    const error = s =>
      format(
        'Property option "scopes" must be an Object, but %s was given.',
        s,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    throwable({})();
    throwable(undefined)();
  });

  it('should require scope options to be a boolean or an object', function () {
    const throwable = v => () =>
      validateProjectionSchema({foo: {scopes: {input: v}}});
    const error = s =>
      format(
        'Scope options must be a Boolean or an Object, but %s was given.',
        s,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    throwable({})();
    throwable(true)();
    throwable(false)();
    throwable(undefined)();
  });

  it('should require the scope option "select" to be a boolean', function () {
    const throwable = v => () =>
      validateProjectionSchema({foo: {scopes: {input: {select: v}}}});
    const error = s =>
      format('Scope option "select" must be a Boolean, but %s was given.', s);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(null)).to.throw(error('null'));
    throwable(true)();
    throwable(false)();
    throwable(undefined)();
  });

  it('should allow nested schema', function () {
    validateProjectionSchema({
      foo: {
        select: true,
        schema: {
          bar: {
            select: true,
          },
        },
      },
      baz: {
        select: false,
        schema: {
          qux: {
            select: false,
          },
        },
      },
    });
  });

  it('should allow a projection name in the "schema" option', function () {
    validateProjectionSchema({foo: {schema: 'mySchema'}});
    validateProjectionSchema({foo: {schema: {bar: {schema: 'mySchema'}}}});
  });

  it('should validate root schema in shallow mode', function () {
    // @ts-ignore
    const throwable = () => validateProjectionSchema({foo: 10}, true);
    expect(throwable).to.throw(
      'Property options must be a Boolean or an Object, but 10 was given.',
    );
  });

  it('should skip nested schema checking in shallow mode', function () {
    // @ts-ignore
    validateProjectionSchema({foo: {schema: {prop: 10}}}, true);
  });
});
