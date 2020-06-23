import { EventHandler } from '../../src/events/event-handler';
import { filter } from '../../src/events/operators/filter';
import { IEvent } from '../../src/events/event.interface';
import { Iteration } from '../../src/collections/iteration';

test('filter operator should filter out published events correctly',
    () =>
    {
        const args = ['foo', 'bar', 'baz'];
        const senders = [{}, 0, ''];

        const interceptedFilterData: { sender: any; args: any; event: IEvent }[] = [];
        const interceptedData: { sender: any; args: any; event: IEvent }[] = [];

        const handler = new EventHandler();

        handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e }))
            .decorate(filter((s, a, e) =>
            {
                interceptedFilterData.push({ sender: s, args: a, event: e });
                return a !== args[1];
            }));

        for (const data of Iteration.Zip(senders, args))
            handler.publish(data.first, data.second);

        expect(interceptedFilterData.length).toBe(args.length);
        for (let i = 0; i < interceptedFilterData.length; ++i)
        {
            expect(interceptedFilterData[i].sender).toBe(senders[i]);
            expect(interceptedFilterData[i].args).toBe(args[i]);
            expect(interceptedFilterData[i].event).toBe(handler);
        }

        expect(interceptedData.length).toBe(args.length - 1);
        expect(interceptedData[0].sender).toBe(senders[0]);
        expect(interceptedData[0].args).toBe(args[0]);
        expect(interceptedData[0].event).toBe(handler);
        expect(interceptedData[1].sender).toBe(senders[2]);
        expect(interceptedData[1].args).toBe(args[2]);
        expect(interceptedData[1].event).toBe(handler);
    }
);
