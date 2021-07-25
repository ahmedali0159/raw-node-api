// Title: Uptime Monitoring Application
// Description: A Restful API to monitor up or down of user defined links
// Author: Ahmed Ali
// Date: 14/07/2021

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helper/handleReqRes');
const environment = require('./helper/environments');
const data = require('./lib/data')


// app object
const app = {};

// testing file system
 data.delete('test', 'newFile', (err) => {
    console.log(err)
 })


// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`)
    });
}  

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
