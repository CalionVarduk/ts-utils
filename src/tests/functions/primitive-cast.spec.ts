import { primitiveCast, isPrimitiveOfType } from '../../core/functions/primitive-cast';

class Foo {}

test('primitive cast should return null if source is not of correct type',
    () =>
    {
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const foo = new Foo();
        const strResult = primitiveCast('number', str);
        const numResult = primitiveCast('boolean', num);
        const bolResult = primitiveCast('string', bol);
        const funResult = primitiveCast('object', fun);
        const undResult = primitiveCast('function', und);
        const objResult = primitiveCast('symbol', obj);
        const symResult = primitiveCast('undefined', sym);
        const fooResult = primitiveCast('string', foo);
        expect(strResult).toBeNull();
        expect(numResult).toBeNull();
        expect(bolResult).toBeNull();
        expect(funResult).toBeNull();
        expect(undResult).toBeNull();
        expect(objResult).toBeNull();
        expect(symResult).toBeNull();
        expect(fooResult).toBeNull();
    }
);

test('primitive cast should return source if source is of correct type',
    () =>
    {
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const foo = new Foo();
        const strResult = primitiveCast('string', str);
        const numResult = primitiveCast('number', num);
        const bolResult = primitiveCast('boolean', bol);
        const funResult = primitiveCast('function', fun);
        const undResult = primitiveCast('undefined', und);
        const objResult = primitiveCast('object', obj);
        const symResult = primitiveCast('symbol', sym);
        const fooResult = primitiveCast('object', foo);
        expect(strResult).toBe(str);
        expect(numResult).toBe(num);
        expect(bolResult).toBe(bol);
        expect(funResult).toBe(fun);
        expect(undResult).toBe(und);
        expect(objResult).toBe(obj);
        expect(symResult).toBe(sym);
        expect(fooResult).toBe(foo);
    }
);

test('is primitive of type should return false if source is not of correct type',
    () =>
    {
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const foo = new Foo();
        const strResult = isPrimitiveOfType('number', str);
        const numResult = isPrimitiveOfType('boolean', num);
        const bolResult = isPrimitiveOfType('string', bol);
        const funResult = isPrimitiveOfType('object', fun);
        const undResult = isPrimitiveOfType('function', und);
        const objResult = isPrimitiveOfType('symbol', obj);
        const symResult = isPrimitiveOfType('undefined', sym);
        const fooResult = isPrimitiveOfType('string', foo);
        expect(strResult).toBe(false);
        expect(numResult).toBe(false);
        expect(bolResult).toBe(false);
        expect(funResult).toBe(false);
        expect(undResult).toBe(false);
        expect(objResult).toBe(false);
        expect(symResult).toBe(false);
        expect(fooResult).toBe(false);
    }
);

test('is primitive of type should return true if source is of correct type',
    () =>
    {
        const str = 'foo';
        const num = 1;
        const bol = false;
        const fun = function(){};
        const und = void(0);
        const obj = {};
        const sym = Symbol();
        const foo = new Foo();
        const strResult = isPrimitiveOfType('string', str);
        const numResult = isPrimitiveOfType('number', num);
        const bolResult = isPrimitiveOfType('boolean', bol);
        const funResult = isPrimitiveOfType('function', fun);
        const undResult = isPrimitiveOfType('undefined', und);
        const objResult = isPrimitiveOfType('object', obj);
        const symResult = isPrimitiveOfType('symbol', sym);
        const fooResult = isPrimitiveOfType('object', foo);
        expect(strResult).toBe(true);
        expect(numResult).toBe(true);
        expect(bolResult).toBe(true);
        expect(funResult).toBe(true);
        expect(undResult).toBe(true);
        expect(objResult).toBe(true);
        expect(symResult).toBe(true);
        expect(fooResult).toBe(true);
    }
);
