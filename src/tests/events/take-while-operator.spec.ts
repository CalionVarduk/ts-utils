import { EventHandler } from '../../core/events/event-handler';
import { takeWhile } from '../../core/events/operators/take-while';
import { IEvent } from '../../core/events/event.interface';
import { Iteration } from '../../core/collections/iteration';
import each from 'jest-each';

each([
    [['foo'], 1],
    [['foo', 'bar'], 2],
    [['foo', 'bar', 'baz'], 3],
    [[''], 0]
])
.test('takeWhile operator should take first published events correctly (%#): take while args: %o, expected take count: %f',
    (takeWhileArgs: string[], expectedTakeCount: number) =>
    {
        const args = ['foo', 'bar', 'baz'];
        const senders = [{}, 0, ''];

        const interceptedFilterData: { sender: any; args: any; event: IEvent }[] = [];
        const interceptedData: { sender: any; args: any; event: IEvent }[] = [];

        const handler = new EventHandler();

        handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e }))
            .decorate(takeWhile((s, a, e) =>
            {
                interceptedFilterData.push({ sender: s, args: a, event: e });
                return takeWhileArgs.some(arg => arg === a);
            }));

        for (const data of Iteration.Zip(senders, args))
            handler.publish(data.first, data.second);

        expect(interceptedFilterData.length).toBe(Math.min(args.length, expectedTakeCount + 1));
        for (let i = 0; i < interceptedFilterData.length; ++i)
        {
            expect(interceptedFilterData[i].sender).toBe(senders[i]);
            expect(interceptedFilterData[i].args).toBe(args[i]);
            expect(interceptedFilterData[i].event).toBe(handler);
        }

        expect(interceptedData.length).toBe(expectedTakeCount);
        for (let i = 0; i < expectedTakeCount; ++i)
        {
            expect(interceptedData[i].sender).toBe(senders[i]);
            expect(interceptedData[i].args).toBe(args[i]);
            expect(interceptedData[i].event).toBe(handler);
        }
    }
);
