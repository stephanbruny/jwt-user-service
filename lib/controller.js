const { Either } = require('monet');

module.exports = (User, Token) => {
    return {
        get: {
            '/': async (query, params) => {},
        },
        post: {
            '/': async (query, params) => {
                const result = await User.create(params.username, params.password, params.userData);
                return result.cata(
                    (err) => {
                        console.log(err)
                        return Either.Left(err);
                    },
                    () => Either.Right({ successful: true })
                );
            },
            '/token': async (query, params) => Token.generate(params.username, params.password)
        },
        put: {
            '/:userId': async(query, params) => User.modify(query.userId, params),
            '/:userId/password': async(query, params) => User.changePassword(query.userId, params)
        }
    };
}