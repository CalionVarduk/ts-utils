import { isNull } from '../../src/functions/is-null';

test('is null should return correct result',
    () =>
    {
        const nul = null;
        const und = void(0);
        const str = '';
        const num = 0;
        const obj = {};
        const nulResult = isNull(nul);
        const undResult = isNull(und);
        const strResult = isNull(str);
        const numResult = isNull(num);
        const objResult = isNull(obj);
        expect(nulResult).toBe(true);
        expect(undResult).toBe(false);
        expect(strResult).toBe(false);
        expect(numResult).toBe(false);
        expect(objResult).toBe(false);
    }
);
