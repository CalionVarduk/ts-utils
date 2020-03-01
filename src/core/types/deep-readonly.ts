/** Deep readonly type alias. */
export type DeepReadonly<T> =
{
    readonly [P in keyof T]:
        T[P] extends Function ? T[P] :
        T[P] extends ReadonlyArray<infer R> ? IDeepReadonlyArray<R> :
        T[P] extends ReadonlyMap<infer K, infer V> ? IDeepReadonlyMap<K, V> :
        T[P] extends ReadonlySet<infer S> ? IDeepReadonlySet<S> :
        T[P] extends object ? DeepReadonly<T[P]> :
        T[P];
};

/** Deep readonly array interface. */
export interface IDeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

/** Deep readonly map interface. */
export interface IDeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {}

/** Deep readonly set interface. */
export interface IDeepReadonlySet<T> extends ReadonlySet<DeepReadonly<T>> {}
