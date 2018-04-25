let mockDriverData = [];

const mockQuery = query => item => Object.keys(query).every(key => query[key] === item[key]);

const mockFindOne = query => mockDriverData.find(mockQuery(query));

module.exports = async () => ({
    insert: data => {
        mockDriverData.push(data);
        return data;
    },
    findOne: mockFindOne,
    update: (query, changes) => {
        const idx = mockDriverData.findIndex(mockQuery(query));
        if (idx === -1) {
            throw new Error(`Cannot find item with ${JSON.stringify(query)}`);
        }
        Object.assign(mockDriverData[idx], changes);
        return mockDriverData[idx];
    },
    remove: query => {
        const idx = mockDriverData.findIndex(mockQuery(query));
        if (idx === -1) throw new Error(`Cannot find item with ${JSON.stringify(query)}`);
        mockDriverData.splice(idx, 1);
    }
})