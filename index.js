const crypto = require('crypto');

const { Maybe } = require('monet');

const Storage = require('./lib/storage');
const User = require('./lib/user');
const Jwt = require('./lib/jwt');
const Token = require('./lib/token');
const Server = require('./lib/server');
const Controller = require('./lib/controller');
const FsDriver = require('./lib/database/fs');

const getConfigValue = configObject => {
    if (configObject) {
        if(configObject.env) {
            return process.env[configObject.env] || configObject.default;
        }
        if (typeof configObject === 'object') {
            let result = {};
            Object.keys(configObject).forEach(key => {
                result[key] = getConfigValue(configObject[key]);
            })
            return result;
        }
    }
    return configObject;
}

const config = require('./config.json');

// TODO: Salt
const crypt = {
    encode: data => {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('base64');
    },
    decode: () => {}
}

const startService = async (serviceConfig) => {
    const jwt = Jwt(serviceConfig.jwt);
    const store = await Storage(FsDriver)(serviceConfig.storage);
    const user = User(store, crypt);
    const token = Token(user, jwt);
    const controller = Controller(user, token);
    return Server(serviceConfig.server)(controller);
}

startService(getConfigValue(config))
    .then(() => console.log("jwt-user-service running"))
    .catch(err => console.error(err));