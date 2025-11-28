import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {projectData} from './project-data.js';

describe('projectData', function () {
  it('should require the parameter "schemaOrName" to be a non-empty string or an object', function () {
    const resolver = () => ({});
    const throwable = v => () => projectData(v, {}, {resolver});
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
    const throwable = v => () => projectData({}, {}, v);
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
    const throwable = v => () => projectData({}, {}, {strict: v});
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
    const throwable = v => () => projectData({}, {}, {scope: v});
    const error = s =>
      format('Option "scope" must be a non-empty String, but %s was given.', s);
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

  it('should require the option "resolver" to be a function', function () {
    const throwable = v => () => projectData({}, {}, {resolver: v});
    const error = s =>
      format('Option "resolver" must be a Function, but %s was given.', s);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(null)).to.throw(error('null'));
    throwable(() => undefined)();
    throwable(undefined)();
  });

  it('should throw an error if no resolver specified when a schema name is provided', function () {
    expect(() => projectData('mySchema', {})).to.throw(
      'Unable to resolve the named schema "mySchema" without ' +
        'a specified projection schema resolver.',
    );
  });

  it('should throw an error if the schema resolver returns an invalid value', function () {
    const throwable = v => () =>
      projectData('mySchema', {}, {resolver: () => v});
    const error = s =>
      format(
        'Projection schema resolver must return an Object, but %s was given.',
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
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable({})();
  });

  it('should return a non-object and non-array data as is', function () {
    const fn = v => projectData({foo: true}, v);
    expect(fn('str')).to.be.eql('str');
    expect(fn('')).to.be.eql('');
    expect(fn(10)).to.be.eql(10);
    expect(fn(0)).to.be.eql(0);
    expect(fn(true)).to.be.eql(true);
    expect(fn(false)).to.be.eql(false);
    expect(fn(null)).to.be.eql(null);
    expect(fn(undefined)).to.be.eql(undefined);
  });

  it('should apply projection for each array element', function () {
    const schema = {foo: true, bar: false};
    const data = [
      {foo: 10, bar: 20, baz: 30},
      {foo: 40, bar: 50, baz: 60},
    ];
    const res = projectData(schema, data);
    expect(res).to.be.eql([
      {foo: 10, baz: 30},
      {foo: 40, baz: 60},
    ]);
  });

  it('should add fields without rules by default', function () {
    const res = projectData({}, {foo: 10, bar: 20});
    expect(res).to.be.eql({foo: 10, bar: 20});
  });

  it('should project fields by a boolean value', function () {
    const res = projectData({foo: true, bar: false}, {foo: 10, bar: 20});
    expect(res).to.be.eql({foo: 10});
  });

  it('should project fields by the select option', function () {
    const res = projectData(
      {foo: {select: true}, bar: {select: false}},
      {foo: 10, bar: 20},
    );
    expect(res).to.be.eql({foo: 10});
  });

  it('should ignore scope-related rules by default', function () {
    const res = projectData(
      {foo: {scopes: {input: false, output: false}}},
      {foo: 10},
    );
    expect(res).to.be.eql({foo: 10});
  });

  it('should create nested projection by the schema option', function () {
    const res = projectData(
      {foo: true, bar: false, qux: {schema: {abc: true, def: false}}},
      {foo: 10, bar: 20, qux: {abc: 30, def: 40}},
    );
    expect(res).to.be.eql({foo: 10, qux: {abc: 30}});
  });

  describe('schema name', function () {
    it('should pass the schema name to the schema resolver', function () {
      let invoked = 0;
      const resolver = name => {
        expect(name).to.be.eq('mySchema');
        invoked++;
        return {foo: true, bar: false};
      };
      const res = projectData('mySchema', {foo: 10, bar: 20}, {resolver});
      expect(res).to.be.eql({foo: 10});
      expect(invoked).to.be.eq(1);
    });

    it('should use the schema resolver in the nested schema', function () {
      let invoked = 0;
      const resolver = name => {
        expect(name).to.be.eq('mySchema');
        invoked++;
        return {baz: true, qux: false};
      };
      const res = projectData(
        {foo: true, bar: {schema: 'mySchema'}},
        {foo: 10, bar: {baz: 20, qux: 30}},
        {resolver},
      );
      expect(res).to.be.eql({foo: 10, bar: {baz: 20}});
      expect(invoked).to.be.eq(1);
    });
  });

  describe('strict mode', function () {
    it('should preserve fields not defined in the schema when the strict option is false', function () {
      const res = projectData({}, {foo: 10});
      expect(res).to.be.eql({foo: 10});
    });

    it('should remove fields without rules when the strict mode is enabled', function () {
      const res = projectData({}, {foo: 10}, {strict: true});
      expect(res).to.be.eql({});
    });

    it('should project fields by a boolean value', function () {
      const res = projectData(
        {foo: true, bar: false},
        {foo: 10, bar: 20},
        {strict: true},
      );
      expect(res).to.be.eql({foo: 10});
    });

    it('should project fields by the select option', function () {
      const res = projectData(
        {foo: {select: true}, bar: {select: false}},
        {foo: 10, bar: 20},
        {strict: true},
      );
      expect(res).to.be.eql({foo: 10});
    });

    it('should propagate the strict mode to nested schema', function () {
      const res = projectData(
        {foo: false, bar: {select: true, schema: {baz: true}}},
        {foo: 10, bar: {baz: 20, qux: 30}},
        {strict: true},
      );
      expect(res).to.be.eql({bar: {baz: 20}});
    });
  });

  describe('projection scope', function () {
    it('should apply scope-specific selection rule by a boolean value', function () {
      const schema = {
        foo: {
          select: false,
          scopes: {
            input: true,
          },
        },
        bar: true,
      };
      const data = {foo: 10, bar: 20};
      const res1 = projectData(schema, data);
      const res2 = projectData(schema, data, {scope: 'input'});
      expect(res1).to.be.eql({bar: 20});
      expect(res2).to.be.eql({foo: 10, bar: 20});
    });

    it('should apply scope-specific selection rule by the select option', function () {
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
      const res1 = projectData(schema, data);
      const res2 = projectData(schema, data, {scope: 'input'});
      expect(res1).to.be.eql({bar: 20});
      expect(res2).to.be.eql({foo: 10, bar: 20});
    });

    it('should fallback to general rule if scope rule is missing', function () {
      const schema = {
        foo: {
          select: true,
          scopes: {
            output: {select: false},
          },
        },
      };
      const data = {foo: 10};
      const res = projectData(schema, data, {scope: 'input'});
      expect(res).to.be.eql({foo: 10});
    });

    it('should fallback to the general rule if the scope options exists but lacks the select option', function () {
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
      const res = projectData(schema, data, {scope: 'input'});
      expect(res).to.be.eql({foo: 10});
    });
  });
});
