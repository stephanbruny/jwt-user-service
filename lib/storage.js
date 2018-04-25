const uuid = require('uuid');

module.exports = (dbDriver) => async (config) => {
    const db = await dbDriver(config);

    const createDocument = data => {
        if (!data.id) return Object.assign(data, { id: uuid.v4() });
        return data;
    }

    return {
        create: async data => db.insert(createDocument(data)),
        get: async id => db.findOne({ id }),
        update: id => async changes => db.update({ id }, changes),
        remove: async id => db.remove({ id }),
        list: async (skip, limit, sort) => db.find({}, { skip, limit, sort })
    }
}