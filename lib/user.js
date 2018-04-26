const { Maybe, Either } = require('monet');

module.exports = (storage, crypt) => {

    const maybeUser = async username => Maybe.fromNull(await storage.get(username));

    const tryEither = applicative => async (...args) => {
        try {
            const result = await applicative(...args);
            return Either.Right(result);
        } catch (ex) {
            return Either.Left(ex);
        }
    }

    const createUser = async (username, password, userData = {}) => {
        const user = Object.assign(userData, {
            id: username,
            password: crypt.encode(password)
        });
        return storage.create(user);
    }

    const verifyCredentials = user => password => {
        const encodedPassword = crypt.encode(password);
        return (encodedPassword === user.password) ? Either.Right(user) : Either.Left();
    }

    const login = async (username, password) => {
        return (await maybeUser(username))
            .bind(user => verifyCredentials(user)(password))
            .cata(
                () => Either.Left('Invalid credentials'),
                (user) => {
                    let result = Object.assign({}, user);
                    delete result.password;
                    return Either.Right(result);
                }
            );
    }

    const modify = async (username, changes) => storage.update(username)(changes);

    return {
        create: async (username, password, data) => tryEither(createUser)(username, password, data),
        modify: tryEither(modify),
        login
    }
}