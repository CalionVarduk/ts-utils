import { DeepReadonly } from '../types/deep-readonly';
import { Ensured } from '../types/ensured';

export type KeySelector<TKey, TValue> = (value: Ensured<DeepReadonly<TValue>>) => DeepReadonly<TKey>;
