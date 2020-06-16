import { IMapper } from './mapper.interface';

/** Represents a mapping function. */
export type Mapping<TSource, TDestination> = (source: TSource, mapper: IMapper) => TDestination;
