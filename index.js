// Title: Uptime Monitoring Application
// Description: A Restful API to monitor up or down of user defined links
// Author: Ahmed Ali
// Date: 14/07/2021

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helper/handleReqRes');

// app object
const app = {};

// configuration
app.config = {
    port: 5000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`)
    });
}  

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
