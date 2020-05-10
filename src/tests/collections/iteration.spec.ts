import { Iteration } from '../../core/collections/iteration';
import { Optional } from '../../core/types/optional';
import { isNull } from '../../core/functions/is-null';
import each from 'jest-each';

class Foo
{
    public constructor(public bar: number) {}
}

function assertIterable<T>(iterable: Iterable<T>, expected: T[]): void
{
    const actual = Array.from(iterable);
    expect(actual.length).toBe(expected.length);
    for (let i = 0; i < actual.length; ++i)
        expect(actual[i]).toBe(expected[i]);
}

test('Empty should return an empty iterable',
    () =>
    {
        const result = Iteration.Empty<number>();
        assertIterable(result, []);
    }
);

test('Range should return an iterable containing valid numbers',
    () =>
    {
        const result = Iteration.Range(-4, 7);
        assertIterable(result, [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
    }
);

test('Range should return an iterable containing valid numbers, infinite',
    () =>
    {
        const testLimit = 10000;
        let start = -4;
        const result = Iteration.Range(start);
        const iterator = result[Symbol.iterator]();

        for (let i = 0; i < testLimit; ++i)
            expect(iterator.next().value).toBe(start++);
    }
);

test('ToIterable should return an iterable containing exactly one element',
    () =>
    {
        const element = 5;
        const result = Iteration.ToIterable(element);
        assertIterable(result, [element]);
    }
);

test('FilterDefinedOnly should return an iterable containing only defined elements',
    () =>
    {
        const elements: Optional<number>[] = [1, null, 2, 3, void(0), 4, null, 5];
        const result = Iteration.FilterDefinedOnly(elements);
        assertIterable(result, [1, 2, 3, 4, 5]);
    }
);

test('FilterNotNull should return an iterable containing only non-null elements',
    () =>
    {
        const elements: Optional<number>[] = [1, null, 2, 3, void(0), 4, null, 5];
        const result = Iteration.FilterNotNull(elements);
        assertIterable(result, [1, 2, 3, void(0), 4, 5]);
    }
);

test('FilterNotUndefined should return an iterable containing only non-undefined elements',
    () =>
    {
        const elements: Optional<number>[] = [1, null, 2, 3, void(0), 4, null, 5];
        const result = Iteration.FilterNotUndefined(elements);
        assertIterable(result, [1, null, 2, 3, 4, null, 5]);
    }
);

test('Filter should return an iterable containing only elements that have passed the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6];
        let index = 0;

        const result = Iteration.Filter(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return e > 0;
            });

        assertIterable(result, [1, 3, 4, 6]);
    }
);

test('Map should return an iterable containing mapped elements',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6];
        let index = 0;

        const result = Iteration.Map(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return e.toString();
            });

        assertIterable(result, ['1', '-2', '3', '4', '-5', '6']);
    }
);

test('MapMany should return an iterable containing flattened elements',
    () =>
    {
        const elements = [
            {
                foo: [1, 3]
            },
            {
                foo: [-2, -5]
            },
            {
                foo: [4, -6]
            }
        ];
        let index = 0;

        const result = Iteration.MapMany(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return e.foo;
            });

        assertIterable(result, [1, 3, -2, -5, 4, -6]);
    }
);

test('Concat should return an iterable containing elements from both collections',
    () =>
    {
        const first: number[] = [1, -2, 3];
        const second: number[] = [4, -5, 6];
        const result = Iteration.Concat(first, second);
        assertIterable(result, [1, -2, 3, 4, -5, 6]);
    }
);

test('Repeat should return an iterable repeated a certain amount of times',
    () =>
    {
        const elements: number[] = [1, -2, 3];
        const result = Iteration.Repeat(elements, 3);
        assertIterable(result, [1, -2, 3, 1, -2, 3, 1, -2, 3]);
    }
);

test('Repeat empty iterable should return an empty iterable',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.Repeat(elements, 3);
        assertIterable(result, []);
    }
);

test('Loop should return a neverending iterable',
    () =>
    {
        const testLimit = 10000;
        const elements: number[] = [1, -2, 7];
        const result = Iteration.Loop(elements);

        const iterator = result[Symbol.iterator]();
        for (let i = 0; i < testLimit; ++i)
        {
            expect(iterator.next().value).toBe(elements[0]);
            expect(iterator.next().value).toBe(elements[1]);
            expect(iterator.next().value).toBe(elements[2]);
        }
    }
);

test('Loop empty iterable should return an empty iterable',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.Loop(elements);
        assertIterable(result, []);
    }
);

each([
    [0, []],
    [1, [1]],
    [2, [1, -2]],
    [5, [1, -2, 3, 4, -5]],
    [9, [1, -2, 3, 4, -5, 6, 11, 12, -13]],
    [10, [1, -2, 3, 4, -5, 6, 11, 12, -13]]
])
.test('Take should return an iterable containing n first elements (%#): n: %f, expected: %o',
    (n: number, expected: number[]) =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        const result = Iteration.Take(elements, n);
        assertIterable(result, expected);
    }
);

test('TakeWhile should return an iterable containing elements before the first element not passing the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        let index = 0;

        const result = Iteration.TakeWhile(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return Math.abs(e) < 6;
            });

        assertIterable(result, [1, -2, 3, 4, -5]);
    }
);

test('TakeWhile should return an iterable containing all elements when all of them pass the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        let index = 0;

        const result = Iteration.TakeWhile(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return true;
            });

        assertIterable(result, elements);
    }
);

each([
    [0, [1, -2, 3, 4, -5, 6, 11, 12, -13]],
    [1, [-2, 3, 4, -5, 6, 11, 12, -13]],
    [2, [3, 4, -5, 6, 11, 12, -13]],
    [5, [6, 11, 12, -13]],
    [8, [-13]],
    [9, []],
    [10, []]
])
.test('Skip should return an iterable not containing n first elements (%#): n: %f, expected: %o',
    (n: number, expected: number[]) =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        const result = Iteration.Skip(elements, n);
        assertIterable(result, expected);
    }
);

test('SkipWhile should return an iterable not containing elements before the first element not passing the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        let index = 0;

        const result = Iteration.SkipWhile(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return Math.abs(e) < 6;
            });

        assertIterable(result, [6, 11, 12, -13]);
    }
);

test('SkipWhile should return an iterable containing all elements when none of pass the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        let index = 0;

        const result = Iteration.SkipWhile(elements, (e, idx) =>
            {
                expect(e).toBe(elements[index]);
                expect(idx).toBe(index++);
                return false;
            });

        assertIterable(result, elements);
    }
);

test('Zip should return an iterable containing all elements from both iterables',
    () =>
    {
        const first: number[] = [1, -2, 3, 4, -5, 6];
        const second: string[] = ['a', 'b', 'c', 'd', 'e', 'f'];

        const result = Iteration.Zip(first, second);

        const actual = Array.from(result);
        expect(actual.length).toBe(first.length);
        for (let i = 0; i < actual.length; ++i)
        {
            expect(actual[i].first).toBe(first[i]);
            expect(actual[i].second).toBe(second[i]);
        }
    }
);

test('Zip should return an iterable containing elements from both iterables, with first iterable count, when it is shorter',
    () =>
    {
        const first: number[] = [1, -2, 3, 4];
        const second: string[] = ['a', 'b', 'c', 'd', 'e', 'f'];

        const result = Iteration.Zip(first, second);

        const actual = Array.from(result);
        expect(actual.length).toBe(first.length);
        for (let i = 0; i < actual.length; ++i)
        {
            expect(actual[i].first).toBe(first[i]);
            expect(actual[i].second).toBe(second[i]);
        }
    }
);

test('Zip should return an iterable containing elements from both iterables, with second iterable count, when it is shorter',
    () =>
    {
        const first: number[] = [1, -2, 3, 4, -5, 6];
        const second: string[] = ['a', 'b', 'c'];

        const result = Iteration.Zip(first, second);

        const actual = Array.from(result);
        expect(actual.length).toBe(second.length);
        for (let i = 0; i < actual.length; ++i)
        {
            expect(actual[i].first).toBe(first[i]);
            expect(actual[i].second).toBe(second[i]);
        }
    }
);

test('Unique should return an iterable containing distinct elements',
    () =>
    {
        const elements: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const result = Iteration.Unique(elements);
        assertIterable(result, [1, 2, -3, 4, 8, 7]);
    }
);

test('Unique should return an iterable containing distinct elements, with custom stringifier',
    () =>
    {
        const elements: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const result = Iteration.Unique(elements, e => (e + 1).toString());
        assertIterable(result, [1, 2, -3, 4, 8, 7]);
    }
);

test('Intersection should return an iterable containing set intersection',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const result = Iteration.Intersect(first, second);
        assertIterable(result, [2, 4, 7]);
    }
);

test('Intersection should return an iterable containing set intersection, with custom stringifier',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const result = Iteration.Intersect(first, second, e => (e + 1).toString());
        assertIterable(result, [2, 4, 7]);
    }
);

test('Union should return an iterable containing set union',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const result = Iteration.Union(first, second);
        assertIterable(result, [1, 2, -3, 4, 8, 7, -5, 9, 5]);
    }
);

test('Union should return an iterable containing set union, with custom stringifier',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const result = Iteration.Union(first, second, e => (e + 1).toString());
        assertIterable(result, [1, 2, -3, 4, 8, 7, -5, 9, 5]);
    }
);

test('Except should return an iterable containing set difference',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const result = Iteration.Except(first, second);
        assertIterable(result, [1, -3, 8]);
    }
);

test('Except should return an iterable containing set difference, with custom stringifier',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const result = Iteration.Except(first, second, e => (e + 1).toString());
        assertIterable(result, [1, -3, 8]);
    }
);

test('LeftJoin should return an iterable containing a left join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.LeftJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return isNull(r) ? `${l}|_` : `${l}|${r}`;
            });

        assertIterable(result, [
            '10|20', '10|21', '10|22',
            '20|_',
            '-30|_',
            '-31|_',
            '40|50',
            '41|50',
            '80|90',
            '42|50',
            '21|_',
            '11|20', '11|21', '11|22',
            '-32|_',
            '70|_'
        ]);
    }
);

test('LeftJoin should return an iterable containing a left join result, with custom stringifier',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.LeftJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return isNull(r) ? `${l}|_` : `${l}|${r}`;
            },
            x => (x + 10).toString());

        assertIterable(result, [
            '10|20', '10|21', '10|22',
            '20|_',
            '-30|_',
            '-31|_',
            '40|50',
            '41|50',
            '80|90',
            '42|50',
            '21|_',
            '11|20', '11|21', '11|22',
            '-32|_',
            '70|_'
        ]);
    }
);

test('InnerJoin should return an iterable containing an inner join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.InnerJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return `${l}|${r}`;
            });

        assertIterable(result, [
            '10|20', '10|21', '10|22',
            '40|50',
            '41|50',
            '80|90',
            '42|50',
            '11|20', '11|21', '11|22'
        ]);
    }
);

test('InnerJoin should return an iterable containing an inner join result, with custom stringifier',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.InnerJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return `${l}|${r}`;
            },
            x => (x + 10).toString());

        assertIterable(result, [
            '10|20', '10|21', '10|22',
            '40|50',
            '41|50',
            '80|90',
            '42|50',
            '11|20', '11|21', '11|22'
        ]);
    }
);

test('FullJoin should return an iterable containing a full join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.FullJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return isNull(l) ? `_|${r}` : isNull(r) ? `${l}|_` : `${l}|${r}`;
            });

        assertIterable(result, [
            '10|20', '10|21', '10|22',
            '20|_',
            '-30|_',
            '-31|_',
            '40|50',
            '41|50',
            '80|90',
            '42|50',
            '21|_',
            '11|20', '11|21', '11|22',
            '-32|_',
            '70|_',
            '_|40',
            '_|60',
            '_|70',
            '_|-50',
            '_|61'
        ]);
    }
);

test('FullJoin should return an iterable containing a full join result, with custom stringifier',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.FullJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return isNull(l) ? `_|${r}` : isNull(r) ? `${l}|_` : `${l}|${r}`;
            },
            x => (x + 10).toString());

        assertIterable(result, [
            '10|20', '10|21', '10|22',
            '20|_',
            '-30|_',
            '-31|_',
            '40|50',
            '41|50',
            '80|90',
            '42|50',
            '21|_',
            '11|20', '11|21', '11|22',
            '-32|_',
            '70|_',
            '_|40',
            '_|60',
            '_|70',
            '_|-50',
            '_|61'
        ]);
    }
);

test('GroupJoin should return an iterable containing a group join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.GroupJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return `${l}|[${Array.from(r).join(',')}]`;
            });

        assertIterable(result, [
            '10|[20,21,22]',
            '20|[]',
            '-30|[]',
            '-31|[]',
            '40|[50]',
            '41|[50]',
            '80|[90]',
            '42|[50]',
            '21|[]',
            '11|[20,21,22]',
            '-32|[]',
            '70|[]'
        ]);
    }
);

test('GroupJoin should return an iterable containing a group join result, with custom stringifier',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        let index = 0;

        const result = Iteration.GroupJoin(
            first, x => Math.trunc(x / 10),
            second, x => Math.trunc(x / 10) - 1,
            (l, r, idx) => {
                expect(idx).toBe(index++);
                return `${l}|[${Array.from(r).join(',')}]`;
            },
            x => (x + 10).toString());

        assertIterable(result, [
            '10|[20,21,22]',
            '20|[]',
            '-30|[]',
            '-31|[]',
            '40|[50]',
            '41|[50]',
            '80|[90]',
            '42|[50]',
            '21|[]',
            '11|[20,21,22]',
            '-32|[]',
            '70|[]'
        ]);
    }
);

test('OfType should return an iterable with elements of the provided type',
    () =>
    {
        const elements: (string | Foo)[] = ['a', 'b', new Foo(0), 'c', new Foo(1), 'd', 'e', new Foo(2)];
        const result1 = Iteration.OfType(elements, 'string');
        const result2 = Iteration.OfType(elements, Foo);
        const result3 = Iteration.OfType(elements, 'number');
        assertIterable(result1, ['a', 'b', 'c', 'd', 'e']);
        assertIterable(result2, [elements[2], elements[4], elements[7]]);
        assertIterable(result3, []);
    }
);

test('Reverse should return a reversed iterable, with array source',
    () =>
    {
        const elements: number[] = [1, 2, 3, 4, 5, 6, 7];
        const result = Iteration.Reverse(elements);
        assertIterable(result, [7, 6, 5, 4, 3, 2, 1]);
    }
);

test('Reverse should return a reversed iterable',
    () =>
    {
        const elements = Iteration.Filter([1, 2, 3, 4, 5, 6, 7], e => (e & 1) === 0);
        const result = Iteration.Reverse(elements);
        assertIterable(result, [6, 4, 2]);
    }
);

test('EmptyIfUndefined should return its parameter, if it is defined',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.EmptyIfUndefined(elements);
        expect(result).toBe(elements);
    }
);

test('EmptyIfUndefined should return an empty iterable, if its parameter is null or undefined',
    () =>
    {
        const result1 = Iteration.EmptyIfUndefined<number>(null);
        const result2 = Iteration.EmptyIfUndefined<number>(void(0));
        assertIterable(result1, []);
        assertIterable(result2, []);
    }
);

test('EmptyIfUndefined should return its parameter, if it is defined',
    () =>
    {
        const elements: number[] = [1];
        const result = Iteration.EmptyIfUndefined(elements);
        expect(result).toBe(elements);
    }
);

test('ReinterpretCast should return its parameter',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.ReinterpretCast<string>(elements);
        expect(result).toBe(elements);
    }
);

test('AsDeepReadonly should return its parameter',
    () =>
    {
        const elements: Foo[] = [new Foo(0), new Foo(1), new Foo(2)];
        const result = Iteration.AsDeepReadonly(elements);
        expect(result).toBe(elements);
    }
);

test('Sort should return a sorted array',
    () =>
    {
        const elements: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, 1, -3, 7];
        const result = Iteration.Sort(elements, (a, b) => a - b);
        expect(result).toBe(elements);
        assertIterable(result, [-3, -3, -3, 1, 1, 2, 2, 4, 4, 4, 7, 8]);
    }
);

test('Sort should return a sorted iterable',
    () =>
    {
        const elements = Iteration.Filter([1, 2, -3, -3, 4, 4, 8, 4, 2, 1, -3, 7], e => (e & 1) === 0);
        const result = Iteration.Sort(elements, (a, b) => a - b);
        assertIterable(result, [2, 2, 4, 4, 4, 8]);
    }
);

test('Shuffle should return a shuffled array',
    () =>
    {
        const elements: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const original = [...elements];

        const result = Iteration.Shuffle(elements);

        expect(result).toBe(elements);
        expect(result.length).toBe(original.length);
        for (let i = 0; i < original.length; ++i)
            expect(result).toContain(original[i]);
    }
);

test('Shuffle should return a shuffled iterable',
    () =>
    {
        const elements = Iteration.Filter([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], e => e < 10);
        const original = Array.from(elements);

        const result = Iteration.Shuffle(elements);

        expect(result.length).toBe(original.length);
        for (let i = 0; i < original.length; ++i)
            expect(result).toContain(original[i]);
    }
);

test('CopyTo should copy an iterable to the array',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target);
        expect(result).toBe(target);
        assertIterable(result, [1, -4, 2, 5, 3, -7, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with positive explicit start',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, 2);
        expect(result).toBe(target);
        assertIterable(result, [9, 8, 1, -4, 2, 5, 3]);
    }
);

test('CopyTo should copy an iterable to the array, with positive explicit start and length',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, 1, 3);
        expect(result).toBe(target);
        assertIterable(result, [9, 1, -4, 2, -6, -7, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with positive explicit start and length exceeding elements length',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, 1, 6);
        expect(result).toBe(target);
        assertIterable(result, [9, 1, -4, 2, 5, 3, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with positive explicit start and length exceeding target length',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, 1, 8);
        expect(result).toBe(target);
        assertIterable(result, [9, 1, -4, 2, 5, 3, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with negative explicit start',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, -2);
        expect(result).toBe(target);
        assertIterable(result, [2, 5, 3, 6, -6, -7, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with negative explicit start, exceeding iterable length',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, -elements.length);
        expect(result).toBe(target);
        assertIterable(result, [9, 8, 7, 6, -6, -7, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with negative explicit start, exceeding target length',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, -target.length);
        expect(result).toBe(target);
        assertIterable(result, [9, 8, 7, 6, -6, -7, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with length equal to 0',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, 0, 0);
        expect(result).toBe(target);
        assertIterable(result, [9, 8, 7, 6, -6, -7, -8]);
    }
);

test('CopyTo should copy an iterable to the array, with negative length',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const result = Iteration.CopyTo(elements, target, 0, -1);
        expect(result).toBe(target);
        assertIterable(result, [9, 8, 7, 6, -6, -7, -8]);
    }
);

test('GroupBy should return a lookup containing group elements by their keys',
    () =>
    {
        const elements: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];

        const result = Iteration.GroupBy(elements, x => Math.trunc(x / 10), x => x.toString());

        expect(result.length).toBe(6);
        assertIterable(result.get(1)!, ['10', '11']);
        assertIterable(result.get(2)!, ['20', '21']);
        assertIterable(result.get(-3)!, ['-30', '-31', '-32']);
        assertIterable(result.get(4)!, ['40', '41', '42']);
        assertIterable(result.get(8)!, ['80']);
        assertIterable(result.get(7)!, ['70']);
    }
);

test('GroupBy should return a lookup containing group elements by their keys, with custom stringifier',
    () =>
    {
        const stringifier = (x: number) => (x + 10).toString();
        const elements: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];

        const result = Iteration.GroupBy(elements, x => Math.trunc(x / 10), x => x.toString(), stringifier);

        expect(result.length).toBe(6);
        expect(result.stringifier).toBe(stringifier);
        assertIterable(result.get(1)!, ['10', '11']);
        assertIterable(result.get(2)!, ['20', '21']);
        assertIterable(result.get(-3)!, ['-30', '-31', '-32']);
        assertIterable(result.get(4)!, ['40', '41', '42']);
        assertIterable(result.get(8)!, ['80']);
        assertIterable(result.get(7)!, ['70']);
    }
);

test('SequenceEquals should return true for empty collections',
    () =>
    {
        const first: number[] = [];
        const second: number[] = [];

        const result = Iteration.SequenceEquals(first, second);

        expect(result).toBe(true);
    }
);

test('SequenceEquals should return true for exact collections',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [1, 5, 2];

        const result = Iteration.SequenceEquals(first, second);

        expect(result).toBe(true);
    }
);

test('SequenceEquals should return true for exact collections, with custom comparer',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [2, 6, 3];

        const result = Iteration.SequenceEquals(first, second, (a, b) => a === b - 1);

        expect(result).toBe(true);
    }
);

test('SequenceEquals should return false for collections of same length, but different elements',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [2, 6, 3];

        const result = Iteration.SequenceEquals(first, second);

        expect(result).toBe(false);
    }
);

test('SequenceEquals should return false for collections of same length, but different elements, with custom comparer',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [1, 5, 2];

        const result = Iteration.SequenceEquals(first, second, (a, b) => a === b - 1);

        expect(result).toBe(false);
    }
);

test('SequenceEquals should return false for collections of different length, but same first elements',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [1, 5, 2, 4];

        const result1 = Iteration.SequenceEquals(first, second);
        const result2 = Iteration.SequenceEquals(second, first);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
    }
);

test('SequenceEquals should return false for collections of different length, but same first elements, with custom comparer',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [2, 6, 3, 4];

        const result1 = Iteration.SequenceEquals(first, second, (a, b) => a === b - 1);
        const result2 = Iteration.SequenceEquals(second, first, (a, b) => a - 1 === b);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
    }
);

test('SequenceEquals should return false for collections of different length and different elements',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [2, 6, 3, 4];

        const result1 = Iteration.SequenceEquals(first, second);
        const result2 = Iteration.SequenceEquals(second, first);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
    }
);

test('SequenceEquals should return false for collections of different length and different elements, with custom comparer',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [1, 5, 2, 4];

        const result1 = Iteration.SequenceEquals(first, second, (a, b) => a === b - 1);
        const result2 = Iteration.SequenceEquals(second, first, (a, b) => a - 1 === b);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
    }
);

test('SetEquals should return true for empty collections',
    () =>
    {
        const first: number[] = [];
        const second: number[] = [];

        const result = Iteration.SetEquals(first ,second);

        expect(result).toBe(true);
    }
);

test('SetEquals should return true for exact collections',
    () =>
    {
        const first: number[] = [1, 2, 5, 2, 5];
        const second: number[] = [1, 5, 2, 1];

        const result = Iteration.SetEquals(first, second);

        expect(result).toBe(true);
    }
);

test('SetEquals should return true for exact collections, with custom stringifier',
    () =>
    {
        const first: number[] = [1, 2, 5, 2, 5];
        const second: number[] = [1, 5, 2, 1];

        const result = Iteration.SetEquals(first, second, x => (x + 1).toString());

        expect(result).toBe(true);
    }
);

test('SetEquals should return false for different collections',
    () =>
    {
        const first: number[] = [1, 2, 5, 2, 5, 6];
        const second: number[] = [1, 5, 2, 1, 7];

        const result = Iteration.SetEquals(first, second);

        expect(result).toBe(false);
    }
);

test('SetEquals should return false for different collections, with custom stringifier',
    () =>
    {
        const first: number[] = [1, 2, 5, 2, 5, 6];
        const second: number[] = [1, 5, 2, 1, 7];

        const result = Iteration.SetEquals(first, second, x => (x + 1).toString());

        expect(result).toBe(false);
    }
);

test('IsEmpty should return true for empty collection',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.IsEmpty(elements);
        expect(result).toBe(true);
    }
);

test('IsEmpty should return false for non-empty collection',
    () =>
    {
        const elements: number[] = [1];
        const result = Iteration.IsEmpty(elements);
        expect(result).toBe(false);
    }
);

test('Some should return false for empty collection',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.Some(elements, _ => true);
        expect(result).toBe(false);
    }
);

test('Some should return true, if collection contains an element satisfying a predicate',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        let index = 0;

        const result = Iteration.Some(elements, (x, idx) =>
        {
            expect(idx).toBe(index++);
            return x >= 2;
        });

        expect(result).toBe(true);
    }
);

test('Some should return false, if collection doesn\'t contain an element satisfying a predicate',
    () =>
    {
        const elements: number[] = [-1, -2, -3];
        let index = 0;

        const result = Iteration.Some(elements, (x, idx) =>
        {
            expect(idx).toBe(index++);
            return x >= 2;
        });

        expect(result).toBe(false);
    }
);

test('Every should return true for empty collection',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.Every(elements, _ => false);
        expect(result).toBe(true);
    }
);

test('Every should return true, if all collection elements satisfy a predicate',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        let index = 0;

        const result = Iteration.Every(elements, (x, idx) =>
        {
            expect(idx).toBe(index++);
            return x > 0;
        });

        expect(result).toBe(true);
    }
);

test('Every should return false, if not all collection elements satisfy a predicate',
    () =>
    {
        const elements: number[] = [1, 2, 0];
        let index = 0;

        const result = Iteration.Every(elements, (x, idx) =>
        {
            expect(idx).toBe(index++);
            return x > 0;
        });

        expect(result).toBe(false);
    }
);

test('Has should return true, if collection contains an object',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Has(elements, 3);
        expect(result).toBe(true);
    }
);

test('Has should return true, if collection contains an object, with custom comparer',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Has(elements, 3, (a, b) => a.toString() === b.toString());
        expect(result).toBe(true);
    }
);

test('Has should return false, if collection doesn\'t contain an object',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Has(elements, 0);
        expect(result).toBe(false);
    }
);

test('Has should return false, if collection doesn\'t contain an object, with custom comparer',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Has(elements, 0, (a, b) => a.toString() === b.toString());
        expect(result).toBe(false);
    }
);

test('Count should return a valid result, for array',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Count(elements);
        expect(result).toBe(elements.length);
    }
);

test('Count should return a valid result',
    () =>
    {
        const elements = Iteration.Filter([1, 2, 3], x => x > 0);
        const result = Iteration.Count(elements);
        expect(result).toBe(3);
    }
);

test('Count should return 0 for empty iterable',
    () =>
    {
        const result = Iteration.Count(Iteration.Empty<number>());
        expect(result).toBe(0);
    }
);

test('First should throw for empty collection',
    () =>
    {
        const elements: number[] = [];
        const action = () => Iteration.First(elements);
        expect(action).toThrow();
    }
);

test('First should return first element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.First(elements);
        expect(result).toBe(elements[0]);
    }
);

test('TryFirst should return null for empty collection',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.TryFirst(elements);
        expect(result).toBeNull();
    }
);

test('TryFirst should return first element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.TryFirst(elements);
        expect(result).toBe(elements[0]);
    }
);

test('Last should throw for empty collection',
    () =>
    {
        const elements: number[] = [];
        const action = () => Iteration.Last(elements);
        expect(action).toThrow();
    }
);

test('Last should return last element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Last(elements);
        expect(result).toBe(elements[2]);
    }
);

test('TryLast should return null for empty collection',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.TryLast(elements);
        expect(result).toBeNull();
    }
);

test('TryLast should return last element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.TryLast(elements);
        expect(result).toBe(elements[2]);
    }
);

test('At should throw for negative index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const action = () => Iteration.At(elements, -1);
        expect(action).toThrow();
    }
);

test('At should throw for too large index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const action = () => Iteration.At(elements, elements.length);
        expect(action).toThrow();
    }
);

each([
    [0],
    [1],
    [2]
])
.test('At should return correct element',
    (index: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.At(elements, index);
        expect(result).toBe(elements[index]);
    }
);

test('TryAt should return null for negative index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.TryAt(elements, -1);
        expect(result).toBeNull();
    }
);

test('TryAt should return null for too large index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.TryAt(elements, elements.length);
        expect(result).toBeNull();
    }
);

each([
    [0],
    [1],
    [2]
])
.test('TryAt should return correct element',
    (index: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.TryAt(elements, index);
        expect(result).toBe(elements[index]);
    }
);

test('Single should throw for empty collection',
    () =>
    {
        const elements: number[] = [];
        const action = () => Iteration.Single(elements);
        expect(action).toThrow();
    }
);

test('Single should throw for collection with more than one element',
    () =>
    {
        const elements: number[] = [1, 2];
        const action = () => Iteration.Single(elements);
        expect(action).toThrow();
    }
);

test('Single should return the only element for collection with one element',
    () =>
    {
        const elements: number[] = [1];
        const result = Iteration.Single(elements);
        expect(result).toBe(elements[0]);
    }
);

test('TrySingle should return null for empty collection',
    () =>
    {
        const elements: number[] = [];
        const result = Iteration.TrySingle(elements);
        expect(result).toBeNull();
    }
);

test('TrySingle should return null for collection with more than one element',
    () =>
    {
        const elements: number[] = [1, 2];
        const result = Iteration.TrySingle(elements);
        expect(result).toBeNull();
    }
);

test('TrySingle should return the only element for collection with one element',
    () =>
    {
        const elements: number[] = [1];
        const result = Iteration.TrySingle(elements);
        expect(result).toBe(elements[0]);
    }
);

test('Memoize should return an array',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.Memoize(elements);
        expect(result).toBe(elements);
    }
);

test('Memoize should create a new array from iterable',
    () =>
    {
        const elements = Iteration.Filter([1, 2, 3], x => x > 0);
        const result = Iteration.Memoize(elements);
        assertIterable(result, [1, 2, 3]);
        expect(result instanceof Array).toBe(true);
    }
);

test('ToArray should create a new array from iterable',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.ToArray(elements);
        assertIterable(result, [1, 2, 3]);
        expect(result).not.toBe(elements);
    }
);

test('ToList should create a new list from iterable',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const result = Iteration.ToList(elements);
        assertIterable(result, [1, 2, 3]);
    }
);

test('ToSet should create a new set from iterable',
    () =>
    {
        const elements: number[] = [1, 2, 3, 2, 1, 3, 3, 4];
        const result = Iteration.ToSet(elements);
        expect(result.length).toBe(4);
        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(true);
        expect(result.has(4)).toBe(true);
    }
);

test('ToSet should create a new set from iterable, with custom stringifier',
    () =>
    {
        const stringifier = (x: number) => (x + 1).toString();
        const elements: number[] = [1, 2, 3, 2, 1, 3, 3, 4];
        const result = Iteration.ToSet(elements, stringifier);
        expect(result.length).toBe(4);
        expect(result.stringifier).toBe(stringifier);
        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(true);
        expect(result.has(4)).toBe(true);
    }
);

test('ToMap should create a new map from iterable',
    () =>
    {
        const elements: number[] = [10, 20, 30, 21, 11, 31, 32, 40];
        const result = Iteration.ToMap(elements, x => Math.trunc(x / 10), x => x.toString());
        expect(result.length).toBe(4);
        expect(result.get(1)).toBe('10');
        expect(result.get(2)).toBe('20');
        expect(result.get(3)).toBe('30');
        expect(result.get(4)).toBe('40');
    }
);

test('ToMap should create a new map from iterable, with custom stringifier',
    () =>
    {
        const stringifier = (x: number) => (x + 1).toString();
        const elements: number[] = [10, 20, 30, 21, 11, 31, 32, 40];
        const result = Iteration.ToMap(elements, x => Math.trunc(x / 10), x => x.toString(), stringifier);
        expect(result.length).toBe(4);
        expect(result.stringifier).toBe(stringifier);
        expect(result.get(1)).toBe('10');
        expect(result.get(2)).toBe('20');
        expect(result.get(3)).toBe('30');
        expect(result.get(4)).toBe('40');
    }
);

test('ForEach should invoke callback for each element',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        let index = 0;

        Iteration.ForEach(elements, (x, idx) =>
        {
            expect(x).toBe(elements[index]);
            expect(idx).toBe(index++);
        });
    }
);

test('Reduce should return seed for empty collection',
    () =>
    {
        const seed = '0';
        const elements: number[] = [];
        const result = Iteration.Reduce(elements, (p, c) => `${p}|${c}`, seed);
        expect(result).toBe(seed);
    }
);

test('Reduce should return proper result',
    () =>
    {
        const seed = '0';
        const elements: number[] = [1, 2, 3];
        let index = 0;

        const result = Iteration.Reduce(elements, (p, c, idx) =>
        {
            expect(idx).toBe(index++);
            return `${p}|${c}`;
        },
        seed);
        expect(result).toBe('0|1|2|3');
    }
);

test('HasDuplicates should return true if collection contains duplicates',
    () =>
    {
        const elements: number[] = [1, 2, 3, 2, 5];
        const result = Iteration.HasDuplicates(elements);
        expect(result).toBe(true);
    }
);

test('HasDuplicates should return true if collection contains duplicates, with custom stringifier',
    () =>
    {
        const elements: number[] = [1, 2, 3, 2, 5];
        const result = Iteration.HasDuplicates(elements, x => (x + 1).toString());
        expect(result).toBe(true);
    }
);

test('HasDuplicates should return false if collection doesn\'t contain duplicates',
    () =>
    {
        const elements: number[] = [1, 2, 3, 5];
        const result = Iteration.HasDuplicates(elements);
        expect(result).toBe(false);
    }
);

test('HasDuplicates should return false if collection doesn\'t contain duplicates, with custom stringifier',
    () =>
    {
        const elements: number[] = [1, 2, 3, 5];
        const result = Iteration.HasDuplicates(elements, x => (x + 1).toString());
        expect(result).toBe(false);
    }
);
