const crypto = require('crypto');

module.exports = config => ({
    encode: data => {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        hash.update(config.salt);
        return hash.digest('base64');
    }
})