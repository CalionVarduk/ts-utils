import { EventHandler } from '../../core/events/event-handler';
import { skip } from '../../core/events/operators/skip';
import { IEvent } from '../../core/events/event.interface';
import { Iteration } from '../../core/collections/iteration';
import each from 'jest-each';

each([
    [0],
    [1],
    [2],
    [3]
])
.test('skip operator should skip first published events correctly (%#): skip count: %f',
    (skipCount: number) =>
    {
        const args = ['foo', 'bar', 'baz'];
        const senders = [{}, 0, ''];

        const interceptedData: { sender: any; args: any; event: IEvent }[] = [];

        const handler = new EventHandler();

        handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e }))
            .decorate(skip(skipCount));

        for (const data of Iteration.Zip(senders, args))
            handler.publish(data.first, data.second);

        expect(interceptedData.length).toBe(args.length - skipCount);
        for (let i = skipCount; i < args.length; ++i)
        {
            expect(interceptedData[i - skipCount].sender).toBe(senders[i]);
            expect(interceptedData[i - skipCount].args).toBe(args[i]);
            expect(interceptedData[i - skipCount].event).toBe(handler);
        }
    }
);
