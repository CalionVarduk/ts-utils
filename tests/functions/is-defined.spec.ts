import { isDefined } from '../../src/functions/is-defined';

test('is defined should return correct result',
    () =>
    {
        const nul = null;
        const und = void(0);
        const str = '';
        const num = 0;
        const obj = {};
        const nulResult = isDefined(nul);
        const undResult = isDefined(und);
        const strResult = isDefined(str);
        const numResult = isDefined(num);
        const objResult = isDefined(obj);
        expect(nulResult).toBe(false);
        expect(undResult).toBe(false);
        expect(strResult).toBe(true);
        expect(numResult).toBe(true);
        expect(objResult).toBe(true);
    }
);
