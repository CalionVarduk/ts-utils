import { Nullable } from './nullable';
import { Undefinable } from './undefinable';

/** Optional type alias. */
export type Optional<T> = Nullable<T> | Undefinable<T>;
