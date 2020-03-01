import { makeRef } from '../../core/types/ref';

test('makeRef should return correct result',
    () =>
    {
        const str = '';
        const obj = {};
        const strResult = makeRef(str);
        const objResult = makeRef(obj);
        expect(strResult.value).toBe(str);
        expect(objResult.value).toBe(obj);
    }
);
