import { Undefinable } from './types/undefinable';

/** Represents a lazily initialized object. */
export class Lazy<T = any>
{
    /** Returns the lazily initialized object. */
    public get value(): T
    {
        if (!this._isValueCreated)
        {
            this._isValueCreated = true;
            this._value = this._provider();
        }
        return this._value!;
    }

    /** Returns whether or not the underlying object has been created. */
    public get isValueCreated(): boolean
    {
        return this._isValueCreated;
    }

    private _isValueCreated: boolean;
    private _value: Undefinable<T>;
    private readonly _provider: () => T;

    /**
     * Creates a new lazy object.
     * @param provider a function that will be used to initialize the object
     */
    public constructor(provider: () => T)
    {
        this._provider = provider;
        this._isValueCreated = false;
        this._value = void(0);
    }
}
