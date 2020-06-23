import { isUndefined } from '../../src/functions/is-undefined';

test('is undefined should return correct result',
    () =>
    {
        const nul = null;
        const und = void(0);
        const str = '';
        const num = 0;
        const obj = {};
        const nulResult = isUndefined(nul);
        const undResult = isUndefined(und);
        const strResult = isUndefined(str);
        const numResult = isUndefined(num);
        const objResult = isUndefined(obj);
        expect(nulResult).toBe(false);
        expect(undResult).toBe(true);
        expect(strResult).toBe(false);
        expect(numResult).toBe(false);
        expect(objResult).toBe(false);
    }
);
