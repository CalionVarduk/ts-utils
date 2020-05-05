import { Iteration } from './iteration';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { IGrouping } from './grouping.interface';
import { UnorderedSet } from './unordered-set';
import { UnorderedMap } from './unordered-map';
import { Ensured } from '../types/ensured';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Pair } from './pair';
import { EnsuredStringifier } from '../stringifier';
import { KeySelector } from './key-selector';
import { Nullable } from '../types/nullable';

export class Enumerator<T>
    implements
    Iterable<T>
{
    private readonly _iterable: Iterable<T>;

    public constructor(iterable: Iterable<T>)
    {
        this._iterable = iterable;
    }

    public definedOnly():
        Enumerator<Ensured<T>>
    {
        return new Enumerator<Ensured<T>>(
            reinterpretCast<Iterable<Ensured<T>>>(Iteration.DefinedOnly(this._iterable)));
    }

    public filter(
        predicate: (obj: T, index: number) => boolean):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Filter(this._iterable, predicate));
    }

    public map<U>(
        mapper: (obj: T, index: number) => U):
        Enumerator<U>
    {
        return new Enumerator<U>(
            Iteration.Map(this._iterable, mapper));
    }

    public mapMany<U>(
        mapper: (obj: T, index: number) => Iterable<U>):
        Enumerator<U>
    {
        return new Enumerator<U>(
            Iteration.MapMany(this._iterable, mapper));
    }

    public concat(
        other: Iterable<T>):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Concat(this._iterable, other));
    }

    public repeat(
        count: number):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Repeat(this._iterable, count));
    }

    public take(
        count: number):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Take(this._iterable, count));
    }

    public takeWhile(
        predicate: (obj: T, index: number) => boolean):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.TakeWhile(this._iterable, predicate));
    }

    public skip(
        count: number):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Skip(this._iterable, count));
    }

    public skipWhile(
        predicate: (obj: T, index: number) => boolean):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.SkipWhile(this._iterable, predicate));
    }

    public zip<U>(
        other: Iterable<U>):
        Enumerator<Pair<T, U>>
    {
        return new Enumerator<Pair<T, U>>(
            Iteration.Zip(this._iterable, other));
    }

    public unique(
        objectStringifier?: EnsuredStringifier<T>):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Unique(this._iterable, objectStringifier));
    }

    public intersect(
        other: Iterable<T>,
        objectStringifier?: EnsuredStringifier<T>):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Intersect(this._iterable, other, objectStringifier));
    }

    public union(
        other: Iterable<T>,
        objectStringifier?: EnsuredStringifier<T>):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Union(this._iterable, other, objectStringifier));
    }

    public except(
        other: Iterable<T>,
        objectStringifier?: EnsuredStringifier<T>):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Except(this._iterable, other, objectStringifier));
    }

    public leftJoin<U, TKey, TResult>(
        keySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Ensured<T>, otherObj: Nullable<U>, index: number) => TResult,
        keyStringifier?: EnsuredStringifier<TKey>):
        Enumerator<TResult>
    {
        return new Enumerator<TResult>(
            Iteration.LeftJoin(this._iterable, keySelector, other, otherKeySelector, resultMapper, keyStringifier));
    }

    public innerJoin<U, TKey, TResult>(
        keySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Ensured<T>, otherObj: Ensured<U>, index: number) => TResult,
        keyStringifier?: EnsuredStringifier<TKey>):
        Enumerator<TResult>
    {
        return new Enumerator<TResult>(
            Iteration.InnerJoin(this._iterable, keySelector, other, otherKeySelector, resultMapper, keyStringifier));
    }

    public fullJoin<U, TKey, TResult>(
        keySelector: KeySelector<TKey, T>,
        other: Iterable<U>,
        otherKeySelector: KeySelector<TKey, U>,
        resultMapper: (sourceObj: Nullable<T>, otherObj: Nullable<U>, index: number) => TResult,
        keyStringifier?: EnsuredStringifier<TKey>):
        Enumerator<TResult>
    {
        return new Enumerator<TResult>(
            Iteration.FullJoin(this._iterable, keySelector, other, otherKeySelector, resultMapper, keyStringifier));
    }

    public reverse():
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Reverse(this._iterable));
    }

    public reinterpretCast<U>():
        Enumerator<U>
    {
        return new Enumerator<U>(
            Iteration.ReinterpretCast<U>(this._iterable));
    }

    public sort(
        comparer: (left: T, right: T) => number):
        Enumerator<T>
    {
        return new Enumerator<T>(
            Iteration.Sort(this._iterable, comparer));
    }

    public groupBy<TKey>(
        keySelector: KeySelector<TKey, T>,
        keyStringifier?: EnsuredStringifier<TKey>):
        IReadonlyUnorderedMap<TKey, IGrouping<TKey, T>>
    {
        return Iteration.GroupBy(this._iterable, keySelector, keyStringifier);
    }

    public sequenceEqual(
        other: Iterable<T>,
        comparer?: (left: T, right: T) => boolean):
        boolean
    {
        return Iteration.SequenceEqual(this._iterable, other, comparer);
    }

    public setEqual(
        other: Iterable<T>,
        objectStringifier?: EnsuredStringifier<T>):
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
        object: T,
        comparer?: (left: T, right: T) => boolean):
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
        objectStringifier?: EnsuredStringifier<T>):
        UnorderedSet<T>
    {
        return Iteration.ToSet(this._iterable, objectStringifier);
    }

    public toMap<TKey, TValue>(
        keySelector: KeySelector<TKey, T>,
        valueSelector: (obj: Ensured<T>) => TValue,
        keyStringifier?: EnsuredStringifier<TKey>):
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

    public* [Symbol.iterator](): IterableIterator<T>
    {
        yield* this._iterable;
    }
}
