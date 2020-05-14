import { UnorderedSet } from './unordered-set';
import { UnorderedMap } from './unordered-map';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { Grouping, makeGrouping } from './grouping';
import { Optional } from '../types/optional';
import { isDefined } from '../functions/is-defined';
import { Stringifier } from '../types/stringifier';
import { toDeepReadonly, DeepReadonly } from '../types/deep-readonly';
import { KeySelector } from './key-selector';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { isNull } from '../functions/is-null';
import { Pair, makePair } from './pair';
import { Nullable } from '../types/nullable';
import { Undefinable } from '../types/undefinable';
import { EqualityComparer } from '../types/equality-comparer';
import { Comparer } from '../types/comparer';
import { List } from './list';
import { readonlyCast } from '../functions/readonly-cast';
import { isUndefined } from '../functions/is-undefined';
import { SafeCast, isOfType } from '../functions/dynamic-cast';
import { isInstanceOfType } from '../functions/instance-of-cast';
import { createIterable } from '../functions/create-iterable';
import { ObjectType } from '../types/object-type';
import { PrimitiveTypeNames } from '../types/primitive';
import { Rng } from '../rng';
import { Lazy } from '../lazy';

const EMPTY_ITERATOR_RESULT: any = readonlyCast(Object.freeze({
    done: true
}));

const EMPTY_ITERATOR: Iterator<any> = readonlyCast(Object.freeze({
    next()
    {
        return EMPTY_ITERATOR_RESULT;
    }
}));

const EMPTY: Iterable<any> = readonlyCast(Object.freeze(createIterable(() => EMPTY_ITERATOR)));

/** Contains basic functions that allow to manipulate Iterable objects. */
export namespace Iteration
{
    /**
     * Creates an empty iterable.
     * @return An empty iterable.
     */
    export function Empty<T>(): Iterable<T>
    {
        return EMPTY;
    }

    /**
     * Creates an iterable representing a growing sequence of numbers, starting with `from` and ending with an optional `to`.
     * If `to` is not provided, then the collection is infinite.
     * @param from Value to start with.
     * @param to Optional value to end with.
     * A growing sequence of numbers, starting with `from` and ending with `to`, if provided, otherwise the sequence is infinite.
     */
    export function Range(
        from: number,
        to?: number):
        Iterable<number>
    {
        if (isDefined(to))
            return createIterable(function*()
                {
                    let value = from;

                    while (value <= to)
                        yield value++;
                });

        return createIterable(function*()
            {
                let value = from;

                while (true)
                    yield value++;
            });
    }

    /**
     * Creates an iterable contains only the `object`.
     * @param object Iterable's object.
     * @returns An iterable containing only the `object`.
     */
    export function ToIterable<T>(
        object: T):
        Iterable<T>
    {
        return createIterable(function*()
            {
                yield object;
            });
    }

    /**
     * Filters out all `null` or `undefined` elements.
     * @param source Iterable to filter.
     * @returns A filtered iterable.
     */
    export function FilterDefinedOnly<T>(
        source: Iterable<Optional<T>>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                for (const obj of source)
                    if (isDefined(obj))
                        yield obj;
            });
    }

    /**
     * Filters out all `null` elements.
     * @param source Iterable to filter.
     * @returns A filtered iterable.
     */
    export function FilterNotNull<T>(
        source: Iterable<Nullable<T>>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                for (const obj of source)
                    if (!isNull(obj))
                        yield obj;
            });
    }

    /**
     * Filters out all `undefined` elements.
     * @param source Iterable to filter.
     * @returns A filtered iterable.
     */
    export function FilterNotUndefined<T>(
        source: Iterable<Undefinable<T>>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                for (const obj of source)
                    if (!isUndefined(obj))
                        yield obj;
            });
    }

    /**
     * Filters out elements based on a `predicate`.
     * @param source Iterable to filter.
     * @param predicate Filtering predicate.
     * @returns A filtered iterable.
     */
    export function Filter<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        Iterable<T>
    {
        return createIterable(function*()
            {
                let index = 0;

                for (const obj of source)
                    if (predicate(obj, index++))
                        yield obj;
            });
    }

    /**
     * Maps all elements from one type to another.
     * @param source Iterable to map.
     * @param mapper Mapping function.
     * @returns A mapped iterable.
     */
    export function Map<T, U>(
        source: Iterable<T>,
        mapper: (obj: T, index: number) => U):
        Iterable<U>
    {
        return createIterable(function*()
            {
                let index = 0;

                for (const obj of source)
                    yield mapper(obj, index++);
            });
    }

    /**
     * Flattens a collection of collections into a single iterable.
     * @param source Iterable to flatten.
     * @param mapper Flattening function.
     * @returns A flattened iterable.
     */
    export function MapMany<T, U>(
        source: Iterable<T>,
        mapper: (obj: T, index: number) => Iterable<U>):
        Iterable<U>
    {
        return createIterable(function*()
            {
                let index = 0;

                for (const obj of source)
                    yield* mapper(obj, index++);
            });
    }

    /**
     * Concatenates two iterables together, sequentially.
     * @param source First iterable.
     * @param other Second iterable.
     * @returns A concatenation of both iterables.
     */
    export function Concat<T>(
        source: Iterable<T>,
        other: Iterable<T>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                yield* source;
                yield* other;
            });
    }

    /**
     * Repeats an iterable `count` amount of times.
     * @param source Iterable to repeat.
     * @param count Amount of repetitions.
     * @returns A repeated iterable, if `source` is not empty, otherwise an empty iterable.
     */
    export function Repeat<T>(
        source: Iterable<T>,
        count: number):
        Iterable<T>
    {
        if (Iteration.IsEmpty(source))
            return Iteration.Empty<T>();

        return createIterable(function*()
            {
                for (let i = 0; i < count; ++i)
                    yield* source;
            });
    }

    /**
     * Loops an iterable infinitely.
     * @param source Iterable to loop.
     * @returns A looped, infinite iterable, if `source` is not empty, otherwise an empty iterable.
     */
    export function Loop<T>(
        source: Iterable<T>):
        Iterable<T>
    {
        if (Iteration.IsEmpty(source))
            return Iteration.Empty<T>();

        return createIterable(function*()
            {
                while (true)
                    yield* source;
            });
    }

    /**
     * Takes first `count` elements from an iterable.
     * @param source Iterable to take from.
     * @param count Amount of elements to take.
     * @returns An iterable containing at most `count` first elements from `source`.
     */
    export function Take<T>(
        source: Iterable<T>,
        count: number):
        Iterable<T>
    {
        return createIterable(function*()
            {
                let index = 0;

                for (const obj of source)
                {
                    if (index >= count)
                        break;

                    yield obj;
                    ++index;
                }
            });
    }

    /**
     * Takes elements from an iterable until an element not passing the `predicate` is found.
     * @param source Iterable to take from.
     * @param predicate Filtering predicate.
     * @returns An iterable containing all elements from `source` preceding an element not passing the `predicate`.
     */
    export function TakeWhile<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        Iterable<T>
    {
        return createIterable(function*()
            {
                let index = 0;

                for (const obj of source)
                {
                    if (!predicate(obj, index++))
                        break;

                    yield obj;
                }
            });
    }

    /**
     * Skips first `count` elements from an iterable.
     * @param source Iterable to skip from.
     * @param count Amount of elements to skip.
     * @returns An iterable not containing first `count` elements from `source`.
     */
    export function Skip<T>(
        source: Iterable<T>,
        count: number):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const iterator = source[Symbol.iterator]();
                let result = iterator.next();
                let index = 0;

                while (!result.done)
                {
                    if (index >= count)
                        break;

                    result = iterator.next();
                    ++index;
                }
                while (!result.done)
                {
                    yield result.value;
                    result = iterator.next();
                }
            });
    }

    /**
     * Skips elements from an iterable until an element not passing the `predicate` is found.
     * @param source Iterable to skip from.
     * @param predicate Filtering predicate.
     * @returns An iterable containing all elements from `source` following an element not passing the `predicate`, including that element.
     */
    export function SkipWhile<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const iterator = source[Symbol.iterator]();
                let result = iterator.next();
                let index = 0;

                while (!result.done)
                {
                    if (!predicate(result.value, index++))
                        break;

                    result = iterator.next();
                }
                while (!result.done)
                {
                    yield result.value;
                    result = iterator.next();
                }
            });
    }

    /**
     * Merges two iterables together, sequentially.
     * @param source First iterable.
     * @param other Second iterable.
     * @returns An iterable containing pairs of elements from both iterables, with length equal to the length of the shorter iterable.
     */
    export function Zip<T, U>(
        source: Iterable<T>,
        other: Iterable<U>):
        Iterable<Pair<T, U>>
    {
        return createIterable(function*()
            {
                const sourceIterator = source[Symbol.iterator]();
                const otherIterator = other[Symbol.iterator]();
                let sourceCurrent = sourceIterator.next();
                let otherCurrent = otherIterator.next();

                while (!sourceCurrent.done && !otherCurrent.done)
                {
                    yield makePair(sourceCurrent.value, otherCurrent.value);
                    sourceCurrent = sourceIterator.next();
                    otherCurrent = otherIterator.next();
                }
            });
    }

    /**
     * Selects unique elements from an iterable.
     * @param source Iterable to select distinct elements from.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A collection of unique elements.
     */
    export function Unique<T>(
        source: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const set = new UnorderedSet<T>(objectStringifier);

                for (const obj of source)
                    if (set.tryAdd(obj))
                        yield obj;
            });
    }

    /**
     * Selects a set intersection of two iterables.
     * @param source First iterable.
     * @param other Second iterable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A set intersection.
     */
    export function Intersect<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const otherSet = Iteration.ToSet(other, objectStringifier);

                for (const obj of source)
                    if (otherSet.tryDelete(toDeepReadonly(obj)))
                        yield obj;
            });
    }

    /**
     * Selects a set union of two iterables.
     * @param source First iterable.
     * @param other Second iterable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A set union.
     */
    export function Union<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const set = new UnorderedSet<T>(objectStringifier);

                for (const obj of source)
                    if (set.tryAdd(obj))
                        yield obj;

                for (const obj of other)
                    if (set.tryAdd(obj))
                        yield obj;
            });
    }

    /**
     * Selects a set difference of two iterables.
     * @param source First iterable.
     * @param other Second iterable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A set difference.
     */
    export function Except<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const otherSet = Iteration.ToSet(other, objectStringifier);

                for (const obj of source)
                    if (otherSet.tryAdd(obj))
                        yield obj;
            });
    }

    /**
     * Returns a result of left join between two iterables.
     * @param source Outer iterable to join.
     * @param sourceKeySelector Outer iterable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A left join result.
     */
    export function LeftJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: T, inner: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        return createIterable(function*()
            {
                const innerMap = Iteration.GroupBy(inner, innerKeySelector, o => o, keyStringifier);
                let index = 0;

                for (const sourceObj of source)
                {
                    const key = sourceKeySelector(toDeepReadonly(sourceObj));
                    const innerGroup = innerMap.tryGet(key);

                    if (isNull(innerGroup))
                        yield resultMapper(sourceObj, null, index++);
                    else
                    {
                        for (const innerObj of innerGroup.items)
                            yield resultMapper(sourceObj, innerObj, index++);
                    }
                }
            });
    }

    /**
     * Returns a result of inner join between two iterables.
     * @param source Outer iterable to join.
     * @param sourceKeySelector Outer iterable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns An inner join result.
     */
    export function InnerJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: T, inner: U, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        return createIterable(function*()
            {
                const innerMap = Iteration.GroupBy(inner, innerKeySelector, o => o, keyStringifier);
                let index = 0;

                for (const sourceObj of source)
                {
                    const key = sourceKeySelector(toDeepReadonly(sourceObj));
                    const innerGroup = innerMap.tryGet(key);

                    if (isNull(innerGroup))
                        continue;

                    for (const innerObj of innerGroup.items)
                        yield resultMapper(sourceObj, innerObj, index++);
                }
            });
    }

    /**
     * Returns a result of full join between two iterables.
     * @param source Outer iterable to join.
     * @param sourceKeySelector Outer iterable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A full join result.
     */
    export function FullJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: Nullable<T>, inner: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        return createIterable(function*()
            {
                const innerMap = Iteration.GroupBy(inner, innerKeySelector, o => o, keyStringifier);

                let index = 0;

                for (const sourceObj of source)
                {
                    const key = sourceKeySelector(toDeepReadonly(sourceObj));
                    const innerGroup = innerMap.tryGet(key);

                    if (isNull(innerGroup))
                        yield resultMapper(sourceObj, null, index++);
                    else
                    {
                        for (const innerObj of innerGroup.items)
                            yield resultMapper(sourceObj, innerObj, index++);

                        reinterpretCast<any>(innerGroup)._joined = true;
                    }
                }
                for (const innerObj of inner)
                {
                    const key = innerKeySelector(toDeepReadonly(innerObj));
                    const innerGroup = innerMap.get(key);

                    if (!reinterpretCast<any>(innerGroup)._joined)
                        yield resultMapper(null, innerObj, index++);
                }
            });
    }

    /**
     * Returns a result of group join between two iterables.
     * @param source Outer iterable to join.
     * @param sourceKeySelector Outer iterable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A group join result.
     */
    export function GroupJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: T, inner: Iterable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        return createIterable(function*()
            {
                const innerMap = Iteration.GroupBy(inner, innerKeySelector, o => o, keyStringifier);
                let index = 0;

                for (const sourceObj of source)
                {
                    const key = sourceKeySelector(toDeepReadonly(sourceObj));
                    const innerGroup = innerMap.tryGet(key);
                    yield resultMapper(sourceObj, isNull(innerGroup) ? Iteration.Empty<U>() : innerGroup, index++);
                }
            });
    }

    /**
     * Filters an iterable to elements of the specified type.
     * @param source An iterable to filter.
     * @param type Type to filter by.
     * @returns Filtered iterable.
     */
    export function OfType<T extends ObjectType | PrimitiveTypeNames>(
        source: Iterable<any>,
        type: T):
        Iterable<SafeCast<T>>
    {
        return createIterable(function*()
            {
                for (const obj of source)
                    if (isOfType(type, obj))
                        yield obj;
            });
    }

    /**
     * Reverses an iterable.
     * @param source Iterable to reverse.
     * @returns Reverted iterable.
     */
    export function Reverse<T>(
        source: Iterable<T>):
        Iterable<T>
    {
        return createIterable(function*()
            {
                const result = isInstanceOfType<T[]>(Array, source) ? source : Iteration.ToArray(source);
                for (let i = result.length - 1; i >= 0; --i)
                    yield result[i];
            });
    }

    /**
     * Creates an empty iterable, if the `source` is `null` or `undefined`, otherwise returns `source`.
     * @param source Iterable to check.
     * @returns `source`, if it is defined, otherwise an empty iterable.
     */
    export function EmptyIfUndefined<T>(
        source: Optional<Iterable<T>>):
        Iterable<T>
    {
        return isDefined(source) ? source : Iteration.Empty<T>();
    }

    /**
     * Reinterpret casts an iterable to another type.
     * @param source Iterable to cast.
     * @returns Iterable cast to another type.
     */
    export function ReinterpretCast<TResult>(
        source: Iterable<any>):
        Iterable<TResult>
    {
        return reinterpretCast<Iterable<TResult>>(source);
    }

    /**
     * Casts an iterable to an iterable with deep readonly elements.
     * @param source Iterable to cast.
     * @returns Iterable with elements cast to deep readonly.
     */
    export function AsDeepReadonly<T>(
        source: Iterable<T>):
        Iterable<DeepReadonly<T>>
    {
        return reinterpretCast<Iterable<DeepReadonly<T>>>(source);
    }

    /**
     * Sorts an iterable.
     * @param source Iterable to sort.
     * @param comparer Element comparison function.
     * @returns Sorted array.
     */
    export function Sort<T>(
        source: Iterable<T>,
        comparer: Comparer<T>):
        T[]
    {
        const result = isInstanceOfType<T[]>(Array, source) ? source : Iteration.ToArray(source);
        result.sort(reinterpretCast<(l: T, r: T) => number>(comparer));
        return result;
    }

    /**
     * Randomly shuffles an iterable.
     * @param source Iterable to shuffle.
     * @returns Shuffled array.
     */
    export function Shuffle<T>(
        source: Iterable<T>):
        T[]
    {
        const rng = new Rng();
        const result = isInstanceOfType<T[]>(Array, source) ? source : Iteration.ToArray(source);

        for (let i = result.length - 1; i >= 1; --i)
        {
            const j = rng.nextInt(0, i + 1);
            const temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    }

    /**
     * Copies an iterable to an array.
     * @param source Iterable to copy.
     * @param target Array to copy to.
     * @param start An optional index of the first `target` element to replace with the first elelement of `source`. Equal to 0 by default.
     * @param length An optional amount of elements to copy.
     * @returns `target`.
     */
    export function CopyTo<T>(
        source: Iterable<T>,
        target: T[],
        start?: number,
        length?: number):
        T[]
    {
        if (!isDefined(start))
            start = 0;

        if (!isDefined(length))
            length = target.length - start;

        if (start < 0)
        {
            source = Iteration.Skip(source, -start);
            length += start;
            start = 0;
        }

        if (start + length > target.length)
            length = target.length - start;

        if (length <= 0)
            return target;

        let index = start;
        let count = 0;

        for (const obj of source)
        {
            target[index++] = obj;
            if (++count >= length)
                break;
        }
        return target;
    }

    /**
     * Groups iterable elements according to a specified key selector.
     * @param source Iterable to group by.
     * @param keySelector Element key selector.
     * @param valueSelector Element value selector.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A lookup of elements grouped by their keys.
     */
    export function GroupBy<T, TKey, TValue>(
        source: Iterable<T>,
        keySelector: KeySelector<TKey, T>,
        valueSelector: (value: T) => TValue,
        keyStringifier?: Stringifier<TKey>):
        IReadonlyUnorderedMap<TKey, Grouping<TKey, TValue>>
    {
        const result = new UnorderedMap<TKey, Grouping<TKey, TValue>>(keyStringifier);

        for (const obj of source)
        {
            const key = keySelector(toDeepReadonly(obj));
            const group = result.getOrAdd(key, () => makeGrouping<TKey, TValue>(key, []));
            reinterpretCast<TValue[]>(group.items).push(valueSelector(obj));
        }
        return result;
    }

    /**
     * Checks whether or not two iterables are of the same length and their elements at the same positions are equal to each other.
     * @param source First iterable.
     * @param other Second iterable.
     * @param comparer An optional equality comparer. If not provided, then elements will be compared via the `===` operator.
     * @returns `true`, if both iterables are considered sequentially equal, otherwise `false`.
     */
    export function SequenceEquals<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        comparer?: EqualityComparer<T>):
        boolean
    {
        const sourceIterator = source[Symbol.iterator]();
        const otherIterator = other[Symbol.iterator]();
        let sourceCurrent = sourceIterator.next();
        let otherCurrent = otherIterator.next();

        if (isDefined(comparer))
        {
            while (!sourceCurrent.done && !otherCurrent.done)
            {
                if (!comparer(toDeepReadonly(sourceCurrent.value), toDeepReadonly(otherCurrent.value)))
                    return false;

                sourceCurrent = sourceIterator.next();
                otherCurrent = otherIterator.next();
            }
        }
        else
        {
            while (!sourceCurrent.done && !otherCurrent.done)
            {
                if (sourceCurrent.value !== otherCurrent.value)
                    return false;

                sourceCurrent = sourceIterator.next();
                otherCurrent = otherIterator.next();
            }
        }
        return sourceCurrent.done === otherCurrent.done;
    }

    /**
     * Checks whether or not two sets of elements are equal.
     * @param source First iterable.
     * @param other Second iterable.
     * @param objectStringifier An optional, custom object stringifier, used for object equality comparison.
     * @returns `true`, if both sets are considered equal, otherwise `false`.
     */
    export function SetEquals<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        boolean
    {
        const sourceSet = Iteration.ToSet(source, objectStringifier);
        const otherSet = new UnorderedSet<T>(objectStringifier);

        for (const obj of other)
        {
            if (!sourceSet.has(toDeepReadonly(obj)))
                return false;

            otherSet.tryAdd(obj);
        }
        return sourceSet.length === otherSet.length;
    }

    /**
     * Checks whether or not an iterable is empty.
     * @param source Iterable to check.
     * @returns `true`, if iterable is empty, otherwise `false`.
     */
    export function IsEmpty<T>(
        source: Iterable<T>):
        boolean
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done === true;
    }

    /**
     * Checks if any iterable element satisfies the predicate.
     * @param source Iterable to check.
     * @param predicate Condition to check.
     * @returns `true`, if any element satisfies the predicate, otherwise `false`.
     */
    export function Some<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        boolean
    {
        let index = 0;

        for (const obj of source)
            if (predicate(obj, index++))
                return true;

        return false;
    }

    /**
     * Checks if all iterable elements satisfy the predicate.
     * @param source Iterable to check.
     * @param predicate Condition to check.
     * @returns `true`, if all elements satisfy the predicate, otherwise `false`.
     */
    export function Every<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        boolean
    {
        let index = 0;

        for (const obj of source)
            if (!predicate(obj, index++))
                return false;

        return true;
    }

    /**
     * Checks if an iterable contains an object.
     * @param source Iterable to check.
     * @param object Object to check.
     * @param comparer An optional equality comparer. If not provided, then elements will be compared via the `===` operator.
     * @returns `true`, if iterable contains the object, otherwise `false`.
     */
    export function Has<T>(
        source: Iterable<T>,
        object: DeepReadonly<T>,
        comparer?: EqualityComparer<T>):
        boolean
    {
        if (isDefined(comparer))
        {
            for (const obj of source)
                if (comparer(toDeepReadonly(obj), object))
                    return true;
        }
        else
        {
            for (const obj of source)
                if (obj === object)
                    return true;
        }
        return false;
    }

    /**
     * Calculates the amount of iterable elements.
     * @param source Iterable to calculate count for.
     * @returns Element count.
     */
    export function Count<T>(
        source: Iterable<T>):
        number
    {
        if (isInstanceOfType<T[]>(Array, source))
            return source.length;

        let result = 0;

        for (const _ of source)
            ++result;

        return result;
    }

    /**
     * Returns the first element in an iterable.
     * @param source Iterable to get the first element from.
     * @throws An `Error`, if the iterable is empty.
     * @returns The first element.
     */
    export function First<T>(
        source: Iterable<T>):
        T
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();

        if (result.done)
            throw new Error('iterable collection is empty');

        return result.value;
    }

    /**
     * Returns the first element in an iterable, or `null`, if iterable is empty.
     * @param source Iterable to get the first element from.
     * @returns The first element, or `null`, if iterable is empty.
     */
    export function TryFirst<T>(
        source: Iterable<T>):
        Nullable<T>
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? null : result.value;
    }

    /**
     * Returns the last element in an iterable.
     * @param source Iterable to get the last element from.
     * @throws An `Error`, if the iterable is empty.
     * @returns The last element.
     */
    export function Last<T>(
        source: Iterable<T>):
        T
    {
        const iterator = source[Symbol.iterator]();
        let current = iterator.next();

        if (current.done)
            throw new Error('iterable collection is empty');

        let result = current;
        current = iterator.next();

        while (!current.done)
        {
            result = current;
            current = iterator.next();
        }
        return result.value;
    }

    /**
     * Returns the last element in an iterable, or `null`, if iterable is empty.
     * @param source Iterable to get the last element from.
     * @returns The last element, or `null`, if iterable is empty.
     */
    export function TryLast<T>(
        source: Iterable<T>):
        Nullable<T>
    {
        const iterator = source[Symbol.iterator]();
        let current = iterator.next();

        if (current.done)
            return null;

        let result = current;
        current = iterator.next();

        while (!current.done)
        {
            result = current;
            current = iterator.next();
        }
        return result.value;
    }

    /**
     * Returns the element at the specified position in an iterable.
     * @param source Iterable to get the element from.
     * @param index Element position.
     * @throws An `Error`, if the iterable doesn't contain enough elements, or if `index` is negative.
     * @returns The element at the specified position.
     */
    export function At<T>(
        source: Iterable<T>,
        index: number):
        T
    {
        if (index < 0)
            throw new Error(`index can't be less than 0 [found: ${index}]`);

        source = Iteration.Skip(source, index);
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();

        if (result.done)
            throw new Error(`iterable collection doesn't have enough elements [expected at least ${index + 1}]`);

        return result.value;
    }

    /**
     * Returns the element at the specified position in an iterable, or `null`, if position is negative,
     * or if iterable doesn't contain enough elements.
     * @param source Iterable to get the element from.
     * @param index Element position.
     * @returns The element at the specified position, or `null`, if position is negative,
     * or if iterable doesn't contain enough elements.
     */
    export function TryAt<T>(
        source: Iterable<T>,
        index: number):
        Nullable<T>
    {
        if (index < 0)
            return null;

        source = Iteration.Skip(source, index);
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? null : result.value;
    }

    /**
     * Returns the only element in an iterable.
     * @param source Iterable to get the only element from.
     * @throws An `Error`, if the iterable doesn't contain exactly one element.
     * @returns The only element.
     */
    export function Single<T>(
        source: Iterable<T>):
        T
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();

        if (result.done)
            throw new Error('iterable collection is empty');

        if (!iterator.next().done)
            throw new Error('iterable collection contains more than one element');

        return result.value;
    }

    /**
     * Returns the only element in an iterable, or `null`, if iterable doesn't contain exactly one element.
     * @param source Iterable to get the only element from.
     * @returns The only element, or `null`, if iterable doesn't contain exactly one element.
     */
    export function TrySingle<T>(
        source: Iterable<T>):
        Nullable<T>
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done || !iterator.next().done ? null : result.value;
    }

    /**
     * Materializes an iterable immediately.
     * @param source Iterable to materialize.
     * @returns Materialized iterable.
     */
    export function Materialize<T>(
        source: Iterable<T>):
        Iterable<T>
    {
        return isInstanceOfType<T[]>(Array, source) ? source : Array.from(source);
    }

    /**
     * Memoizes an iterable.
     * @param source Iterable to memoize.
     * @returns Memoized iterable.
     */
    export function Memoize<T>(
        source: Iterable<T>):
        Iterable<T>
    {
        const memoized = new Lazy<T[]>(() => isInstanceOfType<T[]>(Array, source) ? source : Array.from(source));
        return createIterable(function()
            {
                return memoized.value[Symbol.iterator]();
            });
    }

    /**
     * Creates a new array from an iterable.
     * @param source Iterable to create an array from.
     * @returns An array with elements from the iterable.
     */
    export function ToArray<T>(
        source: Iterable<T>):
        T[]
    {
        return Array.from(source);
    }

    /**
     * Creates a new linked list from an iterable.
     * @param source Iterable to create a linked list from.
     * @returns A linked list with elements from the iterable.
     */
    export function ToList<T>(
        source: Iterable<T>):
        List<T>
    {
        return new List<T>(source);
    }

    /**
     * Creates a new set from an iterable.
     * @param source Iterable to create a set from.
     * @param objectStringifier An optional, custom object stringifier, used for object equality comparison.
     * @returns A set with elements from the iterable.
     */
    export function ToSet<T>(
        source: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        UnorderedSet<T>
    {
        const result = new UnorderedSet<T>(objectStringifier);

        for (const obj of source)
            result.tryAdd(obj);

        return result;
    }

    /**
     * Creates a new map from an iterable.
     * @param source Iterable to create a map from.
     * @param keySelector Element key selector.
     * @param valueSelector Element value selector.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A map with elements from the iterable.
     */
    export function ToMap<T, TKey, TValue>(
        source: Iterable<T>,
        keySelector: KeySelector<TKey, T>,
        valueSelector: (obj: T) => TValue,
        keyStringifier?: Stringifier<TKey>):
        UnorderedMap<TKey, TValue>
    {
        const result = new UnorderedMap<TKey, TValue>(keyStringifier);

        for (const obj of source)
        {
            const key = keySelector(toDeepReadonly(obj));
            const value = valueSelector(obj);
            result.tryAdd(key, value);
        }
        return result;
    }

    /**
     * Executes a callback for each iterable element.
     * @param source Iterable to enumerate over.
     * @param callback A function to execute for each element.
     */
    export function ForEach<T>(
        source: Iterable<T>,
        callback: (obj: T, index: number) => void):
        void
    {
        let index = 0;

        for (const obj of source)
            callback(obj, index++);
    }

    /**
     * Reduces an iterable to a single object via the provided algorithm.
     * @param source Iterable to reduce.
     * @param callback A function called for each iterable element, specifying how to reduce the collection.
     * @param seed A value to start the reduction with.
     * @returns Reduction result.
     */
    export function Reduce<T, TResult>(
        source: Iterable<T>,
        callback: (prev: TResult, current: T, index: number) => TResult,
        seed: TResult):
        TResult
    {
        let result = seed;
        let index = 0;

        for (const obj of source)
            result = callback(result, obj, index++);

        return result;
    }

    /**
     * Checks whether or not an iterable contains duplicate elements.
     * @param source An iterable to check.
     * @param objectStringifier An optional, custom object stringifier, used for object equality comparison.
     * @returns `true`, if the iterable contains duplicates, otherwise `false`.
     */
    export function HasDuplicates<T>(
        source: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        boolean
    {
        const set = new UnorderedSet<T>(objectStringifier);

        for (const obj of source)
            if (!set.tryAdd(obj))
                return true;

        return false;
    }
}
