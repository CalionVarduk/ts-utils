import { isDisposable, IDisposable } from '../src/disposable.interface';

class Foo implements IDisposable
{
    public dispose(): void {}
}

test('is disposable should return correct result',
    () =>
    {
        const nul = null;
        const und = void(0);
        const str = '';
        const num = 0;
        const obj = {};
        const foo = new Foo();
        const nulResult = isDisposable(nul);
        const undResult = isDisposable(und);
        const strResult = isDisposable(str);
        const numResult = isDisposable(num);
        const objResult = isDisposable(obj);
        const fooResult = isDisposable(foo);
        expect(nulResult).toBe(false);
        expect(undResult).toBe(false);
        expect(strResult).toBe(false);
        expect(numResult).toBe(false);
        expect(objResult).toBe(false);
        expect(fooResult).toBe(true);
    }
);
