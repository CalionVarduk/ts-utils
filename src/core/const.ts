/** Const type alias. */
export type Const<T> = {
    readonly [P in keyof T]:
        T[P] extends Function ? T[P] :
        T[P] extends ReadonlyArray<infer R> ? IConstArray<R> :
        T[P] extends ReadonlyMap<infer K, infer V> ? IConstMap<K, V> :
        T[P] extends ReadonlySet<infer S> ? IConstSet<S> :
        T[P] extends object ? Const<T[P]> :
        T[P];
};

/** Const array interface. */
export interface IConstArray<T> extends ReadonlyArray<Const<T>> {}
/** Const map interface. */
export interface IConstMap<K, V> extends ReadonlyMap<Const<K>, Const<V>> {}
/** Const set interface. */
export interface IConstSet<T> extends ReadonlySet<Const<T>> {}
