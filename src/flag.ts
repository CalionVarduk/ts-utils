/** Represents an easily switchable flag-like value. */
export class Flag<T = boolean>
{
    /** Returns the current value. */
    public get value(): T
    {
        return this._value;
    }

    private _value: T;

    /**
     * Creates a new flag object.
     * @param value Flag value to start with.
     */
    public constructor(value: T)
    {
        this._value = value;
    }

    /**
     * Replaces the current value with the new value, and returns the old value.
     * @param value New flag value.
     * @returns Old value.
     */
    public exchange(value: T): T
    {
        const previous = this._value;
        this.update(value);
        return previous;
    }

    /**
     * Changes the current value.
     * @param value New flag value.
     */
    public update(value: T): void
    {
        this._value = value;
    }
}
