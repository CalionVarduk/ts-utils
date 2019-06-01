/**
 * Forces the object to be treated as an instance of the provided type.
 * @param source object to cast
 * @returns `source` cast to `T` type
 * */
export function reinterpretCast<T>(source: any): T {
    return source as T;
}
