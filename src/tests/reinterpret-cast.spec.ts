import { reinterpretCast } from '../core/reinterpret-cast';

test('reinterpret cast should not throw',
    () => {
        const target = { foo: 0, bar: '' };
        let result: { foo?: number } = {};
        const action = () => result = reinterpretCast<{ foo?: number }>(target);
        expect(action).not.toThrow();
        expect(result).toBe(target);
    }
);
