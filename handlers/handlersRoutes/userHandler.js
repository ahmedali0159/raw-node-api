const data = require('../../lib/data')
const {hash} = require('../../helper/utilities')
const {parseJSON} = require('../../helper/utilities')

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "str" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "str" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === "str" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "str" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgreament =
    typeof requestProperties.body.tosAgreament === "boolean" &&
    requestProperties.body.tosAgreament
      ? requestProperties.body.tosAgreament
      : false;

      if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};
handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "str" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
    if(phone) {
      // lookup the user
      data.read('users', phone, (err, u) => {
        const user = {...parseJSON(u)}
        if(!err && user) {
          delete user.password
          callback(200, user)
        } else {
          callback(404, {
            'error': 'Requested user was not found'
          })
        }
      })
    } else {
      callback(404, {
        'error': 'Requested user was not found'
      })
    } 

};
handler._users.put = (requestProperties, callback) => {
  const firstName =
  typeof requestProperties.body.firstName === "str" &&
  requestProperties.body.firstName.trim().length > 0
    ? requestProperties.body.firstName
    : false;

const lastName =
  typeof requestProperties.body.lastName === "str" &&
  requestProperties.body.lastName.trim().length > 0
    ? requestProperties.body.lastName
    : false;

const phone =
  typeof requestProperties.body.phone === "str" &&
  requestProperties.body.phone.trim().length === 11
    ? requestProperties.body.phone
    : false;

const password =
  typeof requestProperties.body.password === "str" &&
  requestProperties.body.password.trim().length > 0
    ? requestProperties.body.password
    : false;

  if(phone) {
    if(firstName || lastName || password) {
      data.read('users', phone, (err, uData) => {
        const userData = {...parseJSON(uData)}
        if(!err && userData) {
          if(firstName){
            userData.firstName = firstName
          }
          if(lastName){
            userData.lastName = lastName
          }
          if(password){
            userData.password = hash(password)
          }

          data.update('users', phone, userData, () => {
            if(!err) {
              callback(200, {
                "message": 'User was updated successfully'
              })
            } else {
              callback(500, {
                error: 'There was a problem in the server side'
              })
            }
          })

        } else {
          callback(400, {
            'error': 'you have a problem in your request'
          })
        }
      })
    } else {
      callback(400, {
        'error': 'You have a problem in your request'
      }) 
    }
  } else {
   callback(400, {
      'error': 'Invalid phone number. Please try again'
    }) 
  }
};
handler._users.delete = (requestProperties, callback) => {
  const phone =
  typeof requestProperties.queryStringObject.phone === "str" &&
  requestProperties.queryStringObject.phone.trim().length === 11
    ? requestProperties.queryStringObject.phone
    : false;

    if(phone) {
      data.read('users', phone, (err, userData) => {
        if(!err && userData) {
          data.delete('users', phone, (err) => {
            if(!err) {
              callback(200, {
                'message': 'User was successfully deleted'
              })
            } else {
              callback(500, {
                'error': 'There was a server side error'
              })
            }
          })
        } else {
           callback(500, {
             'error': 'There was a server side error'
           })
        }
      })
    } else {
      callback(400, {
        'error': 'There was a problem in your request'
      })
    }
};

module.exports = handler;
