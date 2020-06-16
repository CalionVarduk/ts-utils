import { toDeepReadonly } from '../../src/types/deep-readonly';

test('toDeepReadonly should not throw',
    () =>
    {
        const target = { foo: 0, bar: '' };
        let result: { foo?: number } = {};
        const action = () => result = toDeepReadonly<{ foo?: number }>(target);
        expect(action).not.toThrow();
        expect(result).toBe(target);
    }
);
