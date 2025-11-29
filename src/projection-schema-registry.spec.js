import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ProjectionSchemaRegistry} from './projection-schema-registry.js';

describe('ProjectionSchemaRegistry', function () {
  describe('defineSchema', function () {
    it('should require the name parameter to be a non-empty string', function () {
      const S = new ProjectionSchemaRegistry();
      const throwable = v => () => S.defineSchema(v, {});
      const error = s =>
        format('Schema name must be a non-empty String, but %s was given.', s);
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable('mySchema')();
    });

    it('should require the schema parameter to be an object', function () {
      const S = new ProjectionSchemaRegistry();
      const throwable = v => () => S.defineSchema('mySchema', v);
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

    it('should throw an error if the name is already registered', function () {
      const S = new ProjectionSchemaRegistry();
      S.defineSchema('mySchema', {});
      const throwable = () => S.defineSchema('mySchema', {});
      expect(throwable).to.throw(
        'Projection schema "mySchema" is already registered.',
      );
    });

    it('should register the given schema', function () {
      const S = new ProjectionSchemaRegistry();
      const schema = {foo: true, bar: false};
      S.defineSchema('mySchema', schema);
      expect(S['_schemas'].get('mySchema')).to.be.eql(schema);
    });

    it('should return this', function () {
      const S = new ProjectionSchemaRegistry();
      const res = S.defineSchema('mySchema', {});
      expect(res).to.be.eq(S);
    });
  });

  describe('getSchema', function () {
    it('should require the name parameter to be a non-empty string', function () {
      const S = new ProjectionSchemaRegistry();
      S.defineSchema('mySchema', {});
      const throwable = v => () => S.getSchema(v);
      const error = s =>
        format('Schema name must be a non-empty String, but %s was given.', s);
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable('mySchema')();
    });

    it('should throw an error if the name is not registered', function () {
      const S = new ProjectionSchemaRegistry();
      S.defineSchema('mySchema', {});
      const throwable = () => S.getSchema('unknown');
      expect(throwable).to.throw('Projection schema "unknown" is not found.');
    });

    it('should return the registered schema', function () {
      const S = new ProjectionSchemaRegistry();
      const schema = {foo: true, bar: false};
      S.defineSchema('mySchema', schema);
      const res = S.getSchema('mySchema');
      expect(res).to.be.eql(schema);
    });
  });
});
