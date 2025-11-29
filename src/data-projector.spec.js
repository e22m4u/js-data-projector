import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataProjector} from './data-projector.js';
import {ProjectionSchemaRegistry} from './projection-schema-registry.js';

describe('DataProjector', function () {
  describe('defineSchema', function () {
    it('should require the name parameter to be a non-empty string', function () {
      const S = new DataProjector();
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
      const S = new DataProjector();
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
      const S = new DataProjector();
      S.defineSchema('mySchema', {});
      const throwable = () => S.defineSchema('mySchema', {});
      expect(throwable).to.throw(
        'Projection schema "mySchema" is already registered.',
      );
    });

    it('should register the given schema', function () {
      const S = new DataProjector();
      const registry = S.getService(ProjectionSchemaRegistry);
      const schema = {foo: true, bar: false};
      S.defineSchema('mySchema', schema);
      expect(registry.getSchema('mySchema')).to.be.eql(schema);
    });

    it('should return this', function () {
      const S = new DataProjector();
      const res = S.defineSchema('mySchema', {});
      expect(res).to.be.eq(S);
    });
  });

  describe('project', function () {
    it('should require the parameter "schemaOrName" to be a non-empty string or an object', function () {
      const S = new DataProjector();
      S.defineSchema('mySchema', {});
      const throwable = v => () => S.project(v, {});
      const error = s =>
        format(
          'Projection schema must be an Object or a non-empty String ' +
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
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable('mySchema')();
      throwable({})();
    });

    it('should require the parameter "options" to be an object', function () {
      const S = new DataProjector();
      const throwable = v => () => S.project({}, {}, v);
      const error = s =>
        format('Parameter "options" must be an Object, but %s was given.', s);
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

    it('should require the option "strict" to be a boolean', function () {
      const S = new DataProjector();
      const throwable = v => () => S.project({}, {}, {strict: v});
      const error = s =>
        format('Option "strict" must be a Boolean, but %s was given.', s);
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

    it('should require the option "scope" to be a non-empty string', function () {
      const S = new DataProjector();
      const throwable = v => () => S.project({}, {}, {scope: v});
      const error = s =>
        format(
          'Option "scope" must be a non-empty String, but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
      throwable(undefined)();
    });

    it('should throw an error when the resolver option is provided', function () {
      const S = new DataProjector();
      // @ts-ignore
      const throwable = v => () => S.project({}, {}, {resolver: v});
      const error = 'Option "resolver" is not supported for the DataProjector.';
      expect(throwable('str')).to.throw(error);
      expect(throwable('')).to.throw(error);
      expect(throwable(10)).to.throw(error);
      expect(throwable(0)).to.throw(error);
      expect(throwable(true)).to.throw(error);
      expect(throwable(false)).to.throw(error);
      expect(throwable([])).to.throw(error);
      expect(throwable({})).to.throw(error);
      expect(throwable(null)).to.throw(error);
      throwable(undefined)();
    });

    it('should validate the given schema object', function () {
      const S = new DataProjector();
      // @ts-ignore
      const throwable = () => S.project({foo: 10}, {foo: 'bar'});
      expect(throwable).to.throw(
        'Property options must be a Boolean or an Object, but 10 was given.',
      );
    });

    it('should throw an error if the schema name is not registered', function () {
      const S = new DataProjector();
      const throwable = () => S.project('unknown', {});
      expect(throwable).to.throw('Projection schema "unknown" is not found.');
    });

    it('should return non-object values as is', function () {
      const S = new DataProjector();
      const schema = {foo: {select: true}};
      expect(S.project(schema, 'str')).to.be.eq('str');
      expect(S.project(schema, '')).to.be.eq('');
      expect(S.project(schema, 10)).to.be.eq(10);
      expect(S.project(schema, 0)).to.be.eq(0);
      expect(S.project(schema, true)).to.be.eq(true);
      expect(S.project(schema, false)).to.be.eq(false);
      expect(S.project(schema, undefined)).to.be.eq(undefined);
      expect(S.project(schema, null)).to.be.eq(null);
    });

    it('should add properties without rules by default', function () {
      const S = new DataProjector();
      expect(S.project({}, {foo: 10, bar: 20})).to.be.eql({
        foo: 10,
        bar: 20,
      });
    });

    it('should project fields by a boolean value', function () {
      const S = new DataProjector();
      const schema = {foo: true, bar: false};
      const data = {foo: 10, bar: 20, baz: 30};
      expect(S.project(schema, data)).to.be.eql({foo: 10, baz: 30});
    });

    it('should project fields by the select option', function () {
      const S = new DataProjector();
      const schema = {foo: {select: true}, bar: {select: false}};
      const data = {foo: 10, bar: 20};
      expect(S.project(schema, data)).to.be.eql({foo: 10});
    });

    it('should project fields by the schema name', function () {
      const S = new DataProjector();
      S.defineSchema('user', {id: true, email: false});
      const data = {id: 1, email: 'test@example.com', name: 'John'};
      expect(S.project('user', data)).to.be.eql({id: 1, name: 'John'});
    });

    it('should apply projection to an array of items', function () {
      const S = new DataProjector();
      const schema = {id: {select: true}, secret: {select: false}};
      const data = [
        {id: 1, secret: 'A'},
        {id: 2, secret: 'B'},
      ];
      expect(S.project(schema, data)).to.be.eql([{id: 1}, {id: 2}]);
    });

    describe('strict mode', function () {
      it('should ignore properties not present in schema when strict mode is enabled', function () {
        const S = new DataProjector();
        const schema = {id: {select: true}};
        const data = {id: 1, other: 'value'};
        expect(S.project(schema, data, {strict: true})).to.be.eql({id: 1});
      });

      it('should project fields by a boolean value', function () {
        const S = new DataProjector();
        const schema = {foo: true, bar: false};
        const data = {foo: 1, bar: 2, baz: 3};
        expect(S.project(schema, data, {strict: true})).to.be.eql({foo: 1});
      });

      it('should default to hidden in strict mode if no rules are provided', function () {
        const S = new DataProjector();
        const schema = {id: {}};
        const data = {id: 1};
        expect(S.project(schema, data, {strict: true})).to.be.eql({});
      });

      it('should skip properties present in schema but missing in data', function () {
        const S = new DataProjector();
        const schema = {
          existing: {select: true},
          missing: {select: true},
        };
        const data = {existing: 1};
        expect(S.project(schema, data, {strict: true})).to.be.eql({
          existing: 1,
        });
      });
    });

    describe('projection scopes', function () {
      it('should apply scope-specific selection rules', function () {
        const S = new DataProjector();
        const schema = {
          foo: {
            select: false,
            scopes: {
              input: {select: true},
            },
          },
          bar: {select: true},
        };
        const data = {foo: 10, bar: 20};
        expect(S.project(schema, data)).to.be.eql({bar: 20});
        expect(S.project(schema, data, {scope: 'input'})).to.be.eql({
          foo: 10,
          bar: 20,
        });
      });

      it('should fallback to general rule if scope rule is missing', function () {
        const S = new DataProjector();
        const schema = {
          foo: {
            select: true,
            scopes: {
              output: {select: false},
            },
          },
        };
        const data = {foo: 10};
        expect(S.project(schema, data, {scope: 'input'})).to.be.eql({
          foo: 10,
        });
      });

      it('should fallback to the general rule if the scope options exists but lacks the select option', function () {
        const S = new DataProjector();
        const schema = {
          foo: {
            select: true,
            scopes: {
              input: {},
            },
          },
          bar: {
            select: false,
            scopes: {
              input: {},
            },
          },
        };
        const data = {foo: 10, bar: 20};
        const result = S.project(schema, data, {scope: 'input'});
        expect(result).to.be.eql({foo: 10});
      });
    });

    describe('nested schema', function () {
      it('should apply nested schema recursively', function () {
        const S = new DataProjector();
        const schema = {user: {schema: {password: false}}};
        const data = {user: {id: 1, password: '123'}};
        expect(S.project(schema, data)).to.be.eql({user: {id: 1}});
      });

      it('should apply nested registered schema by a name', function () {
        const S = new DataProjector();
        S.defineSchema('address', {zip: {select: false}});
        const schema = {location: {schema: 'address'}};
        const data = {location: {city: 'City', zip: '12345'}};
        expect(S.project(schema, data)).to.be.eql({location: {city: 'City'}});
      });

      it('should apply nested schema to array of objects', function () {
        const S = new DataProjector();
        const schema = {items: {schema: {hidden: false}}};
        const data = {
          items: [
            {id: 1, hidden: 'x'},
            {id: 2, hidden: 'y'},
          ],
        };
        expect(S.project(schema, data)).to.be.eql({items: [{id: 1}, {id: 2}]});
      });

      it('should handle null or undefined in nested data', function () {
        const S = new DataProjector();
        const schema = {nested: {schema: {foo: true}}};
        expect(S.project(schema, {nested: null})).to.be.eql({nested: null});
        expect(S.project(schema, {nested: undefined})).to.be.eql({
          nested: undefined,
        });
      });
    });
  });

  describe('projectInput', function () {
    it('should apply the given schema with the input scope', function () {
      const S = new DataProjector();
      const schema = {
        foo: {scopes: {input: true, output: false}},
        bar: {scopes: {input: false, output: true}},
      };
      const res = S.projectInput(schema, {foo: 10, bar: 20});
      expect(res).to.be.eql({foo: 10});
    });
  });

  describe('projectOutput', function () {
    it('should apply the given schema with the output scope', function () {
      const S = new DataProjector();
      const schema = {
        foo: {scopes: {input: true, output: false}},
        bar: {scopes: {input: false, output: true}},
      };
      const res = S.projectOutput(schema, {foo: 10, bar: 20});
      expect(res).to.be.eql({bar: 20});
    });
  });
});
