import { TaskDiscontinuationError } from '../../core/tasks/task-discontinuation-error';
import { TaskState } from '../../core/tasks/task-state.enum';
import { TaskResult } from '../../core/tasks/task-result';
import each from 'jest-each';

each([
    [TaskState.Created],
    [TaskState.Running],
    [TaskState.Completed],
    [TaskState.Faulted],
    [TaskState.Cancelled],
    [TaskState.Discontinued]
])
.test('ctor should create properly (%#): state: %f',
    (state: TaskState) =>
    {
        const parentResult: TaskResult = {
            state: state
        };
        const result = new TaskDiscontinuationError(parentResult);
        expect(result.parentResult).toBe(parentResult);
        expect(result.message).toMatch(new RegExp(`.*${TaskState[state]}.*`, 'g'));
    }
);
