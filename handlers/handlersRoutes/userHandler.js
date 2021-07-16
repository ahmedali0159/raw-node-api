// dependencies
const data = require('../../lib/data');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const mobileNumber =
    typeof requestProperties.body.mobileNumber === "string" &&
    requestProperties.body.mobileNumber.trim().length === 11
      ? requestProperties.body.mobileNumber
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgrement =
    typeof requestProperties.body.tosAgrement === "boolean" &&
    requestProperties.body.tosAgrement.trim().length > 0
      ? requestProperties.body.tosAgrement
      : false;

      if(firstName && lastName && mobileNumber && password && tosAgrement) {
        data.read('users', mobileNumber, (err, user) => {
            if(err) {
                let userObject = {
                    firstName,
                    lastName,
                    mobileNumber,
                    password,
                    tosAgrement
                }
            } else {
                callback(500, {
                    error: 'There was a problem in server side'
                })
            }
        })
      } else {
          callback(400, {
              error: 'You have a problem in your request'
          })
      }
};

handler._users.get = (requestProperties, callback) => {
  callback(200);
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};
module.exports = handler;
