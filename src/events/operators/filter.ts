import { IEvent, EventListenerOperator } from '../event.interface';
import { Undefinable } from '../../types/undefinable';

/**
 * Creates an event listener operator, that filters out published events, before an event listener intercepts them.
 * @param predicate Event filtering predicate.
 * @returns An event listener operator.
 */
export function filter<TArgs>(
    predicate: (sender: any, args: Undefinable<TArgs>, event: IEvent<TArgs>) => boolean):
    EventListenerOperator<TArgs>
{
    return next =>
    {
        return (s, a, e) =>
            {
                if (predicate(s, a, e))
                    next(s, a, e);
            };
    };
}
