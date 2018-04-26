const assert = require('assert');
const Storage = require('../lib/storage');
const LokiDriver = require('../lib/database/fs');
const fs = require('fs');


describe("Storage Module", () => {

    const testDbFile = __dirname + '/data/test.db';

    const getDb = async () => Storage(LokiDriver)({ filename: testDbFile, collection: 'user' });

    it('should initialize API', async () => {
        const db = await getDb();
        assert(db.create);
        assert(db.get);
        assert(db.update);
        assert(db.remove);
    });

    it('should create a document', async () => {
        const db = await getDb();
        const testData = {
            id: 'foo-bar-123',
            foo: 'bar',
            x: 42
        }
        await db.create(testData);
        const doc = await db.get('foo-bar-123');
        assert(doc);
        assert(doc.id);
        const result = await db.get(doc.id);
        assert(result);
        assert.deepEqual(result, doc);
    });

    it('should update a document', async () => {
        const db = await getDb();
        const testData = {
            id: 'blob-123',
            foo: 'bar',
            x: 42
        }
        await db.create(testData);
        const doc = await db.get('blob-123');
        await db.update(doc.id)({ darth: 'Vader' });
        const after = await db.get(doc.id);
        assert.equal(after.darth, 'Vader');
    });

    it('should remove a document', async () => {
        const db = await getDb();
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

    after(() => {
        if (fs.existsSync(testDbFile)) fs.unlinkSync(testDbFile);
    });
});