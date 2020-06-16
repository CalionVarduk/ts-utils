import { EventListenerOperator } from '../event.interface';

/**
 * Creates an event listener operator, that specifies how many times a published event should be skipped
 * before an event listener starts to intercept them again.
 * @param count Amount of events to skip.
 * @returns An event listener operator.
 */
export function skip<TArgs>(count: number): EventListenerOperator<TArgs>
{
    return next =>
    {
        if (count < 1)
            return null;

        let skipped = 0;
        return (s, a, e) =>
            {
                if (skipped < count)
                    ++skipped;
                else
                    next(s, a, e);
            };
    };
}
