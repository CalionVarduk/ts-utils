import { EventListenerOperator } from '../event.interface';

/**
 * Creates an event listener operator, that delays event handling by the specified amount of time (in milliseconds).
 * @param ms Amount of time to delay event handling (in milliseconds).
 * @returns An event listener operator.
 */
export function delay<TArgs>(ms: number): EventListenerOperator<TArgs>
{
    return next =>
    {
        if (ms < 0)
            return null;

        return (s, a, e) =>
            setTimeout(() => next(s, a, e), ms);
    };
}
