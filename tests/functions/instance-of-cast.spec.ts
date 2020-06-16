import { instanceOfCast, isInstanceOfType } from '../../src/functions/instance-of-cast';

class Foo {}
class Bar extends Foo {}
class Baz {}

test('instance of cast should return null if source is not of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const fooResult = instanceOfCast(Bar, foo);
        const barResult = instanceOfCast(Baz, bar);
        const bazResult = instanceOfCast(Foo, baz);
        expect(fooResult).toBeNull();
        expect(barResult).toBeNull();
        expect(bazResult).toBeNull();
    }
);

test('instance of cast should return source if source is of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const fooResult = instanceOfCast(Foo, foo);
        const barResult = instanceOfCast(Foo, bar);
        const bazResult = instanceOfCast(Baz, baz);
        expect(fooResult).toBe(foo);
        expect(barResult).toBe(bar);
        expect(bazResult).toBe(baz);
    }
);

test('is instance of type should return false if source is not of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const fooResult = isInstanceOfType(Bar, foo);
        const barResult = isInstanceOfType(Baz, bar);
        const bazResult = isInstanceOfType(Foo, baz);
        expect(fooResult).toBe(false);
        expect(barResult).toBe(false);
        expect(bazResult).toBe(false);
    }
);

test('is instance of type should return true if source is of correct type',
    () =>
    {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const fooResult = isInstanceOfType(Foo, foo);
        const barResult = isInstanceOfType(Foo, bar);
        const bazResult = isInstanceOfType(Baz, baz);
        expect(fooResult).toBe(true);
        expect(barResult).toBe(true);
        expect(bazResult).toBe(true);
    }
);
