import { Assert } from '../../src/functions/assert';

function getError(action: () => void): Error {
    let error: Error | null = null;
    try {
        action();
    }
    catch (e) {
        error = e;
    }
    return error!;
}

test('is defined should return parameter when it is defined',
    () =>
    {
        const num = 0;
        const obj = {};
        const numResult = Assert.IsDefined(num);
        const objResult = Assert.IsDefined(obj);
        expect(numResult).toBe(num);
        expect(objResult).toBe(obj);
    }
);

test('is defined should throw an error when parameter is not defined',
    () =>
    {
        const und = void(0);
        const nul = null;
        const undErr1 = getError(() => Assert.IsDefined(und));
        const nulErr1 = getError(() => Assert.IsDefined(nul));
        const undErr2 = getError(() => Assert.IsDefined(und, 'und'));
        const nulErr2 = getError(() => Assert.IsDefined(nul, 'nul'));
        expect(undErr1.message).toBe('parameter must not be null or undefined');
        expect(nulErr1.message).toBe('parameter must not be null or undefined');
        expect(undErr2.message).toBe('\'und\' must not be null or undefined');
        expect(nulErr2.message).toBe('\'nul\' must not be null or undefined');
    }
);

test('is null or undefined should return parameter when it is not defined',
    () =>
    {
        const und = void(0);
        const nul = null;
        const undResult = Assert.IsNullOrUndefined(und);
        const nulResult = Assert.IsNullOrUndefined(nul);
        expect(undResult).toBe(und);
        expect(nulResult).toBe(nul);
    }
);

test('is null or undefined should throw an error when parameter is defined',
    () =>
    {
        const num = 0;
        const obj = {};
        const numErr1 = getError(() => Assert.IsNullOrUndefined(num));
        const objErr1 = getError(() => Assert.IsNullOrUndefined(obj));
        const numErr2 = getError(() => Assert.IsNullOrUndefined(num, 'num'));
        const objErr2 = getError(() => Assert.IsNullOrUndefined(obj, 'obj'));
        expect(numErr1.message).toBe('parameter must be null or undefined');
        expect(objErr1.message).toBe('parameter must be null or undefined');
        expect(numErr2.message).toBe('\'num\' must be null or undefined');
        expect(objErr2.message).toBe('\'obj\' must be null or undefined');
    }
);

test('is not null should return parameter when it is not null',
    () =>
    {
        const und = void(0);
        const num = 0;
        const obj = {};
        const undResult = Assert.IsNotNull(und);
        const numResult = Assert.IsNotNull(num);
        const objResult = Assert.IsNotNull(obj);
        expect(undResult).toBe(und);
        expect(numResult).toBe(num);
        expect(objResult).toBe(obj);
    }
);

test('is not null should throw an error when parameter is null',
    () =>
    {
        const nul = null;
        const nulErr1 = getError(() => Assert.IsNotNull(nul));
        const nulErr2 = getError(() => Assert.IsNotNull(nul, 'nul'));
        expect(nulErr1.message).toBe('parameter must not be null');
        expect(nulErr2.message).toBe('\'nul\' must not be null');
    }
);

test('is null should return parameter when it is null',
    () =>
    {
        const nul = null;
        const nulResult = Assert.IsNull(nul);
        expect(nulResult).toBe(nul);
    }
);

test('is null should throw an error when parameter is not null',
    () =>
    {
        const und = void(0);
        const num = 0;
        const obj = {};
        const undErr1 = getError(() => Assert.IsNull(und));
        const numErr1 = getError(() => Assert.IsNull(num));
        const objErr1 = getError(() => Assert.IsNull(obj));
        const undErr2 = getError(() => Assert.IsNull(und, 'und'));
        const numErr2 = getError(() => Assert.IsNull(num, 'num'));
        const objErr2 = getError(() => Assert.IsNull(obj, 'obj'));
        expect(undErr1.message).toBe('parameter must be null');
        expect(numErr1.message).toBe('parameter must be null');
        expect(objErr1.message).toBe('parameter must be null');
        expect(undErr2.message).toBe('\'und\' must be null');
        expect(numErr2.message).toBe('\'num\' must be null');
        expect(objErr2.message).toBe('\'obj\' must be null');
    }
);

test('is not undefined should return parameter when it is not undefined',
    () =>
    {
        const nul = null;
        const num = 0;
        const obj = {};
        const nulResult = Assert.IsNotUndefined(nul);
        const numResult = Assert.IsNotUndefined(num);
        const objResult = Assert.IsNotUndefined(obj);
        expect(nulResult).toBe(nul);
        expect(numResult).toBe(num);
        expect(objResult).toBe(obj);
    }
);

test('is not undefined should throw an error when parameter is undefined',
    () =>
    {
        const und = void(0);
        const undErr1 = getError(() => Assert.IsNotUndefined(und));
        const undErr2 = getError(() => Assert.IsNotUndefined(und, 'und'));
        expect(undErr1.message).toBe('parameter must not be undefined');
        expect(undErr2.message).toBe('\'und\' must not be undefined');
    }
);

test('is undefined should return parameter when it is undefined',
    () =>
    {
        const und = void(0);
        const undResult = Assert.IsUndefined(und);
        expect(undResult).toBe(und);
    }
);

test('is undefined should throw an error when parameter is not undefined',
    () =>
    {
        const nul = null;
        const num = 0;
        const obj = {};
        const nulErr1 = getError(() => Assert.IsUndefined(nul));
        const numErr1 = getError(() => Assert.IsUndefined(num));
        const objErr1 = getError(() => Assert.IsUndefined(obj));
        const nulErr2 = getError(() => Assert.IsUndefined(nul, 'nul'));
        const numErr2 = getError(() => Assert.IsUndefined(num, 'num'));
        const objErr2 = getError(() => Assert.IsUndefined(obj, 'obj'));
        expect(nulErr1.message).toBe('parameter must be undefined');
        expect(numErr1.message).toBe('parameter must be undefined');
        expect(objErr1.message).toBe('parameter must be undefined');
        expect(nulErr2.message).toBe('\'nul\' must be undefined');
        expect(numErr2.message).toBe('\'num\' must be undefined');
        expect(objErr2.message).toBe('\'obj\' must be undefined');
    }
);

test('is empty should return parameter when it is empty',
    () =>
    {
        const col: number[] = [];
        const colResult = Assert.IsEmpty(col);
        expect(colResult).toBe(col);
    }
);

test('is empty should throw an error when parameter is not empty',
    () =>
    {
        const col: number[] = [1];
        const colErr1 = getError(() => Assert.IsEmpty(col));
        const colErr2 = getError(() => Assert.IsEmpty(col, 'col'));
        expect(colErr1.message).toBe('parameter must be empty');
        expect(colErr2.message).toBe('\'col\' must be empty');
    }
);

test('is not empty should return parameter when it is not empty',
    () =>
    {
        const col: number[] = [1];
        const colResult = Assert.IsNotEmpty(col);
        expect(colResult).toBe(col);
    }
);

test('is not empty should throw an error when parameter is empty',
    () =>
    {
        const col: number[] = [];
        const colErr1 = getError(() => Assert.IsNotEmpty(col));
        const colErr2 = getError(() => Assert.IsNotEmpty(col, 'col'));
        expect(colErr1.message).toBe('parameter must not be empty');
        expect(colErr2.message).toBe('\'col\' must not be empty');
    }
);

test('contains defined only should not throw when all elements are defined',
    () =>
    {
        const col1: number[] = [];
        const col2: number[] = [1, 2];
        const action1 = () => Assert.ContainsDefinedOnly(col1);
        const action2 = () => Assert.ContainsDefinedOnly(col2);
        expect(action1).not.toThrow();
        expect(action2).not.toThrow();
    }
);

test('contains defined only should throw an error when some elements are not defined',
    () =>
    {
        const col1: (number | null)[] = [1, null, 2];
        const col2: (number | undefined)[] = [1, 2, void(0)];
        const err1 = getError(() => Assert.ContainsDefinedOnly(col1));
        const err2 = getError(() => Assert.ContainsDefinedOnly(col2, 'col2'));
        expect(err1.message).toBe('parameter must not contain any null or undefined elements');
        expect(err2.message).toBe('\'col2\' must not contain any null or undefined elements');
    }
);

test('true should not throw when condition is met',
    () =>
    {
        const action = () => Assert.True(true);
        expect(action).not.toThrow();
    }
);

test('true should throw an error when condition is not met',
    () =>
    {
        const err1 = getError(() => Assert.True(false));
        const err2 = getError(() => Assert.True(false, 'msg'));
        const err3 = getError(() => Assert.True(false, () => 'msg'));
        expect(err1.message).toBe('condition must be met');
        expect(err2.message).toBe('msg');
        expect(err3.message).toBe('msg');
    }
);

test('false should not throw when condition is not met',
    () =>
    {
        const action = () => Assert.False(false);
        expect(action).not.toThrow();
    }
);

test('false should throw an error when condition is met',
    () =>
    {
        const err1 = getError(() => Assert.False(true));
        const err2 = getError(() => Assert.False(true, 'msg'));
        const err3 = getError(() => Assert.False(true, () => 'msg'));
        expect(err1.message).toBe('condition must not be met');
        expect(err2.message).toBe('msg');
        expect(err3.message).toBe('msg');
    }
);
