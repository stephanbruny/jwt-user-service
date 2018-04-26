const jwt = require('jsonwebtoken');

module.exports = config => {
    if (!config)
        throw new Error('Missing configuration');
    if (!config.privateKey && !config.secret)
        throw new Error('Configuration must include either privateKey/publicKey or secret');
    if (config.privateKey && !config.publicKey)
        throw new Error('Missing publicKey in configuration');

    const getExpireTime = duration => Math.floor(Date.now() / 1000) + duration;

    const setExpireTime = exp => data => Object.assign(data, { exp: getExpireTime(exp) });

    const setExpire = setExpireTime(config.expire || 3600);

    const jwtSign = data => {
        const payload = setExpire(data);
        if (config.privateKey) return jwt.sign(payload, config.privateKey, { algorithm: 'RS256' });
        return jwt.sign(payload, config.secret);
    }

    const jwtVerify = token => {
        if (config.publicKey) return jwt.verify(token, config.publicKey, { algorithms: ['RS256'] });
        return jwt.verify(token, config.secret);
    }

    return {
        create: jwtSign,
        verify: jwtVerify
    }
}