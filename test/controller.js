const User = require('../lib/user');
const Jwt = require('../lib/jwt');
const Token = require('../lib/token');
const assert = require('assert');
const Storage = require('../lib/storage');
const MockDriver = require('../lib/database/fs');
const Controller = require('../lib/controller');

describe('Controller Module', () => {
    const jwt = Jwt({ secret: 'foo bar 123' });

    const mockCrypt = {
        encode: data => data,
        decode: data => data
    }

    const init = async () => {
        const user = User(await Storage(MockDriver)({}), mockCrypt);
        const token = Token(user, jwt);
        return Controller(user, token);
    }

    it('should initialize controller', async () => {
        const controller = await init();
        assert(controller.get);
        assert(controller.get['/']);
        assert(controller.post);
        assert(controller.post['/']);
        assert(controller.post['/token']);
        assert(controller.put);
        assert(controller.put['/:userId']);
    });

    it('should create a user from post request', async () => {
        const controller = await init();
        const created = await controller.post['/']({}, { username: 'foo', password: 'bar' });
        assert(created.isRight());
        const res = await controller.post['/token']({}, { username: 'foo', password: 'bar' });
        assert(res.isRight())
    });

    it('should update a user from put request', async () => {
        const controller = await init();
        const created = await controller.post['/']({}, { username: 'foo', password: 'bar' });
        assert(created.isRight())
        const changed = await controller.put['/:userId']({ userId: 'foo' }, { address: 'home' });
        assert(changed.isRight())
        const token = await controller.post['/token']({}, { username: 'foo', password: 'bar' });
        assert(token.isRight());
        const data = jwt.verify(token.right());
        assert.equal(data.address, 'home');
    });

});