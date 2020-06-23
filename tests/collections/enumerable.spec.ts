import { Enumerable } from '../../src/collections/enumerable';
import { Iteration } from '../../src/collections/iteration';
import { Optional } from '../../src/types/optional';
import each from 'jest-each';
import { Nullable } from '../../src/types/nullable';
import { isNull } from '../../src/functions';

class Foo
{
    public constructor(public bar: number) {}
}

function assertEnumerable<T>(enumerable: Enumerable<T>, expected: Iterable<T>): void
{
    expect(Iteration.ToArray(enumerable.iterable)).toMatchObject(Iteration.ToArray(expected));
}

test('ctor should create properly',
    () =>
    {
        const iterable = [1, 2, 3];
        const result = new Enumerable(iterable);
        expect(result.iterable).toBe(iterable);
    }
);

test('filterDefinedOnly should return an enumerable containing only defined elements',
    () =>
    {
        const elements: Optional<number>[] = [1, null, 2, 3, void(0), 4, null, 5];
        const source = new Enumerable(elements);
        const result = source.filterDefinedOnly();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.FilterDefinedOnly(elements));
    }
);

test('filterNotNull should return an enumerable containing only non-null elements',
    () =>
    {
        const elements: Optional<number>[] = [1, null, 2, 3, void(0), 4, null, 5];
        const source = new Enumerable(elements);
        const result = source.filterNotNull();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.FilterNotNull(elements));
    }
);

test('filterNotUndefined should return an enumerable containing only non-undefined elements',
    () =>
    {
        const elements: Optional<number>[] = [1, null, 2, 3, void(0), 4, null, 5];
        const source = new Enumerable(elements);
        const result = source.filterNotUndefined();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.FilterNotUndefined(elements));
    }
);

test('filter should return an enumerable containing only elements that have passed the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6];
        const predicate = (obj: number) => obj > 0;
        const source = new Enumerable(elements);
        const result = source.filter(predicate);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Filter(elements, predicate));
    }
);

test('map should return an enumerable containing mapped elements',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6];
        const mapper = (obj: number) => obj.toString();
        const source = new Enumerable(elements);
        const result = source.map(mapper);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Map(elements, mapper));
    }
);

test('mapMany should return an enumerable containing flattened elements',
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
        const source = new Enumerable(elements);
        const result = source.mapMany(x => x.foo);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.MapMany(elements, x => x.foo));
    }
);

test('concat should return an enumerable containing elements from both collections',
    () =>
    {
        const first: number[] = [1, -2, 3];
        const second: number[] = [4, -5, 6];
        const source = new Enumerable(first);
        const result = source.concat(second);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Concat(first, second));
    }
);

test('repeat should return an enumerable repeated a certain amount of times',
    () =>
    {
        const elements: number[] = [1, -2, 3];
        const source = new Enumerable(elements);
        const result = source.repeat(3);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Repeat(elements, 3));
    }
);

test('repeat empty enumerable should return an empty enumerable',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const result = source.repeat(3);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Repeat(elements, 3));
    }
);

test('loop should return a neverending enumerable',
    () =>
    {
        const testLimit = 10000;
        const elements: number[] = [1, -2, 7];
        const source = new Enumerable(elements);
        const result = source.loop();
        expect(source).not.toBe(result);
        assertEnumerable(result.take(testLimit), Iteration.Take(Iteration.Loop(elements), testLimit));
    }
);

test('loop empty enumerable should return an empty enumerable',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const result = source.loop();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Loop(elements));
    }
);

each([
    [0],
    [1],
    [2],
    [5],
    [9],
    [10]
])
.test('take should return an enumerable containing n first elements (%#): n: %f',
    (n: number) =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        const source = new Enumerable(elements);
        const result = source.take(n);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Take(elements, n));
    }
);

test('takeWhile should return an enumerable containing elements before the first element not passing the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        const predicate = (n: number) => Math.abs(n) < 6;
        const source = new Enumerable(elements);
        const result = source.takeWhile(predicate);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.TakeWhile(elements, predicate));
    }
);

each([
    [0],
    [1],
    [2],
    [5],
    [8],
    [9],
    [10]
])
.test('skip should return an enumerable not containing n first elements (%#): n: %f',
    (n: number) =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        const source = new Enumerable(elements);
        const result = source.skip(n);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Skip(elements, n));
    }
);

test('skipWhile should return an enumerable not containing elements before the first element not passing the predicate',
    () =>
    {
        const elements: number[] = [1, -2, 3, 4, -5, 6, 11, 12, -13];
        const predicate = (n: number) => Math.abs(n) < 6;
        const source = new Enumerable(elements);
        const result = source.skipWhile(predicate);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.SkipWhile(elements, predicate));
    }
);

test('zip should return an enumerable containing all elements from both collections',
    () =>
    {
        const first: number[] = [1, -2, 3, 4, -5, 6];
        const second: string[] = ['a', 'b', 'c', 'd', 'e', 'f'];
        const source = new Enumerable(first);
        const result = source.zip(second);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Zip(first, second));
    }
);

test('unique should return an enumerable containing distinct elements',
    () =>
    {
        const elements: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const stringifier = (n: number) => (n + 1).toString();
        const source = new Enumerable(elements);
        const result = source.unique(stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Unique(elements, stringifier));
    }
);

test('intersection should return an enumerable containing set intersection',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const stringifier = (n: number) => (n + 1).toString();
        const source = new Enumerable(first);
        const result = source.intersect(second, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Intersect(first, second, stringifier));
    }
);

test('union should return an enumerable containing set union',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const stringifier = (n: number) => (n + 1).toString();
        const source = new Enumerable(first);
        const result = source.union(second, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Union(first, second, stringifier));
    }
);

test('except should return an enumerable containing set difference',
    () =>
    {
        const first: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, -3, 7];
        const second: number[] = [2, 2, 4, 7, -5, 9, 2, 5];
        const stringifier = (n: number) => (n + 1).toString();
        const source = new Enumerable(first);
        const result = source.except(second, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Except(first, second, stringifier));
    }
);

test('leftJoin should return an enumerable containing a left join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        const firstSelector = (n: number) => Math.trunc(n / 10);
        const secondSelector = (n: number) => Math.trunc(n / 10) - 1;
        const resultSelector = (l: number, r: Nullable<number>) => isNull(l) ? `${l}|_` : `${l}|${r}`;
        const stringifier = (n: number) => (n + 10).toString();
        const source = new Enumerable(first);
        const result = source.leftJoin(firstSelector, second, secondSelector, resultSelector, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.LeftJoin(first, firstSelector, second, secondSelector, resultSelector, stringifier));
    }
);

test('innerJoin should return an enumerable containing an inner join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        const firstSelector = (n: number) => Math.trunc(n / 10);
        const secondSelector = (n: number) => Math.trunc(n / 10) - 1;
        const resultSelector = (l: number, r: number) => `${l}|${r}`;
        const stringifier = (n: number) => (n + 10).toString();
        const source = new Enumerable(first);
        const result = source.innerJoin(firstSelector, second, secondSelector, resultSelector, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.InnerJoin(first, firstSelector, second, secondSelector, resultSelector, stringifier));
    }
);

test('fullJoin should return an enumerable containing a full join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        const firstSelector = (n: number) => Math.trunc(n / 10);
        const secondSelector = (n: number) => Math.trunc(n / 10) - 1;
        const resultSelector = (l: Nullable<number>, r: Nullable<number>) => isNull(l) ? `_|${r}` : isNull(r) ? `${l}|_` : `${l}|${r}`;
        const stringifier = (n: number) => (n + 10).toString();
        const source = new Enumerable(first);
        const result = source.fullJoin(firstSelector, second, secondSelector, resultSelector, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.FullJoin(first, firstSelector, second, secondSelector, resultSelector, stringifier));
    }
);

test('groupJoin should return an enumerable containing a group join result',
    () =>
    {
        const first: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const second: number[] = [20, 21, 40, 60, 70, -50, 90, 22, 50, 61];
        const firstSelector = (n: number) => Math.trunc(n / 10);
        const secondSelector = (n: number) => Math.trunc(n / 10) - 1;
        const resultSelector = (l: Nullable<number>, r: Iterable<number>) => `${l}|[${Array.from(r).join(',')}]`;
        const stringifier = (n: number) => (n + 10).toString();
        const source = new Enumerable(first);
        const result = source.groupJoin(firstSelector, second, secondSelector, resultSelector, stringifier);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.GroupJoin(first, firstSelector, second, secondSelector, resultSelector, stringifier));
    }
);

test('ofType should return an enumerable with elements of the provided type',
    () =>
    {
        const elements: (string | Foo)[] = ['a', 'b', new Foo(0), 'c', new Foo(1), 'd', 'e', new Foo(2)];
        const source = new Enumerable(elements);
        const result1 = source.ofType('string');
        const result2 = source.ofType(Foo);
        const result3 = source.ofType('number');
        expect(source).not.toBe(result1);
        expect(source).not.toBe(result2);
        expect(source).not.toBe(result3);
        assertEnumerable(result1, Iteration.OfType(elements, 'string'));
        assertEnumerable(result2, Iteration.OfType(elements, Foo));
        assertEnumerable(result3, Iteration.OfType(elements, 'number'));
    }
);

test('reverse should return a reversed enumerable',
    () =>
    {
        const elements: number[] = [1, 2, 3, 4, 5, 6, 7];
        const source = new Enumerable(elements);
        const result = source.reverse();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Reverse(elements));
    }
);

test('reinterpretCast should return a cast enumerable',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.reinterpretCast<string>();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.ReinterpretCast<string>(elements));
    }
);

test('asDeepReadonly should return a deep readonly enumerable',
    () =>
    {
        const elements: Foo[] = [new Foo(0), new Foo(1), new Foo(2)];
        const source = new Enumerable(elements);
        const result = source.asDeepReadonly();
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.AsDeepReadonly(elements));
    }
);

test('sort should return a sorted array',
    () =>
    {
        const elements: number[] = [1, 2, -3, -3, 4, 4, 8, 4, 2, 1, -3, 7];
        const source = new Enumerable(elements);
        const result = source.sort((a, b) => a - b);
        expect(source).not.toBe(result);
        assertEnumerable(result, Iteration.Sort(elements, (a, b) => a - b));
    }
);

test('shuffle should return a shuffled array',
    () =>
    {
        const elements: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const original = [...elements];
        const source = new Enumerable(elements);
        const result = source.shuffle();
        expect(result).not.toBe(source);
        expect(result.iterable instanceof Array).toBe(true);
        expect(result.count()).toBe(original.length);
        for (let i = 0; i < original.length; ++i)
            expect(result.iterable).toContain(original[i]);
    }
);

test('copyTo should copy an enumerable to the array',
    () =>
    {
        const elements = [1, -4, 2, 5, 3];
        const target = [9, 8, 7, 6, -6, -7, -8];
        const expectedTarget = [...target];
        const source = new Enumerable(elements);
        const result = source.copyTo(target, 1, 3);
        expect(source).not.toBe(result);
        assertEnumerable(new Enumerable(result), Iteration.CopyTo(elements, expectedTarget, 1, 3));
    }
);

test('groupBy should return a lookup containing group elements by their keys',
    () =>
    {
        const keySelector = (x: number) => Math.trunc(x / 10);
        const valueSelector = (x: number) => x.toString();
        const stringifier = (x: number) => (x + 10).toString();
        const elements: number[] = [10, 20, -30, -31, 40, 41, 80, 42, 21, 11, -32, 70];
        const source = new Enumerable(elements);
        const result = source.groupBy(keySelector, valueSelector, stringifier);
        expect(result).toMatchObject(Iteration.GroupBy(elements, keySelector, valueSelector, stringifier));
    }
);

test('sequenceEquals should return true for exact collections',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [2, 6, 3];
        const source = new Enumerable(first);
        const result = source.sequenceEquals(second, (a, b) => a === b - 1);
        expect(result).toBe(Iteration.SequenceEquals(first, second, (a, b) => a === b - 1));
    }
);

test('sequenceEquals should return false for different collections',
    () =>
    {
        const first: number[] = [1, 5, 2];
        const second: number[] = [1, 5, 2];
        const source = new Enumerable(first);
        const result = source.sequenceEquals(second, (a, b) => a === b - 1);
        expect(result).toBe(Iteration.SequenceEquals(first, second, (a, b) => a === b - 1));
    }
);

test('setEquals should return true for exact collections',
    () =>
    {
        const first: number[] = [1, 2, 5, 2, 5];
        const second: number[] = [1, 5, 2, 1];
        const source = new Enumerable(first);
        const result = source.setEquals(second, x => (x + 1).toString());
        expect(result).toBe(Iteration.SetEquals(first, second, x => (x + 1).toString()));
    }
);

test('setEquals should return false for different collections',
    () =>
    {
        const first: number[] = [1, 2, 5, 2, 5, 6];
        const second: number[] = [1, 5, 2, 1, 7];
        const source = new Enumerable(first);
        const result = source.setEquals(second, x => (x + 1).toString());
        expect(result).toBe(Iteration.SetEquals(first, second, x => (x + 1).toString()));
    }
);

test('isEmpty should return true for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const result = source.isEmpty();
        expect(result).toBe(Iteration.IsEmpty(elements));
    }
);

test('isEmpty should return false for non-empty collection',
    () =>
    {
        const elements: number[] = [1];
        const source = new Enumerable(elements);
        const result = source.isEmpty();
        expect(result).toBe(Iteration.IsEmpty(elements));
    }
);

test('some should return true, if collection contains an element satisfying a predicate',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.some(x => x >= 2);
        expect(result).toBe(Iteration.Some(elements, x => x >= 2));
    }
);

test('some should return false, if collection doesn\'t contain an element satisfying a predicate',
    () =>
    {
        const elements: number[] = [-1, -2, -3];
        const source = new Enumerable(elements);
        const result = source.some(x => x >= 2);
        expect(result).toBe(Iteration.Some(elements, x => x >= 2));
    }
);

test('every should return true, if all collection elements satisfy a predicate',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.every(x => x > 0);
        expect(result).toBe(Iteration.Every(elements, x => x > 0));
    }
);

test('every should return false, if not all collection elements satisfy a predicate',
    () =>
    {
        const elements: number[] = [1, 2, 0];
        const source = new Enumerable(elements);
        const result = source.every(x => x > 0);
        expect(result).toBe(Iteration.Every(elements, x => x > 0));
    }
);

test('has should return true, if collection contains an object',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.has(3, (a, b) => a.toString() === b.toString());
        expect(result).toBe(Iteration.Has(elements, 3, (a, b) => a.toString() === b.toString()));
    }
);

test('has should return false, if collection doesn\'t contain an object',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.has(0, (a, b) => a.toString() === b.toString());
        expect(result).toBe(Iteration.Has(elements, 0, (a, b) => a.toString() === b.toString()));
    }
);

test('count should return a valid result',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.count();
        expect(result).toBe(Iteration.Count(elements));
    }
);

each([
    [-1],
    [0],
    [1],
    [2],
    [3],
    [4]
])
.test('hasAtLeast should return a valid result (%#): count: %f',
    (count: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.hasAtLeast(count);
        expect(result).toBe(Iteration.HasAtLeast(elements, count));
    }
);

each([
    [-1],
    [0],
    [1],
    [2],
    [3],
    [4]
])
.test('hasAtMost should return a valid result (%#): count: %f',
    (count: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.hasAtMost(count);
        expect(result).toBe(Iteration.HasAtMost(elements, count));
    }
);

each([
    [-1],
    [0],
    [1],
    [2],
    [3],
    [4]
])
.test('hasExactly should return a valid result (%#): count: %f',
    (count: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.hasExactly(count);
        expect(result).toBe(Iteration.HasExactly(elements, count));
    }
);

each([
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [-1, 3],
    [-1, 4],
    [0, -1],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, -1],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, -1],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [3, -1],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [4, -1],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4]
])
.test('hasBetween should return a valid result (%#): min count: %f, max count: %f',
    (minCount: number, maxCount: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.hasBetween(minCount, maxCount);
        expect(result).toBe(Iteration.HasBetween(elements, minCount, maxCount));
    }
);

test('first should throw for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const action = () => source.first();
        expect(action).toThrow();
    }
);

test('first should return first element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.first();
        expect(result).toBe(Iteration.First(elements));
    }
);

test('tryFirst should return null for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const result = source.tryFirst();
        expect(result).toBe(Iteration.TryFirst(elements));
    }
);

test('tryFirst should return first element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.tryFirst();
        expect(result).toBe(Iteration.TryFirst(elements));
    }
);

test('last should throw for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const action = () => source.last();
        expect(action).toThrow();
    }
);

test('last should return last element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.last();
        expect(result).toBe(Iteration.Last(elements));
    }
);

test('tryLast should return null for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const result = source.tryLast();
        expect(result).toBe(Iteration.TryLast(elements));
    }
);

test('tryLast should return last element for non-empty collection',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.tryLast();
        expect(result).toBe(Iteration.TryLast(elements));
    }
);

test('at should throw for negative index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const action = () => source.at(-1);
        expect(action).toThrow();
    }
);

test('at should throw for too large index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const action = () => source.at(elements.length);
        expect(action).toThrow();
    }
);

each([
    [0],
    [1],
    [2]
])
.test('at should return correct element',
    (index: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.at(index);
        expect(result).toBe(Iteration.At(elements, index));
    }
);

test('tryAt should return null for negative index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.tryAt(-1);
        expect(result).toBe(Iteration.TryAt(elements, -1));
    }
);

test('tryAt should return null for too large index',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.tryAt(elements.length);
        expect(result).toBe(Iteration.TryAt(elements, elements.length));
    }
);

each([
    [0],
    [1],
    [2]
])
.test('tryAt should return correct element',
    (index: number) =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.tryAt(index);
        expect(result).toBe(Iteration.TryAt(elements, index));
    }
);

test('single should throw for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const action = () => source.single();
        expect(action).toThrow();
    }
);

test('single should throw for collection with more than one element',
    () =>
    {
        const elements: number[] = [1, 2];
        const source = new Enumerable(elements);
        const action = () => source.single();
        expect(action).toThrow();
    }
);

test('single should return the only element for collection with one element',
    () =>
    {
        const elements: number[] = [1];
        const source = new Enumerable(elements);
        const result = source.single();
        expect(result).toBe(Iteration.Single(elements));
    }
);

test('trySingle should return null for empty collection',
    () =>
    {
        const elements: number[] = [];
        const source = new Enumerable(elements);
        const result = source.trySingle();
        expect(result).toBe(Iteration.TrySingle(elements));
    }
);

test('trySingle should return null for collection with more than one element',
    () =>
    {
        const elements: number[] = [1, 2];
        const source = new Enumerable(elements);
        const result = source.trySingle();
        expect(result).toBe(Iteration.TrySingle(elements));
    }
);

test('trySingle should return the only element for collection with one element',
    () =>
    {
        const elements: number[] = [1];
        const source = new Enumerable(elements);
        const result = source.trySingle();
        expect(result).toBe(Iteration.TrySingle(elements));
    }
);

test('materialize should return an array',
    () =>
    {
        const elements = Iteration.Filter([1, 2, 3], x => x > 0);
        const source = new Enumerable(elements);
        const result = source.materialize();
        expect(result).not.toBe(source);
        expect(result.iterable instanceof Array).toBe(true);
        assertEnumerable(result, Iteration.Materialize(elements));
    }
);

test('memoize should return an enumerable returning an array',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.memoize();
        expect(result).not.toBe(source);
        assertEnumerable(result, Iteration.Memoize(elements));
    }
);

test('toArray should create a new array from enumerable',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.toArray();
        assertEnumerable(new Enumerable(result), Iteration.ToArray(elements));
    }
);

test('toList should create a new list from enumerable',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.toList();
        assertEnumerable(new Enumerable(result), Iteration.ToList(elements));
    }
);

test('toSet should create a new set from enumerable',
    () =>
    {
        const stringifier = (x: number) => (x + 1).toString();
        const elements: number[] = [1, 2, 3, 2, 1, 3, 3, 4];
        const source = new Enumerable(elements);
        const result = source.toSet(stringifier);
        expect(result).toMatchObject(Iteration.ToSet(elements, stringifier));
    }
);

test('toMap should create a new map from enumerable',
    () =>
    {
        const keySelector = (n: number) => Math.trunc(n / 10);
        const valueSelector = (n: number) => n.toString();
        const stringifier = (x: number) => (x + 1).toString();
        const elements: number[] = [10, 20, 30, 21, 11, 31, 32, 40];
        const source = new Enumerable(elements);
        const result = source.toMap(keySelector, valueSelector, stringifier);
        expect(result).toMatchObject(Iteration.ToMap(elements, keySelector, valueSelector, stringifier));
    }
);

test('forEach should invoke callback for each element',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        let index = 0;

        source.forEach((x, idx) =>
        {
            expect(x).toBe(elements[index]);
            expect(idx).toBe(index++);
        });
        expect(index).toBe(elements.length);
    }
);

test('reduce should return proper result',
    () =>
    {
        const seed = '0';
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = source.reduce((p, c) => `${p}|${c}`, seed);
        expect(result).toBe(Iteration.Reduce(elements, (p, c) => `${p}|${c}`, seed));
    }
);

test('hasDuplicates should return true if collection contains duplicates',
    () =>
    {
        const elements: number[] = [1, 2, 3, 2, 5];
        const source = new Enumerable(elements);
        const result = source.hasDuplicates(x => (x + 1).toString());
        expect(result).toBe(Iteration.HasDuplicates(elements, x => (x + 1).toString()));
    }
);

test('hasDuplicates should return false if collection doesn\'t contain duplicates',
    () =>
    {
        const elements: number[] = [1, 2, 3, 5];
        const source = new Enumerable(elements);
        const result = source.hasDuplicates(x => (x + 1).toString());
        expect(result).toBe(Iteration.HasDuplicates(elements, x => (x + 1).toString()));
    }
);

test('iterator symbol should return a valid iterable',
    () =>
    {
        const elements: number[] = [1, 2, 3];
        const source = new Enumerable(elements);
        const result = Array.from(source[Symbol.iterator]());
        expect(result).toMatchObject(elements);
    }
);
