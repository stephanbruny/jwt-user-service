const User = require('../lib/user');
const assert = require('assert');
const Storage = require('../lib/storage');
const MockDriver = require('./mock-db');

describe('User module', () => {

    const mockCrypt = {
        encode: data => data,
        decode: data => data
    }

    const storage = Storage(MockDriver);

    it('should initialize API', async () => {
        const user = await User(await storage({}));
        assert(user.create);
        assert(user.login);
    });

    it('should create a user', async () => {
        const user = await User(await storage({}), mockCrypt);
        const testUser = await user.create('test', 'test', { foo: 'bar' });
        assert(testUser.isRight())
        assert.equal(testUser.right().foo, 'bar');
    });

    it('should login/verify a user by credentials', async () => {
        const user = await User(await storage({}), mockCrypt);
        await user.create('foo', 'foobar', { foo: 'bar' });
        const testUser = await user.login('foo', 'foobar');
        assert(testUser.isRight());
        assert.equal(testUser.right().foo, 'bar');
    });

    it('should fail with invalid credentials', async () => {
        const user = await User(await storage({}), mockCrypt);
        await user.create('foo', 'foobar', { foo: 'bar' });
        const eitherUser = await user.login('foo', 'wrong password');
        assert(eitherUser.isLeft());
    });

});