const assert = require('assert');
const Storage = require('../lib/storage');
const MockDriver = require('../lib/database/fs');

describe("Storage Module", () => {

    it('should initialize API', async () => {
        const db = await Storage(MockDriver)({});
        assert(db.create);
        assert(db.get);
        assert(db.update);
        assert(db.remove);
    });

    it('should create a document', async () => {
        const db = await Storage(MockDriver)({});
        const testData = {
            foo: 'bar',
            x: 42
        }
        const doc = await db.create(testData);
        assert(doc);
        assert(doc.id);
        const result = await db.get(doc.id);
        assert(result);
        assert.deepEqual(result, doc);
    });

    it('should update a document', async () => {
        const db = await Storage(MockDriver)({});
        const testData = {
            foo: 'bar',
            x: 42
        }
        const doc = await db.create(testData);
        await db.update(doc.id)({ darth: 'Vader' });
        const after = await db.get(doc.id);
        assert.equal(after.darth, 'Vader');
    });

    it('should remove a document', async () => {
        const db = await Storage(MockDriver)({});
        const testData = [
            { 'foo': 'bar', id: 'foo' },
            { 'foo': 'blob', id: 'bar' }
        ]
        await Promise.all(testData.map(db.create));
        await db.remove('foo');
        const foo = await db.get('foo');
        assert.equal(foo, null);
        const bar = await db.get('bar');
        assert.deepEqual(bar, testData[1]);
    });

    it('should NOT insert a new document with duplicated id', async () => {
        const db = await Storage(MockDriver)({});
        const testData = {
            id: 'foosen',
            foo: 'bar',
            x: 42
        }
        await db.create(testData);
        try {
            await db.create({ id: 'foosen', bar: 'foo' });
        } catch (ex) {
            assert.equal(ex.constructor.name, 'StorageError');
        }
    });
});