import { EventListenerOperator } from '../event.interface';

/**
 * Creates an event listener operator, that specifies how many times a published event should be intercepted
 * before an event listener is automatically disposed.
 * @param count Amount of events to intercept.
 * @returns An event listener operator.
 */
export function take<TArgs>(count: number): EventListenerOperator<TArgs>
{
    return (next, listener) =>
    {
        if (count < 1)
        {
            listener.dispose();
            return null;
        }
        let taken = 0;
        return (s, a, e) =>
            {
                next(s, a, e);
                if (++taken >= count)
                    listener.dispose();
            };
    };
}
