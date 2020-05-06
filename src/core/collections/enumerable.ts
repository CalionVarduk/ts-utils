import { Iteration } from './iteration';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { Grouping } from './grouping';
import { UnorderedSet } from './unordered-set';
import { UnorderedMap } from './unordered-map';
import { Ensured } from '../types/ensured';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Pair } from './pair';
import { Stringifier } from '../types/stringifier';
import { KeySelector } from './key-selector';
import { Nullable } from '../types/nullable';
import { NotNull } from '../types/not-null';
import { NotUndefined } from '../types/not-undefined';
import { Comparer } from '../types/comparer';
import { DeepReadonly } from '../types';
import { EqualityComparer } from '../types/equality-comparer';

export class Enumerable<T>
    implements
    Iterable<T>
{
    private readonly _iterable: Iterable<T>;

    public constructor(iterable: Iterable<T>)
    {
        this._iterable = iterable;
    }

    public filterDefinedOnly():
        Enumerable<Ensured<T>>
    {
        return new Enumerable<Ensured<T>>(
            reinterpretCast<Iterable<Ensured<T>>>(Iteration.FilterDefinedOnly(this._iterable)));
    }

    public filterNotNull():
        Enumerable<NotNull<T>>
    {
        return new Enumerable<NotNull<T>>(
            reinterpretCast<Iterable<NotNull<T>>>(Iteration.FilterNotNull(this._iterable)));
    }

    public filterNotUndefined():
        Enumerable<NotUndefined<T>>
    {
        return new Enumerable<NotUndefined<T>>(
            reinterpretCast<Iterable<NotUndefined<T>>>(Iteration.FilterNotUndefined(this._iterable)));
    }

    public filter(
        predicate: (obj: T, index: number) => boolean):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Filter(this._iterable, predicate));
    }

    public map<U>(
        mapper: (obj: T, index: number) => U):
        Enumerable<U>
    {
        return new Enumerable<U>(
            Iteration.Map(this._iterable, mapper));
    }

    public mapMany<U>(
        mapper: (obj: T, index: number) => Iterable<U>):
        Enumerable<U>
    {
        return new Enumerable<U>(
            Iteration.MapMany(this._iterable, mapper));
    }

    public concat(
        other: Iterable<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Concat(this._iterable, other));
    }

    public repeat(
        count: number):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Repeat(this._iterable, count));
    }

    public take(
        count: number):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Take(this._iterable, count));
    }

    public takeWhile(
        predicate: (obj: T, index: number) => boolean):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.TakeWhile(this._iterable, predicate));
    }

    public skip(
        count: number):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Skip(this._iterable, count));
    }

    public skipWhile(
        predicate: (obj: T, index: number) => boolean):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.SkipWhile(this._iterable, predicate));
    }

    public zip<U>(
        other: Iterable<U>):
        Enumerable<Pair<T, U>>
    {
        return new Enumerable<Pair<T, U>>(
            Iteration.Zip(this._iterable, other));
    }

    public unique(
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Unique(this._iterable, objectStringifier));
    }

    public intersect(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Intersect(this._iterable, other, objectStringifier));
    }

    public union(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Union(this._iterable, other, objectStringifier));
    }

    public except(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Except(this._iterable, other, objectStringifier));
    }

    public leftJoin<U, TKey, TResult>(
        keySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Ensured<T>, otherObj: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.LeftJoin(this._iterable, keySelector, other, otherKeySelector, resultMapper, keyStringifier));
    }

    public innerJoin<U, TKey, TResult>(
        keySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Ensured<T>, otherObj: Ensured<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.InnerJoin(this._iterable, keySelector, other, otherKeySelector, resultMapper, keyStringifier));
    }

    public fullJoin<U, TKey, TResult>(
        keySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Nullable<T>, otherObj: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.FullJoin(this._iterable, keySelector, other, otherKeySelector, resultMapper, keyStringifier));
    }

    public reverse():
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Reverse(this._iterable));
    }

    public reinterpretCast<U>():
        Enumerable<U>
    {
        return new Enumerable<U>(
            Iteration.ReinterpretCast<U>(this._iterable));
    }

    public asDeepReadonly():
        Enumerable<DeepReadonly<T>>
    {
        return new Enumerable<DeepReadonly<T>>(
            Iteration.AsDeepReadonly(this._iterable));
    }

    public sort(
        comparer: Comparer<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Sort(this._iterable, comparer));
    }

    public groupBy<TKey>(
        keySelector: KeySelector<TKey, T>,
        keyStringifier?: Stringifier<TKey>):
        IReadonlyUnorderedMap<TKey, Grouping<TKey, T>>
    {
        return Iteration.GroupBy(this._iterable, keySelector, keyStringifier);
    }

    public sequenceEqual(
        other: Iterable<T>,
        comparer?: EqualityComparer<T>):
        boolean
    {
        return Iteration.SequenceEqual(this._iterable, other, comparer);
    }

    public setEqual(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        boolean
    {
        return Iteration.SetEqual(this._iterable, other, objectStringifier);
    }

    public isEmpty():
        boolean
    {
        return Iteration.IsEmpty(this._iterable);
    }

    public some(
        predicate: (obj: T, index: number) => boolean):
        boolean
    {
        return Iteration.Some(this._iterable, predicate);
    }

    public every(
        predicate: (obj: T, index: number) => boolean):
        boolean
    {
        return Iteration.Every(this._iterable, predicate);
    }

    public has(
        object: DeepReadonly<T>,
        comparer?: EqualityComparer<T>):
        boolean
    {
        return Iteration.Has(this._iterable, object, comparer);
    }

    public count():
        number
    {
        return Iteration.Count(this._iterable);
    }

    public first():
        T
    {
        return Iteration.First(this._iterable);
    }

    public tryFirst():
        Nullable<T>
    {
        return Iteration.TryFirst(this._iterable);
    }

    public last():
        T
    {
        return Iteration.Last(this._iterable);
    }

    public tryLast():
        Nullable<T>
    {
        return Iteration.TryLast(this._iterable);
    }

    public at(
        index: number):
        T
    {
        return Iteration.At(this._iterable, index);
    }

    public tryAt(
        index: number):
        Nullable<T>
    {
        return Iteration.TryAt(this._iterable, index);
    }

    public single():
        T
    {
        return Iteration.Single(this._iterable);
    }

    public trySingle():
        Nullable<T>
    {
        return Iteration.TrySingle(this._iterable);
    }

    public toArray():
        T[]
    {
        return Iteration.ToArray(this._iterable);
    }

    public toSet(
        objectStringifier?: Stringifier<T>):
        UnorderedSet<T>
    {
        return Iteration.ToSet(this._iterable, objectStringifier);
    }

    public toMap<TKey, TValue>(
        keySelector: KeySelector<TKey, T>,
        valueSelector: (obj: T) => TValue,
        keyStringifier?: Stringifier<TKey>):
        UnorderedMap<TKey, TValue>
    {
        return Iteration.ToMap(this._iterable, keySelector, valueSelector, keyStringifier);
    }

    public forEach(
        callback: (obj: T, index: number) => void):
        void
    {
        Iteration.ForEach(this._iterable, callback);
    }

    public reduce<TResult>(
        callback: (prev: TResult, current: T, index: number) => TResult,
        seed: TResult):
        TResult
    {
        return Iteration.Reduce(this._iterable, callback, seed);
    }

    public hasDuplicates(
        objectStringifier?: Stringifier<T>):
        boolean
    {
        return Iteration.HasDuplicates(this._iterable, objectStringifier);
    }

    public getIterable():
        Iterable<T>
    {
        return this._iterable;
    }

    public* [Symbol.iterator](): IterableIterator<T>
    {
        yield* this._iterable;
    }
}
