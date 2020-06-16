import { TaskCancellationError } from '../../src/tasks/task-cancellation-error';

test('ctor should create properly',
    () =>
    {
        const result = new TaskCancellationError();
        expect(result.message).not.toMatch(/.*reason:.*/g);
    }
);

test('ctor should create properly, with reason',
    () =>
    {
        const reason = 'foo';
        const result = new TaskCancellationError(reason);
        expect(result.message).toMatch(/.*reason:.*/g);
        expect(result.message).toMatch(new RegExp(`.*${reason}.*`, 'g'));
    }
);
