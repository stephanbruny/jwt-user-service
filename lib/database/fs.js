const { Maybe } = require('monet');
const merge = require('deepmerge');
const fs = require('fs');
const { EventEmitter } = require('events');

module.exports = async (config) => {
    const DriverEvents = new EventEmitter();

    let driverData = [];

    const execQuery = query => item => Object.keys(query).every(key => query[key] === item[key]);

    const findOne = query => driverData.find(execQuery(query));

    Maybe.fromNull(config.filename)
        .bind(filename => {
            if (fs.existsSync(filename)) {
                const fileData = fs.readFileSync(filename, 'utf8');
                driverData = JSON.parse(fileData);
            }

            const onDataChange = (item, all) => {
                fs.writeFileSync(filename, JSON.stringify(all), 'utf8');
            }
            ['added', 'changed', 'removed'].forEach(ev => DriverEvents.on(ev, onDataChange));
        });

    return {
        insert: data => {
            driverData.push(data);
            DriverEvents.emit('added', data, driverData);
            return data;
        },
        findOne: id => findOne({ id }),
        update: (id, changes) => {
            const idx = driverData.findIndex(execQuery({ id }));
            if (idx === -1) {
                throw new Error(`Cannot find item with id ${id}`);
            }
            Object.assign(driverData[idx], merge(driverData[idx], changes));
            DriverEvents.emit('changed', driverData[idx], driverData);
            return driverData[idx];
        },
        remove: id => {
            const idx = driverData.findIndex(execQuery({ id }));
            if (idx === -1) throw new Error(`Cannot find item with ${JSON.stringify(query)}`);
            DriverEvents.emit('removed', Object.assign({}, driverData[idx]), driverData);
            driverData.splice(idx, 1);
        }
    }
};