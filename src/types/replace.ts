/** Replace type alias. */
export type Replace<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
