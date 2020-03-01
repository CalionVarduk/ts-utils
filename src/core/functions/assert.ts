import { Nullable } from '../types/nullable';
import { isNull } from './is-null';
import { Undefinable } from '../types/undefinable';
import { isUndefined } from './is-undefined';
import { Optional } from '../types/optional';
import { isDefined } from './is-defined';
import { isPrimitiveOfType } from './primitive-cast';
import { None } from '../types/none';

function buildParamError(base: string, paramName: Undefinable<string>): string
{
    return `${isUndefined(paramName) ? 'parameter' : `\'${paramName}\'`} ${base}`;
}

function buildCustomError(base: string, message: Undefinable<string | (() => string)>): string
{
    return isUndefined(message) ? base : isPrimitiveOfType('function', message) ? message() : message;
}

/** Contains assertion functions that either pass or throw an error. */
export namespace Assert
{
    /**
     * Asserts whether or not the `obj` is not `null` and not `undefined`, and returns it.
     * @param obj object to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `obj` is `null` or `undefined`
     * @returns defined `obj`
     */
    export function IsDefined<T>(obj: Optional<T>, paramName?: string): T
    {
        if (!isDefined(obj))
            throw new Error(buildParamError('must not be null or undefined', paramName));

        return obj;
    }

    /**
     * Asserts whether or not the `obj` is `null` or `undefined`, and returns it.
     * @param obj object to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `obj` is not `null` and not `undefined`
     * @returns `null` or `undefined`
     */
    export function IsNullOrUndefined<T>(obj: Optional<T>, paramName?: string): None
    {
        if (isDefined(obj))
            throw new Error(buildParamError('must be null or undefined', paramName));

        return obj;
    }

    /**
     * Asserts whether or not the `obj` is not `null`, and returns it.
     * @param obj object to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `obj` is `null`
     * @returns non-`null` `obj`
     */
    export function IsNotNull<T>(obj: Nullable<T>, paramName?: string): T
    {
        if (isNull(obj))
            throw new Error(buildParamError('must not be null', paramName));

        return obj;
    }

    /**
     * Asserts whether or not the `obj` is `null`, and returns it.
     * @param obj object to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `obj` is not `null`
     * @returns `null`
     */
    export function IsNull<T>(obj: Nullable<T>, paramName?: string): null
    {
        if (!isNull(obj))
            throw new Error(buildParamError('must be null', paramName));

        return obj;
    }

    /**
     * Asserts whether or not the `obj` is not `undefined`, and returns it.
     * @param obj object to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `obj` is `undefined`
     * @returns non-`undefined` `obj`
     */
    export function IsNotUndefined<T>(obj: Undefinable<T>, paramName?: string): T
    {
        if (isUndefined(obj))
            throw new Error(buildParamError('must not be undefined', paramName));

        return obj;
    }

    /**
     * Asserts whether or not the `obj` is `undefined`, and returns it.
     * @param obj object to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `obj` is not `undefined`
     * @returns `undefined`
     */
    export function IsUndefined<T>(obj: Undefinable<T>, paramName?: string): undefined
    {
        if (!isUndefined(obj))
            throw new Error(buildParamError('must be undefined', paramName));

        return obj;
    }

    /**
     * Asserts whether or not the `collection` is empty, and returns it.
     * @param collection collection to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `collection` is not empty
     * @returns empty `collection`
     */
    export function IsEmpty<T extends { length: number }>(collection: T, paramName?: string): T
    {
        if (collection.length > 0)
            throw new Error(buildParamError('must be empty', paramName));

        return collection;
    }

    /**
     * Asserts whether or not the `collection` is not empty, and returns it.
     * @param collection collection to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `collection` is empty
     * @returns non-empty `collection`
     */
    export function IsNotEmpty<T extends { length: number }>(collection: T, paramName?: string): T
    {
        if (collection.length === 0)
            throw new Error(buildParamError('must not be empty', paramName));

        return collection;
    }

    /**
     * Asserts whether or not the `collection` contains defined elements only, and returns it.
     * @param collection collection to check
     * @param paramName parameter name to be included in the error message
     * @throws `Error` when `collection` contains at least one `null` or `undefined` element
     * @returns `collection` without any `null` or `undefined` elements
     */
    export function ContainsDefinedOnly<T extends { forEach(c: (o: any) => void): void }>(collection: T, paramName?: string): T
    {
        collection.forEach(o =>
        {
            if (!isDefined(o))
                throw new Error(buildParamError('must not contain any null or undefined elements', paramName));
        });
        return collection;
    }

    /**
     * Asserts that the provided `condition` evaluates to `true`.
     * @param condition condition to check
     * @param message an error message, or an error message provider function
     * @throws `Error` when `condition` evaluates to `false`
     */
    export function True(condition: boolean, message?: string | (() => string)): void
    {
        if (!condition)
            throw new Error(buildCustomError('condition must be met', message));
    }

    /**
     * Asserts that the provided `condition` evaluates to `false`.
     * @param condition condition to check
     * @param message an error message, or an error message provider function
     * @throws `Error` when `condition` evaluates to `true`
     */
    export function False(condition: boolean, message?: string | (() => string)): void
    {
        if (condition)
            throw new Error(buildCustomError('condition must not be met', message));
    }
}
