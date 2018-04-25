const Jwt = require('../lib/jwt');
const assert = require('assert');
const fs = require('fs');

describe('JWT Module', () => {
    it('should return API', () => {
        const jwt = Jwt({ secret: 'FOOBAR' });
        assert(jwt.create);
        assert(jwt.verify);
    });

    it('should encode and decode data', () => {
        const jwt = Jwt({ secret: 'FOOBAR' });
        const data = { foo: 'bar', x: 123 };
        const token = jwt.create(data);
        const decoded = jwt.verify(token);
        assert.equal(decoded.foo, data.foo);
        assert.equal(decoded.x, data.x);
    });

    it('should NOT verify data with invalid secret', () => {
        const jwt = Jwt({ secret: 'FOOBAR' });
        const data = { foo: 'bar', x: 123 };
        const token = jwt.create(data);
        const invalidJwt = Jwt({ secret: 'wrong' });
        assert.throws(() => { invalidJwt.verify(token) });
    });

    it('should NOT verify data with deprecated expiration value', (done) => {
        const jwt = Jwt({ secret: 'FOOBAR', expire: 1 });
        const data = { foo: 'bar', x: 123 };
        const token = jwt.create(data);

        setTimeout(() => {
            assert.throws(() => jwt.verify(token));
            done();
        }, 1000);
    }).timeout(3000).slow(2000);

    it('should encode and decode data with RSA keys', () => {
        const cert = fs.readFileSync(__dirname + '/data/test.cert');
        const key = fs.readFileSync(__dirname + '/data/test.pem');
        const jwt = Jwt({ privateKey: cert, publicKey: key });
        const data = { foo: 'bar', x: 123 };
        const token = jwt.create(data);
        const decoded = jwt.verify(token);
        assert.equal(decoded.foo, data.foo);
        assert.equal(decoded.x, data.x);
    });

    it('should validate configuration on initialization', () => {
        assert.throws(() => Jwt());
        assert.throws(() => Jwt({ foo: 'bar' }));
        assert.throws(() => Jwt({ publicKey: 'bar' }));
    })
});
