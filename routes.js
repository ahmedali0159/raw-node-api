// dependencies
const {sampleHandler} = require('./handlers/handlersRoutes/sampleHandler');
const {userHandler} = require('./handlers/handlersRoutes/userHandler')
const {tokenHandler} = require('./handlers/handlersRoutes/tokenHandler')

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
};

module.exports = routes;