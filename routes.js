// dependencies
const {sampleHandler} = require('./handlers/handlersRoutes/sampleHandler');
const {userHandler} = require('./handlers/handlersRoutes/userHandler');
const routes = {
    sample: sampleHandler,
    user: userHandler
};

module.exports = routes;