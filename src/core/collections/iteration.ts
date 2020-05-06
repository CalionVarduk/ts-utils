import { UnorderedSet } from './unordered-set';
import { UnorderedMap } from './unordered-map';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { Grouping, makeGrouping } from './grouping';
import { Optional } from '../types/optional';
import { isDefined } from '../functions/is-defined';
import { Stringifier } from '../types/stringifier';
import { Ensured } from '../types/ensured';
import { toDeepReadonly, DeepReadonly } from '../types/deep-readonly';
import { KeySelector } from './key-selector';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { isNull, isUndefined, isInstanceOfType } from '../functions';
import { Pair, makePair } from './pair';
import { Nullable } from '../types/nullable';
import { Undefinable } from '../types';
import { EqualityComparer } from '../types/equality-comparer';
import { Comparer } from '../types/comparer';

export namespace Iteration
{
    export function* Empty<T>(): Iterable<T> {}

    export function* ToIterable<T>(
        object: T):
        Iterable<T>
    {
        yield object;
    }

    export function* FilterDefinedOnly<T>(
        source: Iterable<Optional<T>>):
        Iterable<T>
    {
        for (const obj of source)
            if (isDefined(obj))
                yield obj;
    }

    export function* FilterNotNull<T>(
        source: Iterable<Nullable<T>>):
        Iterable<T>
    {
        for (const obj of source)
            if (!isNull(obj))
                yield obj;
    }

    export function* FilterNotUndefined<T>(
        source: Iterable<Undefinable<T>>):
        Iterable<T>
    {
        for (const obj of source)
            if (!isUndefined(obj))
                yield obj;
    }

    export function* Filter<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        Iterable<T>
    {
        let index = 0;

        for (const obj of source)
            if (predicate(obj, index++))
                yield obj;
    }

    export function* Map<T, U>(
        source: Iterable<T>,
        mapper: (obj: T, index: number) => U):
        Iterable<U>
    {
        let index = 0;

        for (const obj of source)
            yield mapper(obj, index++);
    }

    export function* MapMany<T, U>(
        source: Iterable<T>,
        mapper: (obj: T, index: number) => Iterable<U>):
        Iterable<U>
    {
        let index = 0;

        for (const obj of source)
            yield* mapper(obj, index++);
    }

    export function* Concat<T>(
        source: Iterable<T>,
        other: Iterable<T>):
        Iterable<T>
    {
        yield* source;
        yield* other;
    }

    export function* Repeat<T>(
        source: Iterable<T>,
        count: number):
        Iterable<T>
    {
        for (let i = 0; i < count; ++i)
            yield* source;
    }

    export function* Take<T>(
        source: Iterable<T>,
        count: number):
        Iterable<T>
    {
        let index = 0;

        for (const obj of source)
        {
            if (index >= count)
                break;

            yield obj;
            ++index;
        }
    }

    export function* TakeWhile<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        Iterable<T>
    {
        let index = 0;

        for (const obj of source)
        {
            if (!predicate(obj, index++))
                break;

            yield obj;
        }
    }

    export function* Skip<T>(
        source: Iterable<T>,
        count: number):
        Iterable<T>
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
    }

    export function* SkipWhile<T>(
        source: Iterable<T>,
        predicate: (obj: T, index: number) => boolean):
        Iterable<T>
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
    }

    export function* Zip<T, U>(
        source: Iterable<T>,
        other: Iterable<U>):
        Iterable<Pair<T, U>>
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
    }

    export function* Unique<T>(
        source: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        const set = new UnorderedSet<T>(objectStringifier);

        for (const obj of source)
            if (set.tryAdd(obj))
                yield obj;
    }

    export function* Intersect<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        const otherSet = Iteration.ToSet(other, objectStringifier);

        for (const obj of source)
            if (otherSet.tryDelete(toDeepReadonly(obj)))
                yield obj;
    }

    export function* Union<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        const set = new UnorderedSet<T>(objectStringifier);

        for (const obj of source)
            if (set.tryAdd(obj))
                yield obj;

        for (const obj of other)
            if (set.tryAdd(obj))
                yield obj;
    }

    export function* Except<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Iterable<T>
    {
        const otherSet = Iteration.ToSet(other, objectStringifier);

        for (const obj of source)
            if (otherSet.tryAdd(obj))
                yield obj;
    }

    export function* LeftJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Ensured<T>, otherObj: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        const otherMap = Iteration.ToMap(other, otherKeySelector, o => o, keyStringifier);
        let index = 0;

        for (const sourceObj of source)
        {
            const key = sourceKeySelector(toDeepReadonly(sourceObj));
            const otherObj = otherMap.tryGet(key);
            yield resultMapper(sourceObj!, otherObj, index++);
        }
    }

    export function* InnerJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Ensured<T>, otherObj: Ensured<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        const otherMap = Iteration.ToMap(other, otherKeySelector, o => o, keyStringifier);
        let index = 0;

        for (const sourceObj of source)
        {
            const key = sourceKeySelector(toDeepReadonly(sourceObj));
            const otherObj = otherMap.tryGet(key);

            if (isNull(otherObj))
                continue;

            yield resultMapper(sourceObj!, otherObj!, index++);
        }
    }

    export function* FullJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Nullable<T>, otherObj: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Iterable<TResult>
    {
        const otherMap = Iteration.ToMap(other, otherKeySelector, o => o, keyStringifier);
        let index = 0;

        for (const sourceObj of source)
        {
            const key = sourceKeySelector(toDeepReadonly(sourceObj));
            const otherObj = otherMap.tryGet(key);

            if (!isNull(otherObj))
                otherMap.tryDelete(key);

            yield resultMapper(sourceObj, otherObj, index++);
        }
        for (const otherObj of other)
        {
            const key = otherKeySelector(toDeepReadonly(otherObj));

            if (otherMap.has(key))
                yield resultMapper(null, otherObj, index++);
        }
    }

    export function* Reverse<T>(
        source: Iterable<T>):
        Iterable<T>
    {
        const result = isInstanceOfType<T[]>(Array, source) ? source : Iteration.ToArray(source);
        for (let i = result.length - 1; i >= 0; --i)
            yield result[i];
    }

    export function EmptyIfUndefined<T>(
        source: Optional<Iterable<T>>):
        Iterable<T>
    {
        return isDefined(source) ? source : Iteration.Empty<T>();
    }

    export function ReinterpretCast<TResult>(
        source: Iterable<any>):
        Iterable<TResult>
    {
        return reinterpretCast<Iterable<TResult>>(source);
    }

    export function AsDeepReadonly<T>(
        source: Iterable<T>):
        Iterable<DeepReadonly<T>>
    {
        return reinterpretCast<Iterable<DeepReadonly<T>>>(source);
    }

    export function Sort<T>(
        source: Iterable<T>,
        comparer: Comparer<T>):
        Iterable<T>
    {
        const result = isInstanceOfType<T[]>(Array, source) ? source : Iteration.ToArray(source);
        result.sort(reinterpretCast<(l: T, r: T) => number>(comparer));
        return result;
    }

    export function GroupBy<T, TKey>(
        source: Iterable<T>,
        keySelector: KeySelector<TKey, T>,
        keyStringifier?: Stringifier<TKey>):
        IReadonlyUnorderedMap<TKey, Grouping<TKey, T>>
    {
        const result = new UnorderedMap<TKey, Grouping<TKey, T>>(keyStringifier);

        for (const obj of source)
        {
            const key = keySelector(toDeepReadonly(obj));
            const group = result.getOrAdd(key, () => makeGrouping<TKey, T>(key, []));
            reinterpretCast<T[]>(group.items).push(obj);
        }
        return result;
    }

    export function SequenceEqual<T>(
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

    export function SetEqual<T>(
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

    export function IsEmpty<T>(
        source: Iterable<T>):
        boolean
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done === true;
    }

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

    export function Count<T>(
        source: Iterable<T>):
        number
    {
        let result = 0;

        for (const _ of source)
            ++result;

        return result;
    }

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

    export function TryFirst<T>(
        source: Iterable<T>):
        Nullable<T>
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? null : result.value;
    }

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

    export function At<T>(
        source: Iterable<T>,
        index: number):
        T
    {
        source = Iteration.Skip(source, index);
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();

        if (result.done)
            throw new Error(`iterable collection doesn't have enough elements [expected at least ${index + 1}]`);

        return result.value;
    }

    export function TryAt<T>(
        source: Iterable<T>,
        index: number):
        Nullable<T>
    {
        source = Iteration.Skip(source, index);
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? null : result.value;
    }

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

    export function TrySingle<T>(
        source: Iterable<T>):
        Nullable<T>
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done || !iterator.next().done ? null : result.value;
    }

    export function ToArray<T>(
        source: Iterable<T>):
        T[]
    {
        return Array.from(source);
    }

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

    export function ForEach<T>(
        source: Iterable<T>,
        callback: (obj: T, index: number) => void):
        void
    {
        let index = 0;

        for (const obj of source)
            callback(obj, index++);
    }

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
