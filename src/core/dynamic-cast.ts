/**
 * Casts an object to the provided type, if that object is an `instanceof` that type.
 * @param targetType type constructor to cast to
 * @param source object to cast
 * @returns if type `T` exists in the prototype chain of `source`, then `source` cast to `T`, otherwise `null`
 * */
export function dynamicCast<T>(targetType: new (...args: any[]) => T, source: any): T | null {
    return source instanceof targetType ? source : null;
}
