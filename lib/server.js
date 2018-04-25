const express = require('express');
const bodyParser = require('body-parser');

const { Maybe, Either } = require('monet');

module.exports = config => routes => {
    const app = express();

    app.use(bodyParser.json());

    const eitherResponse = res => either => either.cata(
        err => {
            res.status(err.code || 500);
            return res.json(err);
        },
        result => {
            return res.json(result);
        }
    );

    const action = applicative => (req, res) => {
        const reply = eitherResponse(res);
        return applicative(req.params, req.body)
            .then(reply)
            .catch(err => reply(Either.Left(err)))
    }

    const isAsyncOrPromise = fn =>
        fn instanceof Promise || fn.constructor.name === 'AsyncFunction'

    const initializeRoutes = expressApp => routeObject => {
        Object.keys(routeObject).forEach(verb => {
            Maybe.fromNull(expressApp[verb])
                .bind(verbFn => {
                    const verbRoutes = routeObject[verb];
                    Object.keys(verbRoutes).forEach(routePath => {
                        const routeAction = verbRoutes[routePath];
                        if (isAsyncOrPromise(routeAction)) {
                            return verbFn.bind(expressApp)(routePath, action(routeAction));
                        }
                        throw new Error('Action must be async/Promise')
                    });
                    return Maybe.Some({});
                })
                .toEither().cata(
                    () => { throw new Error(`'${verb}' is not a valid HTTP-verb supported by express`) },
                    () => { /* OK */ }
                )
        });
    }

    initializeRoutes(app)(routes);

    return app.listen(config.port);
}