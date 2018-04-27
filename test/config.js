const assert = require('assert');
const config = require('../lib/config');

describe('Config Module', () => {

    it('should return object as-is, if env not specified', () => {
        const testData = {
            foo: 'bar',
            asdf: {
                a: 'sdf',
                b: { x: 123 }
            },
            bar: 42
        }
        const result = config(testData);
        assert.deepEqual(result, testData);
    });

    it('should return defaults when env not set', () => {
        const testData = {
            foo: { env: 'FOOBAR_NOT_SET', default: 'foobar' },
            bar: { env: 'FOOBAR_BAR_BAR_FOO', default: 1234 }
        }
        const result = config(testData);
        assert.deepEqual(result, {
            foo: 'foobar',
            bar: 1234
        });
    });

    it('should return values from environment', () => {
        const testData = {
            foo: { env: 'TEST_FOO', default: 'no foo here' },
            bar: { env: 'TEST_BAR', default: 1234 }
        }
        process.env['TEST_FOO'] = 'FOOBAR';
        process.env['TEST_BAR'] = 42;

        const result = config(testData);
        assert.deepEqual(result, {
            foo: 'FOOBAR',
            bar: 42
        });
    });

    it('should return mixed values', () => {
        const testData = {
            foo: { env: 'TEST_FOO', default: 'no foo here' },
            bar: { env: 'TEST_BAR', default: 1234 },
            sith: {
                vader: 1,
                maul: 2,
                emperor: { env: 'TEST_SITH_EMPEROR', default: 'Palpatine' }
            },
            jedi: {
                yoda: { env: 'TEST_YODA', default: 42 },
                skywalker: 123
            }
        }
        process.env['TEST_FOO'] = 'FOOBAR';
        delete process.env['TEST_BAR'];
        process.env['TEST_SITH_EMPEROR'] = 'Tanos'; // because no sith stands a chance against all infinity gems

        const result = config(testData);
        assert.deepEqual(result, {
            foo: 'FOOBAR',
            bar: 1234,
            sith: {
                vader: 1,
                maul: 2,
                emperor: 'Tanos'
            },
            jedi: {
                yoda: 42,
                skywalker: 123
            }
        });
    });

});