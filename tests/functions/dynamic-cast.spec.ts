import { dynamicCast, isOfType } from '../../src/functions/dynamic-cast';

class Foo {}
class Bar extends Foo {}
class Baz {}
abstract class AbstractFoo {}
class ConcreteBar extends AbstractFoo {}

test('dynamic cast should return null if source is not of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const nul = null;
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const fooResult = dynamicCast(Bar, foo);
        const barResult = dynamicCast(Baz, bar);
        const bazResult = dynamicCast(Foo, baz);
        const nulResult = dynamicCast(AbstractFoo, nul);
        const strResult = dynamicCast('number', str);
        const numResult = dynamicCast('boolean', num);
        const bolResult = dynamicCast('string', bol);
        const funResult = dynamicCast('object', fun);
        const undResult = dynamicCast('function', und);
        const objResult = dynamicCast('symbol', obj);
        const symResult = dynamicCast('undefined', sym);
        const fopResult = dynamicCast('string', foo);
        const stoResult = dynamicCast(Foo, str);
        expect(fooResult).toBeNull();
        expect(barResult).toBeNull();
        expect(bazResult).toBeNull();
        expect(nulResult).toBeNull();
        expect(strResult).toBeNull();
        expect(numResult).toBeNull();
        expect(bolResult).toBeNull();
        expect(funResult).toBeNull();
        expect(undResult).toBeNull();
        expect(objResult).toBeNull();
        expect(symResult).toBeNull();
        expect(fopResult).toBeNull();
        expect(stoResult).toBeNull();
    }
);

test('dynamic cast should return source if source is of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const cbar = new ConcreteBar();
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const fooResult = dynamicCast(Foo, foo);
        const barResult = dynamicCast(Foo, bar);
        const bazResult = dynamicCast(Baz, baz);
        const cbarResult = dynamicCast(AbstractFoo, cbar);
        const strResult = dynamicCast('string', str);
        const numResult = dynamicCast('number', num);
        const bolResult = dynamicCast('boolean', bol);
        const funResult = dynamicCast('function', fun);
        const undResult = dynamicCast('undefined', und);
        const objResult = dynamicCast('object', obj);
        const symResult = dynamicCast('symbol', sym);
        const fopResult = dynamicCast('object', foo);
        expect(fooResult).toBe(foo);
        expect(barResult).toBe(bar);
        expect(bazResult).toBe(baz);
        expect(cbarResult).toBe(cbar);
        expect(strResult).toBe(str);
        expect(numResult).toBe(num);
        expect(bolResult).toBe(bol);
        expect(funResult).toBe(fun);
        expect(undResult).toBe(und);
        expect(objResult).toBe(obj);
        expect(symResult).toBe(sym);
        expect(fopResult).toBe(foo);
    }
);

test('is of type should return false if source is not of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const nul = null;
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const fooResult = isOfType(Bar, foo);
        const barResult = isOfType(Baz, bar);
        const bazResult = isOfType(Foo, baz);
        const nulResult = isOfType(AbstractFoo, nul);
        const strResult = isOfType('number', str);
        const numResult = isOfType('boolean', num);
        const bolResult = isOfType('string', bol);
        const funResult = isOfType('object', fun);
        const undResult = isOfType('function', und);
        const objResult = isOfType('symbol', obj);
        const symResult = isOfType('undefined', sym);
        const fopResult = isOfType('string', foo);
        const stoResult = isOfType(Foo, str);
        expect(fooResult).toBe(false);
        expect(barResult).toBe(false);
        expect(bazResult).toBe(false);
        expect(nulResult).toBe(false);
        expect(strResult).toBe(false);
        expect(numResult).toBe(false);
        expect(bolResult).toBe(false);
        expect(funResult).toBe(false);
        expect(undResult).toBe(false);
        expect(objResult).toBe(false);
        expect(symResult).toBe(false);
        expect(fopResult).toBe(false);
        expect(stoResult).toBe(false);
    }
);

test('is of type should return true if source is of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const cbar = new ConcreteBar();
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const fooResult = isOfType(Foo, foo);
        const barResult = isOfType(Foo, bar);
        const bazResult = isOfType(Baz, baz);
        const cbarResult = isOfType(AbstractFoo, cbar);
        const strResult = isOfType('string', str);
        const numResult = isOfType('number', num);
        const bolResult = isOfType('boolean', bol);
        const funResult = isOfType('function', fun);
        const undResult = isOfType('undefined', und);
        const objResult = isOfType('object', obj);
        const symResult = isOfType('symbol', sym);
        const fopResult = isOfType('object', foo);
        expect(fooResult).toBe(true);
        expect(barResult).toBe(true);
        expect(bazResult).toBe(true);
        expect(cbarResult).toBe(true);
        expect(strResult).toBe(true);
        expect(numResult).toBe(true);
        expect(bolResult).toBe(true);
        expect(funResult).toBe(true);
        expect(undResult).toBe(true);
        expect(objResult).toBe(true);
        expect(symResult).toBe(true);
        expect(fopResult).toBe(true);
    }
);
