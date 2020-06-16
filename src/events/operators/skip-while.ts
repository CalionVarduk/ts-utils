import { IEvent, EventListenerOperator } from '../event.interface';
import { Undefinable } from '../../types/undefinable';

/**
 * Creates an event listener operator, that filters out published events, until an event that fails the predicate is encountered.
 * @param predicate Event filtering predicate.
 * @returns An event listener operator.
 */
export function skipWhile<TArgs>(
    predicate: (sender: any, args: Undefinable<TArgs>, event: IEvent<TArgs>) => boolean):
    EventListenerOperator<TArgs>
{
    return next =>
    {
        let done = false;
        return (s, a, e) =>
            {
                if (done)
                    next(s, a, e);
                else if (!predicate(s, a, e))
                {
                    done = true;
                    next(s, a, e);
                }
            };
    };
}
