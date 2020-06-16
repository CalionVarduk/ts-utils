import { Mapper } from '../../core/mapping/mapper';
import { Nullable } from '../../core/types';
import { IMapper } from '../../core/mapping/mapper.interface';

class Foo
{
    public constructor(public value: string) {}
}

test('ctor should create properly',
    () =>
    {
        const action = () => new Mapper();
        expect(action).not.toThrow();
    }
);

test('add should add properly',
    () =>
    {
        const mapper = new Mapper();

        const result = mapper.add('string', Foo, s => new Foo(s));

        expect(result.has('string', Foo)).toBe(true);
        expect(result).toBe(mapper);
    }
);

test('add should add multiple properly',
    () =>
    {
        const mapper = new Mapper();

        mapper
            .add('string', Foo, s => new Foo(s))
            .add('string', 'string', s => s)
            .add(Foo, Foo, f => new Foo(f.value))
            .add(Foo, 'string', f => f.value);

        expect(mapper.has('string', Foo)).toBe(true);
        expect(mapper.has('string', 'string')).toBe(true);
        expect(mapper.has(Foo, Foo)).toBe(true);
        expect(mapper.has(Foo, 'string')).toBe(true);
    }
);

test('add should throw when adding existing mapping',
    () =>
    {
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const action = () => mapper.add('string', Foo, s => new Foo(s + s));

        expect(action).toThrow();
    }
);

test('map should map from primitive to class properly',
    () =>
    {
        let paramMapper: Nullable<IMapper> = null;

        const value = 'foo';
        const mapper = new Mapper()
            .add('string', Foo, (s, m) =>
            {
                paramMapper = m;
                return new Foo(s);
            });

        const result = mapper.map(Foo, value);

        expect(result.value).toBe(value);
        expect(paramMapper).toBe(mapper);
    }
);

test('map should map from class to primitive properly',
    () =>
    {
        let paramMapper: Nullable<IMapper> = null;

        const value = new Foo('foo');
        const mapper = new Mapper()
            .add(Foo, 'string', (f, m) =>
            {
                paramMapper = m;
                return f.value;
            });

        const result = mapper.map('string', value);

        expect(result).toBe(value.value);
        expect(paramMapper).toBe(mapper);
    }
);

test('map should map from primitive to primitive properly',
    () =>
    {
        let paramMapper: Nullable<IMapper> = null;

        const value = 'foo';
        const mapper = new Mapper()
            .add('string', 'string', (s, m) =>
            {
                paramMapper = m;
                return s;
            });

        const result = mapper.map('string', value);

        expect(result).toBe(value);
        expect(paramMapper).toBe(mapper);
    }
);

test('map should map from class to class properly',
    () =>
    {
        let paramMapper: Nullable<IMapper> = null;

        const value = new Foo('foo');
        const mapper = new Mapper()
            .add(Foo, Foo, (f, m) =>
            {
                paramMapper = m;
                return new Foo(f.value);
            });

        const result = mapper.map(Foo, value);

        expect(result.value).toBe(value.value);
        expect(paramMapper).toBe(mapper);
    }
);

test('map should throw when source type doesn\'t have any mappings',
    () =>
    {
        const value = null;
        const mapper = new Mapper();

        const action = () => mapper.map(Foo, value);

        expect(action).toThrow();
    }
);

test('map should throw when mapping doesn\'t exist',
    () =>
    {
        const value = 'foo';
        const mapper = new Mapper()
            .add('string', 'string', s => s);

        const action = () => mapper.map(Foo, value);

        expect(action).toThrow();
    }
);

test('mapNullable should map non-null properly',
    () =>
    {
        const value = 'foo';
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapNullable(Foo, value);

        expect(result).not.toBeNull();
        expect(result!.value).toBe(value);
    }
);

test('mapNullable should map null properly',
    () =>
    {
        const value = null;
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapNullable(Foo, value);

        expect(result).toBeNull();
    }
);

test('mapUndefinable should map non-undefined properly',
    () =>
    {
        const value = 'foo';
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapUndefinable(Foo, value);

        expect(result).not.toBeUndefined();
        expect(result!.value).toBe(value);
    }
);

test('mapUndefinable should map undefined properly',
    () =>
    {
        const value = void(0);
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapUndefinable(Foo, value);

        expect(result).toBeUndefined();
    }
);

test('mapOptional should map non-optional properly',
    () =>
    {
        const value = 'foo';
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapOptional(Foo, value);

        expect(result).not.toBeUndefined();
        expect(result).not.toBeNull();
        expect(result!.value).toBe(value);
    }
);

test('mapOptional should map null properly',
    () =>
    {
        const value = null;
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapOptional(Foo, value);

        expect(result).toBeNull();
    }
);

test('mapOptional should map undefined properly',
    () =>
    {
        const value = void(0);
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapOptional(Foo, value);

        expect(result).toBeUndefined();
    }
);

test('mapRange should map properly',
    () =>
    {
        const range = ['a', 'b', 'c', 'd', 'e'];
        const mapper = new Mapper()
            .add('string', Foo, s => new Foo(s));

        const result = mapper.mapRange(Foo, range);

        expect(result.length).toBe(range.length);
        for (let i = 0; i < result.length; ++i)
            expect(result[i].value).toBe(range[i]);
    }
);
