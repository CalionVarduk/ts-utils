export type Pair<T, U> =
{
    first: T;
    second: U;
};

export function makePair<T, U>(first: T, second: U): Pair<T, U>
{
    return {
        first: first,
        second: second
    };
}
