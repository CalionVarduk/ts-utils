import { MessageBroker } from '../../src/events/message-broker';
import { EventDelegate, IEvent } from '../../src/events/event.interface';
import { Nullable } from '../../src/types';

test('ctor should create properly',
    () =>
    {
        const result = new MessageBroker();
        expect(result.isDisposed).toBe(false);
        expect([...result.messageNames()].length).toBe(0);
    }
);

test('dispose should remove all listeners',
    () =>
    {
        const broker = new MessageBroker();
        const listener = broker.listen('m', () => {});

        broker.dispose();

        expect([...broker.messageNames()].length).toBe(0);
        expect(broker.isDisposed).toBe(true);
        expect(listener.isDisposed).toBe(true);
    }
);

test('dispose invoked more than once should not throw',
    () =>
    {
        const broker = new MessageBroker();

        broker.dispose();
        const action = () => broker.dispose();

        expect(action).not.toThrow();
        expect([...broker.messageNames()].length).toBe(0);
        expect(broker.isDisposed).toBe(true);
    }
);

test('createHandler should create a new handler',
    () =>
    {
        const messageName = 'm';
        const broker = new MessageBroker();

        broker.createHandler(messageName);

        expect([...broker.messageNames()]).toEqual([messageName]);
    }
);

test('createHandler should throw if handler already exists',
    () =>
    {
        const messageName = 'm';
        const broker = new MessageBroker();
        broker.createHandler(messageName);

        const action = () => broker.createHandler(messageName);

        expect(action).toThrow();
    }
);

test('createHandler should throw if handler is disposed',
    () =>
    {
        const broker = new MessageBroker();
        broker.dispose();

        const action = () => broker.createHandler('m');

        expect(action).toThrow();
    }
);

test('deleteHandler should remove and dispose an existing handler',
    () =>
    {
        const messageName = 'm';
        const broker = new MessageBroker();

        broker.createHandler(messageName);
        const handler = broker.getHandler(messageName);

        broker.deleteHandler(messageName);

        expect([...broker.messageNames()].length).toBe(0);
        expect(handler!.isDisposed).toBe(true);
    }
);

test('deleteHandler should not throw when handler doesn\'t exist',
    () =>
    {
        const broker = new MessageBroker();

        const action = () => broker.deleteHandler('m');

        expect(action).not.toThrow();
    }
);

test('getHandler should return null, when handler doesn\'t exist',
    () =>
    {
        const broker = new MessageBroker();

        const result = broker.getHandler('m');

        expect(result).toBeNull();
    }
);

test('getHandler should return handler, when it exists',
    () =>
    {
        const messageName = 'm';
        const broker = new MessageBroker();
        broker.createHandler(messageName);

        const result = broker.getHandler(messageName);

        expect(result).not.toBeNull();
    }
);

test('hasHandler should return false, when handler doesn\'t exist',
    () =>
    {
        const broker = new MessageBroker();

        const result = broker.hasHandler('m');

        expect(result).toBe(false);
    }
);

test('hasHandler should return true, when it exists',
    () =>
    {
        const messageName = 'm';
        const broker = new MessageBroker();
        broker.createHandler(messageName);

        const result = broker.hasHandler(messageName);

        expect(result).toBe(true);
    }
);

test('listen should register a new listener',
    () =>
    {
        const messageName = 'm';
        const delegate: EventDelegate = () => {};
        const broker = new MessageBroker();
        broker.createHandler(messageName);

        const result = broker.listen(messageName, delegate);

        expect(result.isDisposed).toBe(false);
        expect(result.delegate).toBe(delegate);
        expect([...broker.messageNames()]).toEqual([messageName]);
    }
);

test('listen should register a new listener and handler, if it doesn\'t exist',
    () =>
    {
        const messageName = 'm';
        const delegate: EventDelegate = () => {};
        const broker = new MessageBroker();

        const result = broker.listen(messageName, delegate);

        expect(result.isDisposed).toBe(false);
        expect(result.delegate).toBe(delegate);
        expect([...broker.messageNames()]).toEqual([messageName]);
    }
);

test('listen should throw when invoked on disposed event handler',
    () =>
    {
        const broker = new MessageBroker();
        broker.dispose();

        const action = () => broker.listen('m', () => {});

        expect(action).toThrow();
    }
);

test('publish should invoke listeners correctly',
    () =>
    {
        const messageName = 'm';
        const otherMessageName = 'o';
        const args = 'foo';
        const sender = {};

        let interceptedSender: Nullable<any> = null;
        let interceptedArgs: Nullable<string> = null;
        let interceptedEvent: Nullable<IEvent<string>> = null;
        let otherInvoked = false;

        const broker = new MessageBroker();

        broker.listen(messageName, (s, a, e) =>
        {
            interceptedSender = s;
            interceptedArgs = a!;
            interceptedEvent = e;
        });
        const handler = broker.getHandler(messageName);

        broker.listen(otherMessageName, () => otherInvoked = true);

        broker.publish(messageName, sender, args);

        expect(interceptedSender).toBe(sender);
        expect(interceptedArgs).toBe(args);
        expect(interceptedEvent).toBe(handler);
        expect(otherInvoked).toBe(false);
    }
);

test('publish should not throw if handler doesn\'t exist',
    () =>
    {
        const broker = new MessageBroker();
        const action = () => broker.publish('m');
        expect(action).not.toThrow();
    }
);

test('messageNames should return correct collection',
    () =>
    {
        const messageNames = ['a', 'b', 'c'];
        const broker = new MessageBroker();

        messageNames.forEach(n => broker.createHandler(n));

        expect([...broker.messageNames()]).toMatchObject(messageNames);
    }
);
