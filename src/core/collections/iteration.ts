import { UnorderedSet } from './unordered-set';
import { UnorderedMap } from './unordered-map';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { IGrouping } from './grouping.interface';
import { Optional } from '../types/optional';
import { isDefined } from '../functions/is-defined';
import { EnsuredStringifier } from '../stringifier';
import { Ensured } from '../types/ensured';
import { toDeepReadonly, DeepReadonly } from '../types/deep-readonly';
import { Undefinable } from '../types/undefinable';
import { KeySelector } from './key-selector';
import { isUndefined } from '../functions/is-undefined';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Assert } from '../functions';
import { Pair, makePair } from './pair';

function safeDeepReadonlyCast<T>(
    obj: T):
    Ensured<DeepReadonly<T>>
{
    return reinterpretCast<Ensured<DeepReadonly<T>>>(
        Assert.IsDefined(obj, 'obj'));
}

export namespace Iteration
{
    export function* Empty<T>(): Iterable<T> {}

    export function* ToIterable<T>(
        object: T):
        Iterable<T>
    {
        yield object;
    }

    export function* DefinedOnly<T>(
        source: Iterable<Optional<T>>):
        Iterable<T>
    {
        for (const obj of source)
            if (isDefined(obj))
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
        objectStringifier?: EnsuredStringifier<T>):
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
        objectStringifier?: EnsuredStringifier<T>):
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
        objectStringifier?: EnsuredStringifier<T>):
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
        objectStringifier?: EnsuredStringifier<T>):
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
        resultMapper: (sourceObj: T, otherObj: Undefinable<U>, index: number) => TResult,
        keyStringifier?: EnsuredStringifier<TKey>):
        Iterable<TResult>
    {
        const otherMap = Iteration.ToMap(other, otherKeySelector, o => o, keyStringifier);
        let index = 0;

        for (const sourceObj of source)
        {
            const key = sourceKeySelector(safeDeepReadonlyCast(sourceObj));
            const otherObj = otherMap.tryGet(key);
            yield resultMapper(sourceObj, otherObj, index++);
        }
    }

    export function* InnerJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: T, otherObj: U, index: number) => TResult,
        keyStringifier?: EnsuredStringifier<TKey>):
        Iterable<TResult>
    {
        const otherMap = Iteration.ToMap(other, otherKeySelector, o => o, keyStringifier);
        let index = 0;

        for (const sourceObj of source)
        {
            const key = sourceKeySelector(safeDeepReadonlyCast(sourceObj));
            const otherObj = otherMap.tryGet(key);

            if (isUndefined(otherObj))
                continue;

            yield resultMapper(sourceObj, otherObj, index++);
        }
    }

    export function* FullJoin<T, U, TKey, TResult>(
        source: Iterable<T>,
        sourceKeySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Undefinable<T>, otherObj: Undefinable<U>, index: number) => TResult,
        keyStringifier?: EnsuredStringifier<TKey>):
        Iterable<TResult>
    {
        const otherMap = Iteration.ToMap(other, otherKeySelector, o => o, keyStringifier);
        let index = 0;

        for (const sourceObj of source)
        {
            const key = sourceKeySelector(safeDeepReadonlyCast(sourceObj));
            const otherObj = otherMap.tryGet(key);

            if (!isUndefined(otherObj))
                otherMap.tryDelete(key);

            yield resultMapper(sourceObj, otherObj, index++);
        }
        for (const otherObj of other)
        {
            const key = otherKeySelector(safeDeepReadonlyCast(otherObj));

            if (otherMap.has(key))
                yield resultMapper(void(0), otherObj, index++);
        }
    }

    export function* Reverse<T>(
        source: Iterable<T>):
        Iterable<T>
    {
        const result = Iteration.ToArray(source);
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

    export function Sort<T>(
        source: Iterable<T>,
        comparer: (left: T, right: T) => number):
        Iterable<T>
    {
        const result = Iteration.ToArray(source);
        result.sort(comparer);
        return result;
    }

    export function GroupBy<T, TKey>(
        source: Iterable<T>,
        keySelector: KeySelector<TKey, T>,
        keyStringifier?: EnsuredStringifier<TKey>):
        IReadonlyUnorderedMap<TKey, IGrouping<TKey, T>>
    {
        const result = new UnorderedMap<TKey, IGrouping<TKey, T>>(keyStringifier);

        for (const obj of source)
        {
            const key = keySelector(safeDeepReadonlyCast(obj));
            const group = result.getOrAdd(key, () =>
                {
                    const defaultGroup: IGrouping<TKey, T> = {
                        key: key,
                        items: []
                    };
                    return defaultGroup;
                });
            reinterpretCast<T[]>(group.items).push(obj);
        }
        return result;
    }

    export function SequenceEqual<T>(
        source: Iterable<T>,
        other: Iterable<T>,
        comparer?: (left: T, right: T) => boolean):
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
                if (!comparer(sourceCurrent.value, otherCurrent.value))
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
        objectStringifier?: EnsuredStringifier<T>):
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
        object: T,
        comparer?: (left: T, right: T) => boolean):
        boolean
    {
        if (isDefined(comparer))
        {
            for (const obj of source)
                if (comparer(obj, object))
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
        Undefinable<T>
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? void(0) : result.value;
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
        Undefinable<T>
    {
        const iterator = source[Symbol.iterator]();
        let current = iterator.next();

        if (current.done)
            return void(0);

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
        Undefinable<T>
    {
        source = Iteration.Skip(source, index);
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? void(0) : result.value;
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
        Undefinable<T>
    {
        const iterator = source[Symbol.iterator]();
        const result = iterator.next();
        return result.done || !iterator.next().done ? void(0) : result.value;
    }

    export function ToArray<T>(
        source: Iterable<T>):
        T[]
    {
        return Array.from(source);
    }

    export function ToSet<T>(
        source: Iterable<T>,
        objectStringifier?: EnsuredStringifier<T>):
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
        valueSelector: (obj: Ensured<T>) => TValue,
        keyStringifier?: EnsuredStringifier<TKey>):
        UnorderedMap<TKey, TValue>
    {
        const result = new UnorderedMap<TKey, TValue>(keyStringifier);

        for (const obj of source)
        {
            const key = keySelector(safeDeepReadonlyCast(obj));
            const value = valueSelector(reinterpretCast<Ensured<T>>(obj));
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
}
