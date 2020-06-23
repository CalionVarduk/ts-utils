import { None } from './none';

/** Ensured type alias. */
export type Ensured<T> = Exclude<T, None>;
