import { LogType } from './log-type.enum';
import { isPrimitiveOfType, isDefined } from '../functions';

/** Represents logger's message. */
export class LogMessage
{
    /**
     * Creates a new debug message.
     * @param message A message.
     * @returns A new LogMessage object.
     */
    public static Debug(message: string): LogMessage
    {
        return new LogMessage(message, LogType.Debug);
    }

    /**
     * Creates a new information message.
     * @param message A message.
     * @returns A new LogMessage object.
     */
    public static Information(message: string): LogMessage
    {
        return new LogMessage(message, LogType.Information);
    }

    /**
     * Creates a new warning message.
     * @param message A message.
     * @returns A new LogMessage object.
     */
    public static Warning(message: string): LogMessage
    {
        return new LogMessage(message, LogType.Warning);
    }

    /**
     * Creates a new error message.
     * @param message A message, or an error to parse to a message.
     * @returns A new LogMessage object.
     */
    public static Error(message: string | Error): LogMessage
    {
        if (isPrimitiveOfType('string', message))
            return new LogMessage(message, LogType.Error);

        const errorMessage = isDefined(message.stack) ?
            message.stack :
            message.toString();

        return new LogMessage(errorMessage, LogType.Error);
    }

    /** Specifies the message. */
    public readonly message: string;

    /** Specifies the message's type. */
    public readonly type: LogType;

    /**
     * Creates a new LogMessage object.
     * @param message A message.
     * @param type Message's type.
     */
    public constructor(message: string, type: LogType)
    {
        this.message = message;
        this.type = type;
    }

    /**
     * Parses the LogMessage object to string.
     * @returns A string representation of the LogMessage.
     */
    public toString(): string
    {
        return this.message;
    }
}
