/** Delegate type alias. */
export type Delegate<TArgs extends any[], TReturnType = void> =
    (...arg: TArgs) => TReturnType;

/** ExtractDelegate type alias. */
export type ExtractDelegate<T> =
    T extends (...args: infer A) => infer R ? Delegate<A, R> : never;
