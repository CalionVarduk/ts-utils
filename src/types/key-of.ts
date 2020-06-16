import { None } from './none';

/**
 * KeyOfType type alias.
 * Represents names of `TType` members that are of `TPropertyType` type.
 */
export type KeyOfType<TType, TPropertyType> =
{
    [K in keyof TType]:
        TType[K] extends TPropertyType ? K
        : never
}[keyof TType];

/**
 * MethodKeyOf type alias.
 * Represents names of `TType` members that are of `Function` type.
 */
export type MethodKeyOf<TType> = KeyOfType<TType, Function>;

/**
 * PropertyKeyOf type alias.
 * Represents names of `TType` members that are not of `Function` type.
 */
export type PropertyKeyOf<TType> = Exclude<keyof TType, MethodKeyOf<TType>>;

/**
 * RequiredKeyOf type alias.
 * Represents names of `TType` members that are not nullable and not undefinable.
 */
export type RequiredKeyOf<TType> =
{
    [K in keyof TType]-?:
        Extract<TType[K], None> extends never ? K
        : never
}[keyof TType];

/**
 * OptionalKeyOf type alias.
 * Represents names of `TType` members that are nullable and/or undefinable.
 */
export type OptionalKeyOf<TType> = Exclude<keyof TType, RequiredKeyOf<TType>>;

/**
 * RequiredKeyOfType type alias.
 * Represents names of `TType` members that are not nullable and not undefinable, and that are of `TPropertyType` type.
 */
export type RequiredKeyOfType<TType, TPropertyType> =
{
    [K in RequiredKeyOf<TType>]:
        TType[K] extends TPropertyType ? K
        : never
}[RequiredKeyOf<TType>];

/**
 * OptionalKeyOfType type alias.
 * Represents names of `TType` members that are nullable and/or undefinable, and that are of `TPropertyType` type.
 */
export type OptionalKeyOfType<TType, TPropertyType> =
{
    [K in OptionalKeyOf<TType>]:
        Exclude<TType[K], None> extends TPropertyType ? K
        : never
}[OptionalKeyOf<TType>];
