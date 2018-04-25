const Server = require('../lib/server');
const assert = require('assert');

const { Either } = require('monet');
const request = require('request-promise-native');

describe('Server Module', () => {

    const initServer = Server({ port: 1337 });

    it('should initialize server', async () => {
        const server = initServer({
            get: {
                '/': async (query, params) => Either.Right(params)
            }
        });
        server.close();
    });

    it('should fail to initialize server with invalid http verb', async () => {
        assert.throws(() => {
            const server = initServer({
                get: {
                    '/': async (query, params) => Either.Right(params)
                },
                foo: { '/foo' : async () => {} }
            });
            server.close();
        });
    });

    it('should fail to initialize server with non-async action', async () => {
        assert.throws(() => {
            const server = initServer({
                get: {
                    '/': (query, params) => Either.Right(params)
                }
            });
            server.close();
        });
    });

    it('should execute a route', async () => {
        const server = initServer({
            get: {
                '/': async (query, params) => Either.Right(params),
                '/:message': async (query, params) => Either.Right({ message: query.message })
            }
        });

        await request('http://localhost:1337/', { json: true });
        const res = await request('http://localhost:1337/hello', { json: true });
        assert.deepEqual(res, { message: 'hello' });

        server.close();
    });

    it('should process json data from body', async () => {
        const server = initServer({
            post: {
                '/': async (query, params) => Either.Right({ request: params }),
            }
        });

        const res = await request.post('http://localhost:1337/', { json: true, body: { foo: 'bar' } });
        assert.deepEqual(res.request, { foo: 'bar' });
        server.close();
    });

})