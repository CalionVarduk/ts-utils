import { DeepReadonly } from '../types/deep-readonly';

/** Key selector type alias. */
export type KeySelector<TKey, TValue> = (value: DeepReadonly<TValue>) => DeepReadonly<TKey>;
