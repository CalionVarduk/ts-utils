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
import { EqualityComparer } from '../types/equality-comparer';
import { List } from './list';
import { ObjectType } from '../types/object-type';
import { PrimitiveTypeNames } from '../types/primitive';
import { DeepReadonly } from '../types/deep-readonly';
import { TypeInstance } from '../types/type-instance';

/** Represents an enumerable collection. */
export class Enumerable<T>
    implements
    Iterable<T>
{
    private readonly _iterable: Iterable<T>;

    /**
     * Creates a new Enumerable object.
     * @param iterable Enumerable's iterable source.
     */
    public constructor(iterable: Iterable<T>)
    {
        this._iterable = iterable;
    }

    /**
     * Filters out all `null` or `undefined` elements.
     * @returns A filtered enumerable.
     */
    public filterDefinedOnly():
        Enumerable<Ensured<T>>
    {
        return new Enumerable<Ensured<T>>(
            reinterpretCast<Iterable<Ensured<T>>>(Iteration.FilterDefinedOnly(this._iterable)));
    }

    /**
     * Filters out all `null` elements.
     * @returns A filtered enumerable.
     */
    public filterNotNull():
        Enumerable<NotNull<T>>
    {
        return new Enumerable<NotNull<T>>(
            reinterpretCast<Iterable<NotNull<T>>>(Iteration.FilterNotNull(this._iterable)));
    }

    /**
     * Filters out all `undefined` elements.
     * @returns A filtered enumerable.
     */
    public filterNotUndefined():
        Enumerable<NotUndefined<T>>
    {
        return new Enumerable<NotUndefined<T>>(
            reinterpretCast<Iterable<NotUndefined<T>>>(Iteration.FilterNotUndefined(this._iterable)));
    }

    /**
     * Filters out elements based on a `predicate`.
     * @param predicate Filtering predicate.
     * @returns A filtered enumerable.
     */
    public filter(
        predicate: (obj: T, index: number) => boolean):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Filter(this._iterable, predicate));
    }

    /**
     * Maps all elements from one type to another.
     * @param mapper Mapping function.
     * @returns A mapped enumerable.
     */
    public map<U>(
        mapper: (obj: T, index: number) => U):
        Enumerable<U>
    {
        return new Enumerable<U>(
            Iteration.Map(this._iterable, mapper));
    }

    /**
     * Flattens a collection of collections into a single enumerable.
     * @param mapper Flattening function.
     * @returns A flattened enumerable.
     */
    public mapMany<U>(
        mapper: (obj: T, index: number) => Iterable<U>):
        Enumerable<U>
    {
        return new Enumerable<U>(
            Iteration.MapMany(this._iterable, mapper));
    }

    /**
     * Concatenates two collections together, sequentially.
     * @param other Other iterable.
     * @returns A concatenation of the enumerable with the other iterable.
     */
    public concat(
        other: Iterable<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Concat(this._iterable, other));
    }

    /**
     * Repeats an enumerable `count` amount of times.
     * @param count Amount of repetitions.
     * @returns A repeated enumerable, if it isn't empty, otherwise an empty enumerable.
     */
    public repeat(
        count: number):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Repeat(this._iterable, count));
    }

    /**
     * Loops an enumerable infinitely.
     * @returns A looped, infinite enumerable, if it isn't empty, otherwise an empty enumerable.
     */
    public loop():
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Loop(this._iterable));
    }

    /**
     * Takes first `count` elements from an enumerable.
     * @param count Amount of elements to take.
     * @returns An enumerable containing at most `count` first elements.
     */
    public take(
        count: number):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Take(this._iterable, count));
    }

    /**
     * Takes elements from an enumerable until an element not passing the `predicate` is found.
     * @param predicate Filtering predicate.
     * @returns An enumerable containing all elements preceding an element not passing the `predicate`.
     */
    public takeWhile(
        predicate: (obj: T, index: number) => boolean):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.TakeWhile(this._iterable, predicate));
    }

    /**
     * Skips first `count` elements from an enumerable.
     * @param count Amount of elements to skip.
     * @returns An enumerable not containing first `count` elements.
     */
    public skip(
        count: number):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Skip(this._iterable, count));
    }

    /**
     * Skips elements from an enumerable until an element not passing the `predicate` is found.
     * @param predicate Filtering predicate.
     * @returns An enumerable containing all elements following an element not passing the `predicate`, including that element.
     */
    public skipWhile(
        predicate: (obj: T, index: number) => boolean):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.SkipWhile(this._iterable, predicate));
    }

    /**
     * Merges an enumerable with another iterable, sequentially.
     * @param other Other iterable.
     * @returns An enumerables containing pairs of elements from the enumerable and the other iterable,
     * with length equal to the length of the shorter one.
     */
    public zip<U>(
        other: Iterable<U>):
        Enumerable<Pair<T, U>>
    {
        return new Enumerable<Pair<T, U>>(
            Iteration.Zip(this._iterable, other));
    }

    /**
     * Selects unique elements from an enumerable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A collection of unique elements.
     */
    public unique(
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Unique(this._iterable, objectStringifier));
    }

    /**
     * Selects a set intersection of an enumerable and another iterable.
     * @param other Other iterable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A set intersection.
     */
    public intersect(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Intersect(this._iterable, other, objectStringifier));
    }

    /**
     * Selects a set union of an enumerable and another iterable.
     * @param other Other iterable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A set union.
     */
    public union(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Union(this._iterable, other, objectStringifier));
    }

    /**
     * Selects a set difference of an enumerable and another iterable.
     * @param other Other iterable.
     * @param objectStringifier On optional, custom stringifier, used for element comparison.
     * @returns A set difference.
     */
    public except(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Except(this._iterable, other, objectStringifier));
    }

    /**
     * Returns a result of left join between an outer enumerable and another, inner iterable.
     * @param sourceKeySelector Outer enumerable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A left join result.
     */
    public leftJoin<U, TKey, TResult>(
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: T, inner: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.LeftJoin(this._iterable, sourceKeySelector, inner, innerKeySelector, resultMapper, keyStringifier));
    }

    /**
     * Returns a result of inner join between an outer enumerable and another, inner iterable.
     * @param sourceKeySelector Outer enumerable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns An inner join result.
     */
    public innerJoin<U, TKey, TResult>(
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: T, inner: U, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.InnerJoin(this._iterable, sourceKeySelector, inner, innerKeySelector, resultMapper, keyStringifier));
    }

    /**
     * Returns a result of full join between an outer enumerable and another, inner iterable.
     * @param sourceKeySelector Outer enumerable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A full join result.
     */
    public fullJoin<U, TKey, TResult>(
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: Nullable<T>, inner: Nullable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.FullJoin(this._iterable, sourceKeySelector, inner, innerKeySelector, resultMapper, keyStringifier));
    }

    /**
     * Returns a result of group join between an outer enumerable and another, inner iterable.
     * @param sourceKeySelector Outer enumerable key selector.
     * @param inner Inner iterable to join.
     * @param innerKeySelector Inner iterable key selector.
     * @param resultMapper A join result mapper function.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A group join result.
     */
    public groupJoin<U, TKey, TResult>(
        sourceKeySelector: KeySelector<TKey, T>,
        inner: Iterable<U>,
        innerKeySelector: KeySelector<TKey, U>,
        resultMapper: (outer: T, inner: Iterable<U>, index: number) => TResult,
        keyStringifier?: Stringifier<TKey>):
        Enumerable<TResult>
    {
        return new Enumerable<TResult>(
            Iteration.GroupJoin(this._iterable, sourceKeySelector, inner, innerKeySelector, resultMapper, keyStringifier));
    }

    /**
     * Filters an enumerable to elements of the specified type.
     * @param type Type to filter by.
     * @returns Filtered enumerable.
     */
    public ofType<U extends ObjectType | PrimitiveTypeNames>(
        type: U):
        Enumerable<TypeInstance<U>>
    {
        return new Enumerable<TypeInstance<U>>(
            Iteration.OfType(this._iterable, type));
    }

    /**
     * Reverses an enumerable.
     * @returns Reverted enumerable.
     */
    public reverse():
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Reverse(this._iterable));
    }

    /**
     * Reinterpret casts an enumerable to another type.
     * @returns Enumerable cast to another type.
     */
    public reinterpretCast<U>():
        Enumerable<U>
    {
        return new Enumerable<U>(
            Iteration.ReinterpretCast<U>(this._iterable));
    }

    /**
     * Casts an enumerable to an enumerable with deep readonly elements.
     * @returns Enumerable with elements cast to deep readonly.
     */
    public asDeepReadonly():
        Enumerable<DeepReadonly<T>>
    {
        return new Enumerable<DeepReadonly<T>>(
            Iteration.AsDeepReadonly(this._iterable));
    }

    /**
     * Sorts an enumerable.
     * @param comparer Element comparison function.
     * @returns Sorted enumerable.
     */
    public sort(
        comparer: Comparer<T>):
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Sort(this._iterable, comparer));
    }

    /**
     * Randomly shuffles an enumerable.
     * @returns Shuffled enumerable.
     */
    public shuffle():
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Shuffle(this._iterable));
    }

    /**
     * Copies an enumerable to an array.
     * @param target Array to copy to.
     * @param start An optional index of the first `target` element to replace with the first elelement of `source`. Equal to 0 by default.
     * @param length An optional amount of elements to copy.
     * @returns `target`.
     */
    public copyTo(
        target: T[],
        start?: number,
        length?: number):
        T[]
    {
        return Iteration.CopyTo(this._iterable, target, start, length);
    }

    /**
     * Groups enumerable elements according to a specified key selector.
     * @param keySelector Element key selector.
     * @param valueSelector Element value selector.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A lookup of elements grouped by their keys.
     */
    public groupBy<TKey, TValue>(
        keySelector: KeySelector<TKey, T>,
        valueSelector: (obj: T) => TValue,
        keyStringifier?: Stringifier<TKey>):
        IReadonlyUnorderedMap<TKey, Grouping<TKey, TValue>>
    {
        return Iteration.GroupBy(this._iterable, keySelector, valueSelector, keyStringifier);
    }

    /**
     * Checks whether or not an enumerable and another iterable are of the same length
     * and their elements at the same positions are equal to each other.
     * @param other Other iterable.
     * @param comparer An optional equality comparer. If not provided, then elements will be compared via the `===` operator.
     * @returns `true`, if the enumerable and the other iterable are considered sequentially equal, otherwise `false`.
     */
    public sequenceEquals(
        other: Iterable<T>,
        comparer?: EqualityComparer<T>):
        boolean
    {
        return Iteration.SequenceEquals(this._iterable, other, comparer);
    }

    /**
     * Checks whether or not two sets of elements are equal.
     * @param other Other iterable.
     * @param objectStringifier An optional, custom object stringifier, used for object equality comparison.
     * @returns `true`, if both sets are considered equal, otherwise `false`.
     */
    public setEquals(
        other: Iterable<T>,
        objectStringifier?: Stringifier<T>):
        boolean
    {
        return Iteration.SetEquals(this._iterable, other, objectStringifier);
    }

    /**
     * Checks whether or not an enumerable is empty.
     * @returns `true`, if enumerable is empty, otherwise `false`.
     */
    public isEmpty():
        boolean
    {
        return Iteration.IsEmpty(this._iterable);
    }

    /**
     * Checks if any enumerable element satisfies the predicate.
     * @param predicate Condition to check.
     * @returns `true`, if any element satisfies the predicate, otherwise `false`.
     */
    public some(
        predicate: (obj: T, index: number) => boolean):
        boolean
    {
        return Iteration.Some(this._iterable, predicate);
    }

    /**
     * Checks if all enumerable elements satisfy the predicate.
     * @param predicate Condition to check.
     * @returns `true`, if all elements satisfy the predicate, otherwise `false`.
     */
    public every(
        predicate: (obj: T, index: number) => boolean):
        boolean
    {
        return Iteration.Every(this._iterable, predicate);
    }

    /**
     * Checks if an enumerable contains an object.
     * @param object Object to check.
     * @param comparer An optional equality comparer. If not provided, then elements will be compared via the `===` operator.
     * @returns `true`, if enumerable contains the object, otherwise `false`.
     */
    public has(
        object: DeepReadonly<T>,
        comparer?: EqualityComparer<T>):
        boolean
    {
        return Iteration.Has(this._iterable, object, comparer);
    }

    /**
     * Calculates the amount of enumerable elements.
     * @returns Element count.
     */
    public count():
        number
    {
        return Iteration.Count(this._iterable);
    }

    /**
     * Returns the first element in an enumerable.
     * @throws An `Error`, if the enumerable is empty.
     * @returns The first element.
     */
    public first():
        T
    {
        return Iteration.First(this._iterable);
    }

    /**
     * Returns the first element in an enumerable, or `null`, if enumerable is empty.
     * @returns The first element, or `null`, if enumerable is empty.
     */
    public tryFirst():
        Nullable<T>
    {
        return Iteration.TryFirst(this._iterable);
    }

    /**
     * Returns the last element in an enumerable.
     * @throws An `Error`, if the enumerable is empty.
     * @returns The last element.
     */
    public last():
        T
    {
        return Iteration.Last(this._iterable);
    }

    /**
     * Returns the last element in an enumerable, or `null`, if enumerable is empty.
     * @returns The last element, or `null`, if enumerable is empty.
     */
    public tryLast():
        Nullable<T>
    {
        return Iteration.TryLast(this._iterable);
    }

    /**
     * Returns the element at the specified position in an enumerable.
     * @param index Element position.
     * @throws An `Error`, if the enumerable doesn't contain enough elements, or if `index` is negative.
     * @returns The element at the specified position.
     */
    public at(
        index: number):
        T
    {
        return Iteration.At(this._iterable, index);
    }

    /**
     * Returns the element at the specified position in an enumerable, or `null`, if position is negative,
     * or if enumerable doesn't contain enough elements.
     * @param index Element position.
     * @returns The element at the specified position, or `null`, if position is negative,
     * or if enumerable doesn't contain enough elements.
     */
    public tryAt(
        index: number):
        Nullable<T>
    {
        return Iteration.TryAt(this._iterable, index);
    }

    /**
     * Returns the only element in an enumerable.
     * @throws An `Error`, if the enumerable doesn't contain exactly one element.
     * @returns The only element.
     */
    public single():
        T
    {
        return Iteration.Single(this._iterable);
    }

    /**
     * Returns the only element in an enumerable, or `null`, if enumerable doesn't contain exactly one element.
     * @returns The only element, or `null`, if enumerable doesn't contain exactly one element.
     */
    public trySingle():
        Nullable<T>
    {
        return Iteration.TrySingle(this._iterable);
    }

    /**
     * Materializes an enumerable immediately.
     * @returns Materialized enumerable.
     */
    public materialize():
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Materialize(this._iterable));
    }

    /**
     * Memoizes an enumerable.
     * @returns Memoized enumerable.
     */
    public memoize():
        Enumerable<T>
    {
        return new Enumerable<T>(
            Iteration.Memoize(this._iterable));
    }

    /**
     * Creates a new array from an enumerable.
     * @returns An array with elements from the enumerable.
     */
    public toArray():
        T[]
    {
        return Iteration.ToArray(this._iterable);
    }

    /**
     * Creates a new linked list from an enumerable.
     * @returns A linked list with elements from the enumerable.
     */
    public toList():
        List<T>
    {
        return Iteration.ToList(this._iterable);
    }

    /**
     * Creates a new set from an enumerable.
     * @param objectStringifier An optional, custom object stringifier, used for object equality comparison.
     * @returns A set with elements from the enumerable.
     */
    public toSet(
        objectStringifier?: Stringifier<T>):
        UnorderedSet<T>
    {
        return Iteration.ToSet(this._iterable, objectStringifier);
    }

    /**
     * Creates a new map from an enumerable.
     * @param keySelector Element key selector.
     * @param valueSelector Element value selector.
     * @param keyStringifier An optional, custom key stringifier, used for key equality comparison.
     * @returns A map with elements from the enumerable.
     */
    public toMap<TKey, TValue>(
        keySelector: KeySelector<TKey, T>,
        valueSelector: (obj: T) => TValue,
        keyStringifier?: Stringifier<TKey>):
        UnorderedMap<TKey, TValue>
    {
        return Iteration.ToMap(this._iterable, keySelector, valueSelector, keyStringifier);
    }

    /**
     * Executes a callback for each enumerable element.
     * @param callback A function to execute for each element.
     */
    public forEach(
        callback: (obj: T, index: number) => void):
        void
    {
        Iteration.ForEach(this._iterable, callback);
    }

    /**
     * Reduces an enumerable to a single object via the provided algorithm.
     * @param callback A function called for each enumerable element, specifying how to reduce the collection.
     * @param seed A value to start the reduction with.
     * @returns Reduction result.
     */
    public reduce<TResult>(
        callback: (prev: TResult, current: T, index: number) => TResult,
        seed: TResult):
        TResult
    {
        return Iteration.Reduce(this._iterable, callback, seed);
    }

    /**
     * Checks whether or not an enumerable contains duplicate elements.
     * @param objectStringifier An optional, custom object stringifier, used for object equality comparison.
     * @returns `true`, if the enumerable contains duplicates, otherwise `false`.
     */
    public hasDuplicates(
        objectStringifier?: Stringifier<T>):
        boolean
    {
        return Iteration.HasDuplicates(this._iterable, objectStringifier);
    }

    /**
     * Returns an underlying iterable.
     * @returns An underlying iterable.
     */
    public getUnderlyingIterable():
        Iterable<T>
    {
        return this._iterable;
    }

    public* [Symbol.iterator](): IterableIterator<T>
    {
        yield* this._iterable;
    }
}
