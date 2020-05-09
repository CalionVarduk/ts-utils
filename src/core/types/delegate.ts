/** Delegate type alias. */
export type Delegate<TArgs extends any[], TReturnType = void> =
    (...arg: TArgs) => TReturnType;
