/**
 * Forces the object to be treated as an instance of the provided type.
 * @param obj object to cast
 * @returns `obj` cast to `T` type
 * */
export function reinterpretCast<T>(obj: any): T
{
    return obj as T;
}
