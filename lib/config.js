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

module.exports = getConfigValue;
