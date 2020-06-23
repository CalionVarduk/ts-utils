import { IReadonlyUnorderedSet } from './readonly-unordered-set.interface';
import { DeepReadonly, toDeepReadonly } from '../types/deep-readonly';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Assert } from '../functions/assert';
import { Stringifier } from '../types/stringifier';

/** Represents a set data structure. */
export class UnorderedSet<T>
    implements
    IReadonlyUnorderedSet<T>
{
    public get length(): number
    {
        return this._map.size;
    }

    public get isEmpty(): boolean
    {
        return this.length === 0;
    }

    public readonly stringifier: Stringifier<T>;

    private readonly _map: Map<string, T>;

    /**
     * Creates a new UnorderedSet object.
     * @param stringifier An optional, custom stringifier used for object comparison.
     */
    public constructor(
        stringifier: Stringifier<T> = o => reinterpretCast<object>(o).toString())
    {
        this.stringifier = Assert.IsDefined(stringifier, 'stringifier');
        this._map = new Map<string, T>();
    }

    public has(obj: DeepReadonly<T>): boolean
    {
        const stringified = this.stringifier(obj);
        return this._map.has(stringified);
    }

    /**
     * Adds a new element to the set.
     * @param obj Element to add.
     * @throws An `Error`, if the element already exists.
     */
    public add(obj: T): void
    {
        const stringified = this.stringifier(toDeepReadonly(obj));

        if (this._map.has(stringified))
            throw new Error(`unordered set already contains object ${JSON.stringify(obj)} [${stringified}].`);

        this._map.set(stringified, obj);
    }

    /**
     * Adds a new element to the set.
     * @param obj Element to add.
     * @returns `true`, if the element has been added successfully, or `false`, if it already exists.
     */
    public tryAdd(obj: T): boolean
    {
        const stringified = this.stringifier(toDeepReadonly(obj));

        if (this._map.has(stringified))
            return false;

        this._map.set(stringified, obj);
        return true;
    }

    /**
     * Removes an element from the set.
     * @param obj Element to remove.
     * @throws An `Error`, if the element doesn't exist.
     */
    public delete(obj: DeepReadonly<T>): void
    {
        const stringified = this.stringifier(obj);

        if (!this._map.delete(stringified))
            throw new Error(`unordered set doesn't contain object ${JSON.stringify(obj)} [${stringified}].`);
    }

    /**
     * Removes an element from the set.
     * @param obj Element to remove.
     * @returns `true`, if the element has been removed successfully, or `false`, if it doesn't exist.
     */
    public tryDelete(obj: DeepReadonly<T>): boolean
    {
        const stringified = this.stringifier(obj);
        return this._map.delete(stringified);
    }

    /**
     * Removes all elements from the set.
     */
    public clear(): void
    {
        this._map.clear();
    }

    public [Symbol.iterator](): IterableIterator<T>
    {
        return this._map.values();
    }
}
