import { Logger, createConsoleLogger } from '../../core/logging/logger';
import { LogType } from '../../core/logging/log-type.enum';
import each from 'jest-each';
import { LogMessage } from '../../core/logging/log-message';
import { Nullable } from '../../core/types/nullable';
import { ILogger, LoggerDelegate } from '../../core/logging/logger.interface';

each([
    [LogType[LogType.Debug]],
    [LogType[LogType.Information]],
    [LogType[LogType.Warning]],
    [LogType[LogType.Error]]
])
.test('createConsoleLogger should create a proper delegate',
    (typeName: keyof typeof LogType) =>
    {
        let debugCalled = false;
        let infoCalled = false;
        let warnCalled = false;
        let errorCalled = false;

        const oldDebug = console.debug;
        const oldInfo = console.info;
        const oldWarn = console.warn;
        const oldError = console.error;

        console.debug = function() { debugCalled = true; };
        console.info = function() { infoCalled = true; };
        console.warn = function() { warnCalled = true; };
        console.error = function() { errorCalled = true; };

        const message = 'foo';
        const type = LogType[typeName];
        const logger = new Logger();
        const delegate = createConsoleLogger();

        logger.listen(delegate);

        logger.logMessage(message, type);

        const actual = (function()
        {
            switch (type)
            {
                case LogType.Debug: return debugCalled;
                case LogType.Information: return infoCalled;
                case LogType.Warning: return warnCalled;
                case LogType.Error: return errorCalled;
            }
        })()!;

        console.debug = oldDebug;
        console.info = oldInfo;
        console.warn = oldWarn;
        console.error = oldError;

        expect(actual).toBe(true);
    }
);

test('ctor should create properly',
    () =>
    {
        const result = new Logger();
        expect(result.isDisposed).toBe(false);
        expect(result.listeners.length).toBe(0);
        expect(result.logLevel).toBe(LogType.Debug);
        expect(result.timestamp).toBeGreaterThanOrEqual(0);
    }
);

test('dispose should remove all listeners',
    () =>
    {
        const logger = new Logger();
        const listener = logger.listen(() => {});

        logger.dispose();

        expect(logger.listeners.length).toBe(0);
        expect(logger.isDisposed).toBe(true);
        expect(listener.isDisposed).toBe(true);
    }
);

test('dispose invoked more than once should not throw',
    () =>
    {
        const logger = new Logger();

        logger.dispose();
        const action = () => logger.dispose();

        expect(action).not.toThrow();
        expect(logger.listeners.length).toBe(0);
        expect(logger.isDisposed).toBe(true);
    }
);

each([
    [LogType.Debug, LogType.Debug, true],
    [LogType.Debug, LogType.Information, false],
    [LogType.Debug, LogType.Warning, false],
    [LogType.Debug, LogType.Error, false],
    [LogType.Information, LogType.Debug, true],
    [LogType.Information, LogType.Information, true],
    [LogType.Information, LogType.Warning, false],
    [LogType.Information, LogType.Error, false],
    [LogType.Warning, LogType.Debug, true],
    [LogType.Warning, LogType.Information, true],
    [LogType.Warning, LogType.Warning, true],
    [LogType.Warning, LogType.Error, false],
    [LogType.Error, LogType.Debug, true],
    [LogType.Error, LogType.Information, true],
    [LogType.Error, LogType.Warning, true],
    [LogType.Error, LogType.Error, true],
    [LogType.Error, LogType.Error + 1, false]
])
.test('log should publish message, if logger level allows it (%#): type: %f, level: %f, should publish: %s',
    (type: LogType, level: LogType, shouldPublish: boolean) =>
    {
        const logger = new Logger();
        logger.logLevel = level;
        const message = new LogMessage('foo', type);

        let interceptedMessage: Nullable<LogMessage> = null;
        let interceptedTimestamp: Nullable<number> = null;
        let interceptedLogger: Nullable<ILogger> = null;
        logger.listen((m, t, l) =>
        {
            interceptedMessage = m;
            interceptedTimestamp = t;
            interceptedLogger = l;
        });

        const minTimestamp = logger.timestamp;
        logger.log(message);
        const maxTimestamp = logger.timestamp;

        if (shouldPublish)
        {
            expect(interceptedMessage).toBe(message);
            expect(interceptedTimestamp).toBeGreaterThanOrEqual(minTimestamp);
            expect(interceptedTimestamp).toBeLessThanOrEqual(maxTimestamp);
            expect(interceptedLogger).toBe(logger);
        }
        else
        {
            expect(interceptedMessage).toBeNull();
            expect(interceptedTimestamp).toBeNull();
            expect(interceptedLogger).toBeNull();
        }
    }
);

each([
    [LogType.Debug, LogType.Debug, true],
    [LogType.Debug, LogType.Information, false],
    [LogType.Debug, LogType.Warning, false],
    [LogType.Debug, LogType.Error, false],
    [LogType.Information, LogType.Debug, true],
    [LogType.Information, LogType.Information, true],
    [LogType.Information, LogType.Warning, false],
    [LogType.Information, LogType.Error, false],
    [LogType.Warning, LogType.Debug, true],
    [LogType.Warning, LogType.Information, true],
    [LogType.Warning, LogType.Warning, true],
    [LogType.Warning, LogType.Error, false],
    [LogType.Error, LogType.Debug, true],
    [LogType.Error, LogType.Information, true],
    [LogType.Error, LogType.Warning, true],
    [LogType.Error, LogType.Error, true],
    [LogType.Error, LogType.Error + 1, false]
])
.test('logMessage should publish message, if logger level allows it (%#): type: %f, level: %f, should publish: %s',
    (type: LogType, level: LogType, shouldPublish: boolean) =>
    {
        const message = 'foo';
        const logger = new Logger();
        logger.logLevel = level;

        let interceptedMessage: Nullable<LogMessage> = null;
        let interceptedTimestamp: Nullable<number> = null;
        let interceptedLogger: Nullable<ILogger> = null;
        logger.listen((m, t, l) =>
        {
            interceptedMessage = m;
            interceptedTimestamp = t;
            interceptedLogger = l;
        });

        const minTimestamp = logger.timestamp;
        logger.logMessage(message, type);
        const maxTimestamp = logger.timestamp;

        if (shouldPublish)
        {
            expect(interceptedMessage!.message).toBe(message);
            expect(interceptedMessage!.type).toBe(type);
            expect(interceptedTimestamp).toBeGreaterThanOrEqual(minTimestamp);
            expect(interceptedTimestamp).toBeLessThanOrEqual(maxTimestamp);
            expect(interceptedLogger).toBe(logger);
        }
        else
        {
            expect(interceptedMessage).toBeNull();
            expect(interceptedTimestamp).toBeNull();
            expect(interceptedLogger).toBeNull();
        }
    }
);

each([
    [LogType.Debug, true],
    [LogType.Information, false],
    [LogType.Warning, false],
    [LogType.Error, false]
])
.test('logDebug should publish message, if logger level allows it (%#): type: %f, level: %f, should publish: %s',
    (level: LogType, shouldPublish: boolean) =>
    {
        const message = 'foo';
        const logger = new Logger();
        logger.logLevel = level;

        let interceptedMessage: Nullable<LogMessage> = null;
        let interceptedTimestamp: Nullable<number> = null;
        let interceptedLogger: Nullable<ILogger> = null;
        logger.listen((m, t, l) =>
        {
            interceptedMessage = m;
            interceptedTimestamp = t;
            interceptedLogger = l;
        });

        const minTimestamp = logger.timestamp;
        logger.logDebug(message);
        const maxTimestamp = logger.timestamp;

        if (shouldPublish)
        {
            expect(interceptedMessage!.message).toBe(message);
            expect(interceptedMessage!.type).toBe(LogType.Debug);
            expect(interceptedTimestamp).toBeGreaterThanOrEqual(minTimestamp);
            expect(interceptedTimestamp).toBeLessThanOrEqual(maxTimestamp);
            expect(interceptedLogger).toBe(logger);
        }
        else
        {
            expect(interceptedMessage).toBeNull();
            expect(interceptedTimestamp).toBeNull();
            expect(interceptedLogger).toBeNull();
        }
    }
);

each([
    [LogType.Debug, true],
    [LogType.Information, true],
    [LogType.Warning, false],
    [LogType.Error, false]
])
.test('logInformation should publish message, if logger level allows it (%#): type: %f, level: %f, should publish: %s',
    (level: LogType, shouldPublish: boolean) =>
    {
        const message = 'foo';
        const logger = new Logger();
        logger.logLevel = level;

        let interceptedMessage: Nullable<LogMessage> = null;
        let interceptedTimestamp: Nullable<number> = null;
        let interceptedLogger: Nullable<ILogger> = null;
        logger.listen((m, t, l) =>
        {
            interceptedMessage = m;
            interceptedTimestamp = t;
            interceptedLogger = l;
        });

        const minTimestamp = logger.timestamp;
        logger.logInformation(message);
        const maxTimestamp = logger.timestamp;

        if (shouldPublish)
        {
            expect(interceptedMessage!.message).toBe(message);
            expect(interceptedMessage!.type).toBe(LogType.Information);
            expect(interceptedTimestamp).toBeGreaterThanOrEqual(minTimestamp);
            expect(interceptedTimestamp).toBeLessThanOrEqual(maxTimestamp);
            expect(interceptedLogger).toBe(logger);
        }
        else
        {
            expect(interceptedMessage).toBeNull();
            expect(interceptedTimestamp).toBeNull();
            expect(interceptedLogger).toBeNull();
        }
    }
);

each([
    [LogType.Debug, true],
    [LogType.Information, true],
    [LogType.Warning, true],
    [LogType.Error, false]
])
.test('logWarning should publish message, if logger level allows it (%#): type: %f, level: %f, should publish: %s',
    (level: LogType, shouldPublish: boolean) =>
    {
        const message = 'foo';
        const logger = new Logger();
        logger.logLevel = level;

        let interceptedMessage: Nullable<LogMessage> = null;
        let interceptedTimestamp: Nullable<number> = null;
        let interceptedLogger: Nullable<ILogger> = null;
        logger.listen((m, t, l) =>
        {
            interceptedMessage = m;
            interceptedTimestamp = t;
            interceptedLogger = l;
        });

        const minTimestamp = logger.timestamp;
        logger.logWarning(message);
        const maxTimestamp = logger.timestamp;

        if (shouldPublish)
        {
            expect(interceptedMessage!.message).toBe(message);
            expect(interceptedMessage!.type).toBe(LogType.Warning);
            expect(interceptedTimestamp).toBeGreaterThanOrEqual(minTimestamp);
            expect(interceptedTimestamp).toBeLessThanOrEqual(maxTimestamp);
            expect(interceptedLogger).toBe(logger);
        }
        else
        {
            expect(interceptedMessage).toBeNull();
            expect(interceptedTimestamp).toBeNull();
            expect(interceptedLogger).toBeNull();
        }
    }
);

each([
    [LogType.Debug, true],
    [LogType.Information, true],
    [LogType.Warning, true],
    [LogType.Error, true],
    [LogType.Error + 1, false]
])
.test('logError should publish message, if logger level allows it (%#): type: %f, level: %f, should publish: %s',
    (level: LogType, shouldPublish: boolean) =>
    {
        const message = 'foo';
        const logger = new Logger();
        logger.logLevel = level;

        let interceptedMessage: Nullable<LogMessage> = null;
        let interceptedTimestamp: Nullable<number> = null;
        let interceptedLogger: Nullable<ILogger> = null;
        logger.listen((m, t, l) =>
        {
            interceptedMessage = m;
            interceptedTimestamp = t;
            interceptedLogger = l;
        });

        const minTimestamp = logger.timestamp;
        logger.logError(message);
        const maxTimestamp = logger.timestamp;

        if (shouldPublish)
        {
            expect(interceptedMessage!.message).toBe(message);
            expect(interceptedMessage!.type).toBe(LogType.Error);
            expect(interceptedTimestamp).toBeGreaterThanOrEqual(minTimestamp);
            expect(interceptedTimestamp).toBeLessThanOrEqual(maxTimestamp);
            expect(interceptedLogger).toBe(logger);
        }
        else
        {
            expect(interceptedMessage).toBeNull();
            expect(interceptedTimestamp).toBeNull();
            expect(interceptedLogger).toBeNull();
        }
    }
);

test('listen should register a new listener',
    () =>
    {
        const delegate: LoggerDelegate = () => {};
        const logger = new Logger();

        const result = logger.listen(delegate);

        expect(result.isDisposed).toBe(false);
        expect(result.delegate).toBe(delegate);
        expect(logger.listeners.length).toBe(1);
        expect(logger.listeners).toContain(result);
    }
);

test('listen should throw when invoked on disposed logger',
    () =>
    {
        const logger = new Logger();
        logger.dispose();

        const action = () => logger.listen(() => {});

        expect(action).toThrow();
    }
);

test('listen invoked inside listener delegate should throw',
    () =>
    {
        const logger = new Logger();
        const firstListener = logger.listen(() => {});
        logger.listen(() =>
        {
            firstListener.dispose();
            logger.listen(() => {});
        });

        const action = () => logger.logInformation('foo');

        expect(action).toThrow();
    }
);

test('ILoggerListener.dispose should remove listener properly',
    () =>
    {
        const logger = new Logger();

        const result = logger.listen(() => {});
        result.dispose();

        expect(result.isDisposed).toBe(true);
        expect(logger.listeners.length).toBe(0);
    }
);

test('ILoggerListener.dispose invoked more than once should not throw',
    () =>
    {
        const logger = new Logger();

        const result = logger.listen(() => {});
        result.dispose();
        const action = () => result.dispose();

        expect(action).not.toThrow();
        expect(result.isDisposed).toBe(true);
        expect(logger.listeners.length).toBe(0);
    }
);
