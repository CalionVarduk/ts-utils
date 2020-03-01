import { readonlyCast, deepReadonlyCast } from '../../core/functions/readonly-cast';
import { DeepReadonly } from '../../core/types/deep-readonly';

test('readonly cast should not throw',
    () =>
    {
        const target: Readonly<{ foo: number; bar: string }> = { foo: 0, bar: '' };
        let result: { foo: number; bar: string } | null = null;
        const action = () => result = readonlyCast(target);
        expect(action).not.toThrow();
        expect(result).toBe(target);
    }
);

test('deep readonly cast should not throw',
    () =>
    {
        const target: DeepReadonly<{ foo: number; bar: string }> = { foo: 0, bar: '' };
        let result: { foo: number; bar: string } | null = null;
        const action = () => result = deepReadonlyCast(target);
        expect(action).not.toThrow();
        expect(result).toBe(target);
    }
);
