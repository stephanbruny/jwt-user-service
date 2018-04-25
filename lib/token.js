const { Either } = require('monet');

module.exports = (user, jwt) => {
    return {
        generate: async (username, password) => {
            const eitherUser = await user.login(username, password);
            return eitherUser.cata(
                err => Either.Left(err),
                userData => Either.Right(jwt.create(userData))
            );
        },
        decode: (token) => {
            try {
                return Either.Right(jwt.verify(token));
            } catch (ex) {
                return Either.Left(ex);
            }
        }
    }
}