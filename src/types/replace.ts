import { Reject } from './reject';

/** Replace type alias. */
export type Replace<T, U> = Reject<T, keyof U> & U;
