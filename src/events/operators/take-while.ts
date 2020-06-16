import { IEvent, EventListenerOperator } from '../event.interface';
import { Undefinable } from '../../types/undefinable';

/**
 * Creates an event listener operator, that intercepts all published events, until an event that fails the predicate is encountered.
 * An event listener is then automatically disposed.
 * @param predicate Event filtering predicate.
 * @returns An event listener operator.
 */
export function takeWhile<TArgs>(
    predicate: (sender: any, args: Undefinable<TArgs>, event: IEvent<TArgs>) => boolean):
    EventListenerOperator<TArgs>
{
    return (next, listener) =>
    {
        return (s, a, e) =>
            {
                if (predicate(s, a, e))
                    next(s, a, e);
                else
                    listener.dispose();
            };
    };
}
