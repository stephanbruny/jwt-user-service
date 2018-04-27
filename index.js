#!/usr/bin/env node
const { Maybe } = require('monet');

const Storage = require('./lib/storage');
const User = require('./lib/user');
const Jwt = require('./lib/jwt');
const Token = require('./lib/token');
const Server = require('./lib/server');
const Controller = require('./lib/controller');
const Config = require('./lib/config');

const getConfigJson = () => {
    if (process.env['JWT_USER_SERVICE_CONFIG_FILE']) {
        return module.require(process.env['JWT_USER_SERVICE_CONFIG_FILE']);
    }
    return module.require('./config.json');
}

const startService = async (serviceConfig) => {
    const jwt = Jwt(serviceConfig.jwt);
    const crypt = module.require(serviceConfig['crypt-module']);
    const driver = module.require(serviceConfig['storage-driver']);
    const store = await Storage(driver)(serviceConfig.storage);
    const user = User(store, crypt(serviceConfig.crypt));
    const token = Token(user, jwt);
    const controller = Controller(user, token);
    return Server(serviceConfig.server)(controller);
}

startService(Config(getConfigJson()))
    .then(() => console.log("jwt-user-service running"))
    .catch(err => console.error(err));