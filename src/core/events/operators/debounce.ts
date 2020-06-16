import { EventListenerOperator } from '../event.interface';
import { Nullable } from '../../types';
import { isNull } from '../../functions';

/**
 * Creates an event listener operator, that allows to debounce event handling by the specified amount of time (in milliseconds).
 * @param ms Amount of time to debounce event handling (in milliseconds).
 * @returns An event listener operator.
 */
export function debounce<TArgs>(ms: number): EventListenerOperator<TArgs>
{
    return next =>
    {
        if (ms < 0)
            return null;

        let timeoutHandle: Nullable<number> = null;
        return (s, a, e) =>
            {
                if (!isNull(timeoutHandle))
                    clearTimeout(timeoutHandle);

                timeoutHandle = setTimeout(() =>
                    {
                        timeoutHandle = null;
                        next(s, a, e);
                    },
                    ms);
            };
    };
}
