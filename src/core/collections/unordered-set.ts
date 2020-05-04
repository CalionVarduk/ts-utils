import { IReadonlyUnorderedSet } from './readonly-unordered-set.interface';
import { DeepReadonly, toDeepReadonly } from '../types/deep-readonly';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Ensured } from '../types/ensured';
import { Assert } from '../functions/assert';
import { Stringifier } from './stringifier';

function stringifyObject<T>(
    obj: DeepReadonly<T>,
    stringifier: Stringifier<T>): string
{
    return stringifier(
        reinterpretCast<Ensured<DeepReadonly<T>>>(
            Assert.IsDefined(obj, 'obj')));
}

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

    public constructor(
        stringifier: Stringifier<T> = o => reinterpretCast<any>(o).toString())
    {
        this.stringifier = Assert.IsDefined(stringifier, 'stringifier');
        this._map = new Map<string, T>();
    }

    public has(obj: DeepReadonly<T>): boolean
    {
        const stringifiedObject = stringifyObject(obj, this.stringifier);
        return this._map.has(stringifiedObject);
    }

    public add(obj: T): void
    {
        const stringifiedObject = stringifyObject(toDeepReadonly(obj), this.stringifier);

        if (this._map.has(stringifiedObject))
            throw new Error(`unordered set already contains object ${JSON.stringify(obj)} [${stringifiedObject}].`);

        this._map.set(stringifiedObject, obj);
    }

    public tryAdd(obj: T): boolean
    {
        const stringifiedObject = stringifyObject(toDeepReadonly(obj), this.stringifier);

        if (this._map.has(stringifiedObject))
            return false;

        this._map.set(stringifiedObject, obj);
        return true;
    }

    public delete(obj: DeepReadonly<T>): void
    {
        const stringifiedObject = stringifyObject(obj, this.stringifier);

        if (!this._map.delete(stringifiedObject))
            throw new Error(`unordered set doesn't contain object ${JSON.stringify(obj)} [${stringifiedObject}].`);
    }

    public tryDelete(obj: DeepReadonly<T>): boolean
    {
        const stringifiedObject = stringifyObject(obj, this.stringifier);
        return this._map.delete(stringifiedObject);
    }

    public clear(): void
    {
        this._map.clear();
    }

    public entries(): Iterable<T>
    {
        return this._map.values();
    }

    public [Symbol.iterator](): IterableIterator<T>
    {
        return this._map.values();
    }
}
