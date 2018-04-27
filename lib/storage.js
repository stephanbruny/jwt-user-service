const uuid = require('uuid');

class StorageError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'StorageError'
        Error.captureStackTrace(this, StorageError);
    }
}

module.exports = (dbDriver) => async (config) => {
    const db = await dbDriver(config);

    const createDocument = data => {
        if (!data.id) return Object.assign(data, { id: uuid.v4() });
        return data;
    }

    const tryStorage = applicative => async (...args) => {
        try {
            const result = await applicative(...args);
            return result;
        } catch (ex) {
            throw new StorageError(ex.message);
        }
    }

    return {
        create: tryStorage(async (data) => db.insert(createDocument(data))),
        get: tryStorage(async id => db.findOne(id)),
        update: id => tryStorage(async changes => db.update(id, changes)),
        remove: tryStorage(async id => db.remove(id)),
        list: tryStorage(async (skip, limit, sort) => db.find({}, { skip, limit, sort }))
    }
}