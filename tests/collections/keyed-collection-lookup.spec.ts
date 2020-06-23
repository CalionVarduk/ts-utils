import { KeyedCollectionLookup } from '../../src/collections/keyed-collection-lookup';
import { KeySelector } from '../../src/collections/key-selector';
import { Stringifier } from '../../src/types/stringifier';

class ComplexKey
{
    public id: string = '';
    public no: number = 0;
}

class Dto
{
    public id: string = '';
    public complexId: ComplexKey = new ComplexKey();
}

test('ctor should create a proper KeyedCollectionLookup object',
    () =>
    {
        const name = 'lookup';
        const keySelector: KeySelector<string, Dto> = d => d.id;

        const result = new KeyedCollectionLookup<string, Dto>(name, keySelector);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.name).toBe(name);
        expect(result.keySelector).toBe(keySelector);
        expect(result.keyStringifier).toBeDefined();
    }
);

test('ctor should create a proper KeyedCollectionLookup object, with custom key stringifier',
    () =>
    {
        const name = 'lookup';
        const keySelector: KeySelector<string, Dto> = d => d.id;
        const keyStringifier: Stringifier<string> = k => `key_${k}`;

        const result = new KeyedCollectionLookup<string, Dto>(name, keySelector, keyStringifier);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.name).toBe(name);
        expect(result.keySelector).toBe(keySelector);
        expect(result.keyStringifier).toBe(keyStringifier);
    }
);

test('get should throw if lookup is empty',
    () =>
    {
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);

        const action = () => lookup.get('id');

        expect(action).toThrow();
    }
);

test('get should throw if key doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const key = 'id2';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto);

        const action = () => lookup.get(key);

        expect(action).toThrow();
    }
);

test('get should return a valid entity',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto);

        const result = lookup.get(dto.id);

        expect(result).toBe(dto);
    }
);

test('tryGet should return null if lookup is empty',
    () =>
    {
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = lookup.tryGet(new ComplexKey());

        expect(result).toBeNull();
    }
);

test('tryGet should return null if key doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const key = new ComplexKey();
        key.id = 'id1';
        key.no = 2;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);
        lookup.add(dto);

        const result = lookup.tryGet(key);

        expect(result).toBeNull();
    }
);

test('tryGet should return a valid entity',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const key = new ComplexKey();
        key.id = dto.complexId.id;
        key.no = dto.complexId.no;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);
        lookup.add(dto);

        const result = lookup.tryGet(key);

        expect(result).toBe(dto);
    }
);

test('getRange should throw if any key doesn\'t exist',
    () =>
    {
        const dtoRange = [
            new Dto(),
            new Dto()
        ];
        dtoRange.forEach((d, idx) => d.id = `id${idx + 1}`);
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        dtoRange.forEach(d => lookup.add(d));

        const action = () => Array.from(lookup.getRange(['id1', 'id3']));

        expect(action).toThrow();
    }
);

test('getRange should return entities in order of provided keys',
    () =>
    {
        const dtoRange = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtoRange.forEach((d, idx) => d.id = `id${idx + 1}`);
        const keys = ['id1', 'id3', 'id2', 'id1', 'id2'];
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        dtoRange.forEach(d => lookup.add(d));

        const result = Array.from(lookup.getRange(keys));

        expect(result).toEqual([dtoRange[0], dtoRange[2], dtoRange[1], dtoRange[0], dtoRange[1]]);
    }
);

test('tryGetRange should return existing entities in order of provided keys, ignoring non-existing keys',
    () =>
    {
        const dtoRange = [
            new Dto(),
            new Dto()
        ];
        dtoRange.forEach((d, idx) => d.id = `id${idx + 1}`);
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        dtoRange.forEach(d => lookup.add(d));

        const result = Array.from(lookup.tryGetRange(['id1', 'id3', 'id2', 'id4']));

        expect(result).toEqual([dtoRange[0], dtoRange[1]]);
    }
);

test('tryGetRange should return entities in order of provided keys',
    () =>
    {
        const dtoRange = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtoRange.forEach((d, idx) => d.id = `id${idx + 1}`);
        const keys = ['id1', 'id3', 'id2', 'id1', 'id2'];
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        dtoRange.forEach(d => lookup.add(d));

        const result = Array.from(lookup.tryGetRange(keys));

        expect(result).toEqual([dtoRange[0], dtoRange[2], dtoRange[1], dtoRange[0], dtoRange[1]]);
    }
);

test('getEntityKey should return a valid key',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = lookup.getEntityKey(dto);

        expect(result).toBe(dto.complexId);
    }
);

test('has should return false, when entity doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = lookup.has(dto);

        expect(result).toBe(false);
    }
);

test('has should return true, when entity exists',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);
        lookup.add(dto);

        const result = lookup.has(dto);

        expect(result).toBe(true);
    }
);

test('hasKey should return false, when key doesn\'t exist',
    () =>
    {
        const key = new ComplexKey();
        key.id = 'id1';
        key.no = 1;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = lookup.hasKey(key);

        expect(result).toBe(false);
    }
);

test('hasKey should return true, when key exists',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const key = new ComplexKey();
        key.id = dto.complexId.id;
        key.no = dto.complexId.no;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, k => `${k.id}|${k.no}`);
        lookup.add(dto);

        const result = lookup.hasKey(key);

        expect(result).toBe(true);
    }
);

test('add should add a new object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);

        lookup.add(dto);

        expect(lookup.get(dto.id)).toBe(dto);
        expect(lookup.length).toBe(1);
        expect(lookup.isEmpty).toBe(false);
    }
);

test('add should throw an error, if object already exists',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto);

        const action = () => lookup.add(dto);

        expect(action).toThrow();
        expect(lookup.get(dto.id)).toBe(dto);
        expect(lookup.length).toBe(1);
        expect(lookup.isEmpty).toBe(false);
    }
);

test('tryAdd should add a new object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);

        const result = lookup.tryAdd(dto);

        expect(result).toBe(true);
        expect(lookup.get(dto.id)).toBe(dto);
        expect(lookup.length).toBe(1);
        expect(lookup.isEmpty).toBe(false);
    }
);

test('tryAdd should return false, if object already exists',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto);

        const result = lookup.tryAdd(dto);

        expect(result).toBe(false);
        expect(lookup.get(dto.id)).toBe(dto);
        expect(lookup.length).toBe(1);
        expect(lookup.isEmpty).toBe(false);
    }
);

test('delete should remove an object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto);

        lookup.delete(dto);

        expect(lookup.length).toBe(0);
        expect(lookup.isEmpty).toBe(true);
    }
);

test('delete should throw an error, if object doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);

        const action = () => lookup.delete(dto);

        expect(action).toThrow();
        expect(lookup.length).toBe(0);
        expect(lookup.isEmpty).toBe(true);
    }
);

test('deleteByKey should remove an object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto);

        lookup.deleteByKey(dto.id);

        expect(lookup.length).toBe(0);
        expect(lookup.isEmpty).toBe(true);
    }
);

test('deleteByKey should throw an error, if key doesn\'t exist',
    () =>
    {
        const key = 'id';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);

        const action = () => lookup.deleteByKey(key);

        expect(action).toThrow();
        expect(lookup.length).toBe(0);
        expect(lookup.isEmpty).toBe(true);
    }
);

test('clear should remove all objects',
    () =>
    {
        const dto1 = new Dto();
        dto1.id = 'id1';
        const dto2 = new Dto();
        dto2.id = 'id2';
        const dto3 = new Dto();
        dto3.id = 'id3';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto1);
        lookup.add(dto2);
        lookup.add(dto3);

        lookup.clear();

        expect(lookup.length).toBe(0);
        expect(lookup.isEmpty).toBe(true);
    }
);

test('keys should return iterable containing all keys',
    () =>
    {
        const dto1 = new Dto();
        dto1.complexId.id = 'id1';
        dto1.complexId.no = 1;
        const dto2 = new Dto();
        dto2.complexId.id = 'id2';
        dto2.complexId.no = 1;
        const dto3 = new Dto();
        dto3.complexId.id = 'id1';
        dto3.complexId.no = 2;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, c => `${c.id}|${c.no}`);
        lookup.add(dto1);
        lookup.add(dto2);
        lookup.add(dto3);

        const result = Array.from(lookup.keys());

        expect(result.length).toBe(lookup.length);
        expect(result).toContain(dto1.complexId);
        expect(result).toContain(dto2.complexId);
        expect(result).toContain(dto3.complexId);
    }
);

test('values should return iterable containing all objects',
    () =>
    {
        const dto1 = new Dto();
        dto1.complexId.id = 'id1';
        dto1.complexId.no = 1;
        const dto2 = new Dto();
        dto2.complexId.id = 'id2';
        dto2.complexId.no = 1;
        const dto3 = new Dto();
        dto3.complexId.id = 'id1';
        dto3.complexId.no = 2;
        const lookup = new KeyedCollectionLookup<ComplexKey, Dto>('lookup', d => d.complexId, c => `${c.id}|${c.no}`);
        lookup.add(dto1);
        lookup.add(dto2);
        lookup.add(dto3);

        const result = Array.from(lookup.values());

        expect(result.length).toBe(lookup.length);
        expect(result).toContain(dto1);
        expect(result).toContain(dto2);
        expect(result).toContain(dto3);
    }
);

test('iterator symbol should return iterable containing all key-value pairs',
    () =>
    {
        const dto1 = new Dto();
        dto1.id = 'id1';
        const dto2 = new Dto();
        dto2.id = 'id2';
        const dto3 = new Dto();
        dto3.id = 'id3';
        const lookup = new KeyedCollectionLookup<string, Dto>('lookup', d => d.id);
        lookup.add(dto1);
        lookup.add(dto2);
        lookup.add(dto3);

        const result = Array.from(lookup[Symbol.iterator]());

        expect(result.length).toBe(lookup.length);
        expect(result[0].key).toBe(dto1.id);
        expect(result[0].value).toBe(dto1);
        expect(result[1].key).toBe(dto2.id);
        expect(result[1].value).toBe(dto2);
        expect(result[2].key).toBe(dto3.id);
        expect(result[2].value).toBe(dto3);
    }
);
