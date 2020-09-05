import { KeyedCollection } from '../../src/collections/keyed-collection';
import { KeySelector } from '../../src/collections/key-selector';
import { Stringifier } from '../../src/types/stringifier';
import each from 'jest-each';
import { Undefinable } from '../../src/types';
import { isDefined } from '../../src/functions';
import { Iteration } from '../../src/collections/iteration';

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

test('ctor should create a proper KeyedCollection object',
    () =>
    {
        const name = 'collection';
        const keySelector: KeySelector<string, Dto> = d => d.id;

        const result = new KeyedCollection<string, Dto>(name, keySelector);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.name).toBe(name);
        expect(result.lookupCount).toBe(0);
        expect(result.primaryLookup.length).toBe(0);
        expect(result.primaryLookup.name).toBe(`PLKP_${name}`);
        expect(result.primaryLookup.keySelector).toBe(keySelector);
    }
);

test('ctor should create a proper KeyedCollection object, with custom key stringifier',
    () =>
    {
        const name = 'collection';
        const keySelector: KeySelector<string, Dto> = d => d.id;
        const keyStringifier: Stringifier<string> = k => `key_${k}`;

        const result = new KeyedCollection<string, Dto>(name, keySelector, keyStringifier);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.name).toBe(name);
        expect(result.lookupCount).toBe(0);
        expect(result.primaryLookup.length).toBe(0);
        expect(result.primaryLookup.name).toBe(`PLKP_${name}`);
        expect(result.primaryLookup.keySelector).toBe(keySelector);
        expect(result.primaryLookup.keyStringifier).toBe(keyStringifier);
    }
);

test('get should throw if collection is empty',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const action = () => collection.get('id');

        expect(action).toThrow();
    }
);

test('get should throw if key doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const key = 'id2';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const action = () => collection.get(key);

        expect(action).toThrow();
    }
);

test('get should return a valid entity',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const result = collection.get(dto.id);

        expect(result).toBe(dto);
    }
);

test('tryGet should return null if collection is empty',
    () =>
    {
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = collection.tryGet(new ComplexKey());

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
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, k => `${k.id}|${k.no}`);
        collection.add(dto);

        const result = collection.tryGet(key);

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
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, k => `${k.id}|${k.no}`);
        collection.add(dto);

        const result = collection.tryGet(key);

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
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        dtoRange.forEach(d => collection.add(d));

        const action = () => Array.from(collection.getRange(['id1', 'id3']));

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
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        dtoRange.forEach(d => collection.add(d));

        const result = Array.from(collection.getRange(keys));

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
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        dtoRange.forEach(d => collection.add(d));

        const result = Array.from(collection.tryGetRange(['id1', 'id3', 'id2', 'id4']));

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
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        dtoRange.forEach(d => collection.add(d));

        const result = Array.from(collection.tryGetRange(keys));

        expect(result).toEqual([dtoRange[0], dtoRange[2], dtoRange[1], dtoRange[0], dtoRange[1]]);
    }
);

test('has should return false, when entity doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<ComplexKey, Dto>('loocollectionkup', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = collection.has(dto);

        expect(result).toBe(false);
    }
);

test('has should return true, when entity exists',
    () =>
    {
        const dto = new Dto();
        dto.complexId.id = 'id1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, k => `${k.id}|${k.no}`);
        collection.add(dto);

        const result = collection.has(dto);

        expect(result).toBe(true);
    }
);

test('hasKey should return false, when key doesn\'t exist',
    () =>
    {
        const key = new ComplexKey();
        key.id = 'id1';
        key.no = 1;
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, k => `${k.id}|${k.no}`);

        const result = collection.hasKey(key);

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
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, k => `${k.id}|${k.no}`);
        collection.add(dto);

        const result = collection.hasKey(key);

        expect(result).toBe(true);
    }
);

test('add should add a new object, without additional lookups',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        collection.add(dto);

        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
    }
);

test('add should throw an error, if object already exists, without additional lookups',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const action = () => collection.add(dto);

        expect(action).toThrow();
        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
    }
);

test('add should add a new object, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        collection.add(dto);

        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dto.complexId)).toBe(dto);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(1);
    }
);

test('add should throw an error, if object already exists, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto);

        const action = () => collection.add(dto);

        expect(action).toThrow();
        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dto.complexId)).toBe(dto);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(1);
    }
);

test('addRange should add new objects, without additional lookups',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        collection.addRange(dtos);

        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.get(dtos[2].id)).toBe(dtos[2]);
        expect(collection.length).toBe(3);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(3);
    }
);

test('addRange should throw if any object exists, without additional lookups',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dtos[1]);

        const action = () => collection.addRange(dtos);

        expect(action).toThrow();
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
    }
);

test('addRange should throw if any object\'s key is duplicated, without additional lookups',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        dtos[2].id = dtos[0].id;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const action = () => collection.addRange(dtos);

        expect(action).toThrow();
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.primaryLookup.length).toBe(0);
    }
);

test('addRange should add new objects, with additional lookups',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        collection.addRange(dtos);

        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.get(dtos[2].id)).toBe(dtos[2]);
        expect(collection.length).toBe(3);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(3);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[0].complexId)).toBe(dtos[0]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[1].complexId)).toBe(dtos[1]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[2].complexId)).toBe(dtos[2]);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(3);
    }
);

test('addRange should throw if any object exists, with additional lookups',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dtos[1]);

        const action = () => collection.addRange(dtos);

        expect(action).toThrow();
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[1].complexId)).toBe(dtos[1]);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(1);
    }
);

test('addRange should throw if any object\'s key is duplicated, with additional lookups',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        dtos[2].complexId = dtos[0].complexId;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        const action = () => collection.addRange(dtos);

        expect(action).toThrow();
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.primaryLookup.length).toBe(0);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('tryAdd should add a new object, without additional lookups',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = collection.tryAdd(dto);

        expect(result).toBe(true);
        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
    }
);

test('tryAdd should return false, if object already exists, without additional lookups',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const result = collection.tryAdd(dto);

        expect(result).toBe(false);
        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
    }
);

test('tryAdd should add a new object, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        const result = collection.tryAdd(dto);

        expect(result).toBe(true);
        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dto.complexId)).toBe(dto);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(1);
    }
);

test('tryAdd should throw an error, if object already exists, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto);

        const result = collection.tryAdd(dto);

        expect(result).toBe(false);
        expect(collection.get(dto.id)).toBe(dto);
        expect(collection.length).toBe(1);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dto.complexId)).toBe(dto);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(1);
    }
);

test('tryAddRange should add new objects, without additional lookups',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = Array.from(collection.tryAddRange(dtos));

        expect(result.length).toBe(3);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(result).toContain(dtos[2]);
        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.get(dtos[2].id)).toBe(dtos[2]);
        expect(collection.length).toBe(3);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(3);
    }
);

test('tryAddRange should add only non-existing objects, without additional lookups',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dtos[1]);

        const result = Array.from(collection.tryAddRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[2]);
        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.get(dtos[2].id)).toBe(dtos[2]);
        expect(collection.length).toBe(3);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(3);
    }
);

test('tryAddRange should add only objects without duplicated keys, without additional lookups',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        dtos[2].id = dtos[0].id;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = Array.from(collection.tryAddRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.length).toBe(2);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(2);
    }
);

test('tryAddRange should add new objects, with additional lookups',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        const result = Array.from(collection.tryAddRange(dtos));

        expect(result.length).toBe(3);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(result).toContain(dtos[2]);
        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.get(dtos[2].id)).toBe(dtos[2]);
        expect(collection.length).toBe(3);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(3);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[0].complexId)).toBe(dtos[0]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[1].complexId)).toBe(dtos[1]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[2].complexId)).toBe(dtos[2]);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(3);
    }
);

test('tryAddRange should add only non-existing objects, with additional lookups',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dtos[1]);

        const result = Array.from(collection.tryAddRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[2]);
        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.get(dtos[2].id)).toBe(dtos[2]);
        expect(collection.length).toBe(3);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(3);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[0].complexId)).toBe(dtos[0]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[1].complexId)).toBe(dtos[1]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[2].complexId)).toBe(dtos[2]);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(3);
    }
);

test('tryAddRange should add only objects without duplicated keys, with additional lookups',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        dtos[2].complexId = dtos[0].complexId;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        const result = Array.from(collection.tryAddRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.get(dtos[0].id)).toBe(dtos[0]);
        expect(collection.get(dtos[1].id)).toBe(dtos[1]);
        expect(collection.length).toBe(2);
        expect(collection.isEmpty).toBe(false);
        expect(collection.primaryLookup.length).toBe(2);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[0].complexId)).toBe(dtos[0]);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dtos[1].complexId)).toBe(dtos[1]);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(2);
    }
);

test('delete should remove an object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const result = collection.delete(dto);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('delete should remove an object, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto);

        const result = collection.delete(dto);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('delete should throw an error, if object doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const action = () => collection.delete(dto);

        expect(action).toThrow();
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('deleteByKey should remove an object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const result = collection.deleteByKey(dto.id);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('deleteByKey should remove an object, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto);

        const result = collection.deleteByKey(dto.id);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('deleteByKey should throw an error, if object doesn\'t exist',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const action = () => collection.deleteByKey('id1');

        expect(action).toThrow();
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('deleteRange should remove objects',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addRange(dtos);

        const result = Array.from(collection.deleteRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('deleteRange should throw if at least one object doesn\'t exist',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addRange(dtos);
        dtos.push(new Dto());
        dtos[2].id = 'id3';

        const action = () => collection.deleteRange(dtos);

        expect(action).toThrow();
        expect(collection.length).toBe(2);
        expect(collection.isEmpty).toBe(false);
        expect(collection.get('id1')).toBe(dtos[0]);
        expect(collection.get('id2')).toBe(dtos[1]);
    }
);

test('deleteRange should remove objects, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addRange(dtos);

        const result = Array.from(collection.deleteRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('tryDelete should remove an object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const result = collection.tryDelete(dto);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('tryDelete should remove an object, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto);

        const result = collection.tryDelete(dto);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('tryDelete should return null, if object doesn\'t exist',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = collection.tryDelete(dto);

        expect(result).toBeNull();
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('tryDeleteByKey should remove an object',
    () =>
    {
        const dto = new Dto();
        dto.id = 'id1';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        const result = collection.tryDeleteByKey(dto.id);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('tryDeleteByKey should remove an object, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto);

        const result = collection.tryDeleteByKey(dto.id);

        expect(result).toBe(dto);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('tryDeleteByKey should return null, if object doesn\'t exist',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = collection.tryDeleteByKey('id1');

        expect(result).toBeNull();
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('tryDeleteRange should remove objects',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addRange(dtos);

        const result = Array.from(collection.tryDeleteRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('tryDeleteRange should ignore non-existing objects',
    () =>
    {
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) => d.id = `id${idx + 1}`);
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addRange(dtos);
        dtos.push(new Dto());
        dtos[2].id = 'id3';

        const result = Array.from(collection.tryDeleteRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
    }
);

test('tryDeleteRange should remove objects, with additional lookup',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addRange(dtos);

        const result = Array.from(collection.tryDeleteRange(dtos));

        expect(result.length).toBe(2);
        expect(result).toContain(dtos[0]);
        expect(result).toContain(dtos[1]);
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('clear should remove all objects',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = `cid${idx + 1}`;
            d.complexId.no = idx;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addRange(dtos);

        collection.clear();

        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
    }
);

test('entities should return iterable containing all objects',
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
        const collection = new KeyedCollection<ComplexKey, Dto>('collection', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(dto1);
        collection.add(dto2);
        collection.add(dto3);

        const result = Array.from(collection.entities());

        expect(result.length).toBe(collection.length);
        expect(result).toContain(dto1);
        expect(result).toContain(dto2);
        expect(result).toContain(dto3);
    }
);

test('getLookup should return an existing lookup',
    () =>
    {
        const lookupName = 'lookup';
        const lookupKeySelector: KeySelector<ComplexKey, Dto> = d => d.complexId;
        const lookupKeyStringifier: Stringifier<ComplexKey> = c => `${c.id}|${c.no}`;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, lookupKeySelector, lookupKeyStringifier);

        const result = collection.getLookup<ComplexKey>(lookupName);

        expect(result.length).toBe(0);
        expect(result.keySelector).toBe(lookupKeySelector);
        expect(result.keyStringifier).toBe(lookupKeyStringifier);
        expect(result.name).toBe(`LKP_collection_${lookupName}`);
    }
);

test('getLookup should throw if lookup doesn\'t exist',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const action = () => collection.getLookup('lookup');

        expect(action).toThrow();
    }
);

test('tryGetLookup should return an existing lookup',
    () =>
    {
        const lookupName = 'lookup';
        const lookupKeySelector: KeySelector<ComplexKey, Dto> = d => d.complexId;
        const lookupKeyStringifier: Stringifier<ComplexKey> = c => `${c.id}|${c.no}`;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, lookupKeySelector, lookupKeyStringifier);

        const result = collection.tryGetLookup<ComplexKey>(lookupName)!;

        expect(result.length).toBe(0);
        expect(result.keySelector).toBe(lookupKeySelector);
        expect(result.keyStringifier).toBe(lookupKeyStringifier);
        expect(result.name).toBe(`LKP_collection_${lookupName}`);
    }
);

test('tryGetLookup should return null if lookup doesn\'t exist',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = collection.tryGetLookup('lookup');

        expect(result).toBeNull();
    }
);

test('tryGetLookup should return null if lookup doesn\'t exist',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = collection.tryGetLookup('lookup');

        expect(result).toBeNull();
    }
);

test('hasLookup should return true if lookup exists',
    () =>
    {
        const lookupName = 'lookup';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        const result = collection.hasLookup(lookupName);

        expect(result).toBe(true);
    }
);

test('hasLookup should return false if lookup doesn\'t exist',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const result = collection.hasLookup('lookup');

        expect(result).toBe(false);
    }
);

test('addLookup should add a new lookup',
    () =>
    {
        const lookupName = 'lookup';
        const lookupKeySelector: KeySelector<ComplexKey, Dto> = d => d.complexId;
        const lookupKeyStringifier: Stringifier<ComplexKey> = c => `${c.id}|${c.no}`;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        collection.addLookup(lookupName, lookupKeySelector, lookupKeyStringifier);

        expect(collection.lookupCount).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(0);
        expect(collection.getLookup<ComplexKey>(lookupName).keySelector).toBe(lookupKeySelector);
        expect(collection.getLookup<ComplexKey>(lookupName).keyStringifier).toBe(lookupKeyStringifier);
        expect(collection.getLookup<ComplexKey>(lookupName).name).toBe(`LKP_collection_${lookupName}`);
    }
);

test('addLookup should throw if lookup already exists',
    () =>
    {
        const lookupName = 'lookup';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        const action = () => collection.addLookup(lookupName, d => d.id);

        expect(action).toThrow();
        expect(collection.lookupCount).toBe(1);
    }
);

test('addLookup should add a new lookup, with existing entities in collection',
    () =>
    {
        const lookupName = 'lookup';
        const dto = new Dto();
        dto.id = 'id1';
        dto.complexId.id = 'cid1';
        dto.complexId.no = 1;
        const lookupKeySelector: KeySelector<ComplexKey, Dto> = d => d.complexId;
        const lookupKeyStringifier: Stringifier<ComplexKey> = c => `${c.id}|${c.no}`;
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto);

        collection.addLookup(lookupName, lookupKeySelector, lookupKeyStringifier);

        expect(collection.lookupCount).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).length).toBe(1);
        expect(collection.getLookup<ComplexKey>(lookupName).keySelector).toBe(lookupKeySelector);
        expect(collection.getLookup<ComplexKey>(lookupName).keyStringifier).toBe(lookupKeyStringifier);
        expect(collection.getLookup<ComplexKey>(lookupName).name).toBe(`LKP_collection_${lookupName}`);
        expect(collection.getLookup<ComplexKey>(lookupName).get(dto.complexId)).toBe(dto);
    }
);

test('addLookup should throw if any existing entity lookup key is duplicated',
    () =>
    {
        const lookupName = 'lookup';
        const dtos = [
            new Dto(),
            new Dto()
        ];
        dtos.forEach((d, idx) =>
        {
            d.id = `id${idx + 1}`;
            d.complexId.id = 'cid';
            d.complexId.no = 1;
        });
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addRange(dtos);

        const action = () => collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        expect(action).toThrow();
        expect(collection.lookupCount).toBe(0);
    }
);

test('deleteLookup should remove a lookup',
    () =>
    {
        const lookupName = 'lookup';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);

        collection.deleteLookup(lookupName);

        expect(collection.lookupCount).toBe(0);
    }
);

test('deleteLookup should throw if lookup doesn\'t exist',
    () =>
    {
        const lookupName = 'lookup';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);

        const action = () => collection.deleteLookup(lookupName);

        expect(action).toThrow();
        expect(collection.lookupCount).toBe(0);
    }
);

test('deleteLookup should remove a lookup and clear it from existing entities',
    () =>
    {
        const lookupName = 'lookup';
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(new Dto());
        collection.addLookup(lookupName, d => d.complexId, c => `${c.id}|${c.no}`);
        const lookup = collection.getLookup<ComplexKey>(lookupName);

        collection.deleteLookup(lookupName);

        expect(collection.lookupCount).toBe(0);
        expect(collection.length).toBe(1);
        expect(lookup.length).toBe(0);
    }
);

test('clearLookups should remove all lookups',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup('lookup1', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup2', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup3', d => d.complexId, c => `${c.id}|${c.no}`);

        collection.clearLookups();

        expect(collection.lookupCount).toBe(0);
    }
);

test('clearLookups should remove all lookups and clear them from existing entities',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(new Dto());
        collection.addLookup('lookup1', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup2', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup3', d => d.complexId, c => `${c.id}|${c.no}`);
        const lookups = [
            collection.getLookup<ComplexKey>('lookup1'),
            collection.getLookup<ComplexKey>('lookup2'),
            collection.getLookup<ComplexKey>('lookup3')
        ];

        collection.clearLookups();

        expect(collection.lookupCount).toBe(0);
        lookups.forEach(l => expect(l.length).toBe(0));
    }
);

each([
    ['foo', 'foo'],
    [void(0), 'collection']
])
.test('cloneSchema should create a new collection with the same attributes (%#): name: %s, expected name: %s',
    (name: Undefinable<string>, expectedName: string) =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup('lookup1', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup2', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup3', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.add(new Dto());

        const result = collection.cloneSchema(name);

        expect(result.length).toBe(0);
        expect(result.name).toBe(expectedName);
        expect(result.primaryLookup.keySelector).toBe(collection.primaryLookup.keySelector);
        expect(result.primaryLookup.keyStringifier).toBe(collection.primaryLookup.keyStringifier);
        expect(result.lookupCount).toBe(collection.lookupCount);

        for (const lookupName of result.lookupNames())
        {
            const resultLookup = result.getLookup(lookupName);
            const collectionLookup = collection.tryGetLookup(lookupName);
            expect(collectionLookup).not.toBeNull();
            expect(resultLookup.name).toBe(`LKP_${expectedName}_${lookupName}`);
            expect(resultLookup.keySelector).toBe(collectionLookup!.keySelector);
            expect(resultLookup.keyStringifier).toBe(collectionLookup!.keyStringifier);
        }
    }
);

test('lookupNames should return all existing lookup names',
    () =>
    {
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.addLookup('lookup1', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup2', d => d.complexId, c => `${c.id}|${c.no}`);
        collection.addLookup('lookup3', d => d.complexId, c => `${c.id}|${c.no}`);

        const result = Array.from(collection.lookupNames());

        expect(result.length).toBe(3);
        expect(result).toContain('lookup1');
        expect(result).toContain('lookup2');
        expect(result).toContain('lookup3');
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
        const collection = new KeyedCollection<string, Dto>('collection', d => d.id);
        collection.add(dto1);
        collection.add(dto2);
        collection.add(dto3);

        const result = Array.from(collection[Symbol.iterator]());

        expect(result.length).toBe(collection.length);
        expect(result[0].key).toBe(dto1.id);
        expect(result[0].value).toBe(dto1);
        expect(result[1].key).toBe(dto2.id);
        expect(result[1].value).toBe(dto2);
        expect(result[2].key).toBe(dto3.id);
        expect(result[2].value).toBe(dto3);
    }
);
