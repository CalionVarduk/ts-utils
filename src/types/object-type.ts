/** Object type type alias. */
export type ObjectType<T = any> = new (...args: any[]) => T;

/** Abstract object type type alias. */
export type AbstractObjectType<T = any> = Function & { prototype: T };
