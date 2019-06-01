import { dynamicCast } from '../core/dynamic-cast';

class Foo {}
class Bar extends Foo {}
class Baz {}

test('dynamic cast should return null if source is not of correct type',
    () => {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const fooResult = dynamicCast(Bar, foo);
        const barResult = dynamicCast(Baz, bar);
        const bazResult = dynamicCast(Foo, baz);
        expect(fooResult).toBeNull();
        expect(barResult).toBeNull();
        expect(bazResult).toBeNull();
    }
);

test('dynamic cast should return source if source is of correct type',
    () => {
        const foo = new Foo();
        const bar = new Bar();
        const baz = new Baz();
        const fooResult = dynamicCast(Foo, foo);
        const barResult = dynamicCast(Foo, bar);
        const bazResult = dynamicCast(Baz, baz);
        expect(fooResult).toBe(foo);
        expect(barResult).toBe(bar);
        expect(bazResult).toBe(baz);
    }
);
