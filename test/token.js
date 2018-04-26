const User = require('../lib/user');
const Jwt = require('../lib/jwt');
const Token = require('../lib/token');
const assert = require('assert');
const Storage = require('../lib/storage');
const MockDriver = require('../lib/database/fs');

describe('Token module', () => {

    const mockCrypt = {
        encode: data => data,
        decode: data => data
    }

    const storage = Storage(MockDriver);
    const jwt = Jwt({ secret: 'foobar' });

    const init = async () => {
        const user = await User(await storage({}), mockCrypt);
        return [Token(user, jwt), user];
    }

    it('should initialize API', async () => {
        const [token] = await init();
        assert(token.generate);
    });

    it('should generate token from user', async () => {
        const [token, user] = await init();
        await user.create('test', 'test', { address: 'foosen 123' });
        const tokenString = await token.generate('test', 'test');
        assert(tokenString.isRight());

        const decoded = jwt.verify(tokenString.right());
        assert.equal(decoded.address, 'foosen 123');
        assert.equal(decoded.id, 'test');
    });

    it('should decode a token', async () => {
        const [token, user] = await init();
        await user.create('test', 'test', { address: 'foosen 123' });
        const tokenString = await token.generate('test', 'test');
        assert(tokenString.isRight());

        const decoded = token.decode(tokenString.right());
        assert(decoded.isRight());
        const userDecoded = decoded.right();
        assert.equal(userDecoded.address, 'foosen 123');
        assert.equal(userDecoded.id, 'test');
    });

});