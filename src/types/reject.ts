/** Reject type alias. */
export type Reject<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
