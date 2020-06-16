import { EventHandler } from '../../core/events/event-handler';
import { take } from '../../core/events/operators/take';
import { IEvent } from '../../core/events/event.interface';
import { Iteration } from '../../core/collections/iteration';
import each from 'jest-each';

each([
    [0],
    [1],
    [2],
    [3],
    [4]
])
.test('take operator should take first published events correctly (%#): take count: %f',
    (takeCount: number) =>
    {
        const args = ['foo', 'bar', 'baz'];
        const senders = [{}, 0, ''];

        const interceptedData: { sender: any; args: any; event: IEvent }[] = [];

        const handler = new EventHandler();

        const listener = handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e }))
            .decorate(take(takeCount));

        for (const data of Iteration.Zip(senders, args))
            handler.publish(data.first, data.second);

        expect(interceptedData.length).toBe(Math.min(args.length, takeCount));
        for (let i = 0; i < interceptedData.length; ++i)
        {
            expect(interceptedData[i].sender).toBe(senders[i]);
            expect(interceptedData[i].args).toBe(args[i]);
            expect(interceptedData[i].event).toBe(handler);
        }

        if (takeCount <= args.length)
            expect(listener.isDisposed).toBe(true);
    }
);
