import { isInstanceOfType } from './functions/instance-of-cast';
import { reinterpretCast } from './functions';
import { EmptyObject } from './types';

/**
 * Creates a new object that contains members from both `a` and `b`.
 * @param a First object to mix.
 * @param b Second object to mix.
 * @returns New object created from `a` and `b`.
 */
export function makeMixin<T extends EmptyObject, U extends EmptyObject>(a: T, b: U): T & U
{
    return { ...reinterpretCast<any>(a), ...reinterpretCast<any>(b) };
}

/** Represents a mixin object. */
export class Mixin<T extends EmptyObject>
{
    /** Mixin's value. */
    public readonly value: T;

    /**
     * Creates a new mixin object.
     * @param value Mixin's value.
     */
    public constructor(value: T)
    {
        this.value = value;
    }

    /**
     * Creates a new mixin object that combines `this` and `other` mixin's values.
     * @param other Mixin to combine with.
     * @returns New mixin object that combines `this.value` and `other.value` together.
     */
    public and<U extends EmptyObject>(other: Mixin<U> | U): Mixin<T & U>
    {
        return new Mixin(makeMixin(this.value, isInstanceOfType(Mixin, other) ? other.value : other));
    }
}
