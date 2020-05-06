import { DeepReadonly } from '../types/deep-readonly';

export type KeySelector<TKey, TValue> = (value: DeepReadonly<TValue>) => DeepReadonly<TKey>;
