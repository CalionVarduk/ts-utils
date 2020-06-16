import { LogMessage } from '../../core/logging/log-message';
import { LogType } from '../../core/logging/log-type.enum';
import each from 'jest-each';

test('Debug should return correct message',
    () =>
    {
        const message = 'foo';
        const result = LogMessage.Debug(message);
        expect(result.message).toBe(message);
        expect(result.type).toBe(LogType.Debug);
    }
);

test('Information should return correct message',
    () =>
    {
        const message = 'foo';
        const result = LogMessage.Information(message);
        expect(result.message).toBe(message);
        expect(result.type).toBe(LogType.Information);
    }
);

test('Warning should return correct message',
    () =>
    {
        const message = 'foo';
        const result = LogMessage.Warning(message);
        expect(result.message).toBe(message);
        expect(result.type).toBe(LogType.Warning);
    }
);

test('Error should return correct message, with string parameter',
    () =>
    {
        const message = 'foo';
        const result = LogMessage.Error(message);
        expect(result.message).toBe(message);
        expect(result.type).toBe(LogType.Error);
    }
);

test('Error should return correct message, with error parameter',
    () =>
    {
        const error = new Error('foo');
        const result = LogMessage.Error(error);
        expect(result.message).toBe(error.stack);
        expect(result.type).toBe(LogType.Error);
    }
);

test('Error should return correct message, with stackless error parameter',
    () =>
    {
        const error = new Error('foo');
        error.stack = void(0);
        const result = LogMessage.Error(error);
        expect(result.message).toBe(error.toString());
        expect(result.type).toBe(LogType.Error);
    }
);

each([
    [LogType[LogType.Debug]],
    [LogType[LogType.Information]],
    [LogType[LogType.Warning]],
    [LogType[LogType.Error]]
])
.test('ctor should create properly (%#): type name: %s',
    (typeName: keyof typeof LogType) =>
    {
        const message = 'foo';
        const type = LogType[typeName];
        const result = new LogMessage(message, type);
        expect(result.message).toBe(message);
        expect(result.type).toBe(type);
    }
);

test('toString should return correct value',
    () =>
    {
        const message = 'foo';
        const type = LogType.Information;
        const log = new LogMessage(message, type);

        const result = log.toString();

        expect(result).toBe(message);
    }
);
