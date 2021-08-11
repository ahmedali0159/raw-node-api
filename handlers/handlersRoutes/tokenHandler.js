const data = require('../../lib/data')
const { hash } = require('../../helper/utilities')
const { createRandomString } = require('../../helper/utilities')
const { parseJSON } = require('../../helper/utilities')

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
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

      if(phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password)
            if(hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20)
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject = {
                    phone,
                    "id": tokenId,
                    expires: expires
                }

                // store the token
                data.create('tokens', tokenId, tokenObject, (err) => {
                    if(!err) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side',
                        });
                    }
                })
            } else {
                callback(400, {
                    error: 'Password is not valid',
                });
            }
        })
      } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
      }
}
 
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "str" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
    if(id) {
      // lookup the user
      data.read('tokens', phone, (err, tokenData) => {
        const token = {...parseJSON(tokenData)}
        if(!err && token) {
          callback(200, token)
        } else {
          callback(404, {
            'error': 'Requested token was not found'
          })
        }
      })
    } else {
      callback(404, {
        'error': 'Requested token was not found'
      })
    } 

};
handler._token.put = (requestProperties, callback) => {
  const id =
  typeof requestProperties.queryStringObject.id === "str" &&
  requestProperties.queryStringObject.id.trim().length === 20
    ? requestProperties.queryStringObject.id
    : false;

    const extend =
    typeof requestProperties.queryStringObject.extend === "boolean" &&
    requestProperties.queryStringObject.extend.trim().length === true
      ? true
      : false;

      if(id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
          let tokenObject = parseJSON(tokenData);
          if(tokenData(tokenData).expires > date.now()) {
            tokenObject.expires = date.now() + 60 * 60 * 1000;
            // store the updated token
            data.update('tokens', id, tokenObject, (err2) => {
              if(!err2) {
                callback(200)
              } else {
                callback(500, {
                  'error': 'Server side error'
                })
              }
            })
          } else {
            callback(404, {
              'error': 'Token already expired'
            })
          }
        })
      } else {
        callback(400, {
          'error': 'There was a problem in your request'
        })
      }
};
handler._token.delete = (requestProperties, callback) => {
  const id =
  typeof requestProperties.queryStringObject.id === "str" &&
  requestProperties.queryStringObject.id.trim().length === 20
    ? requestProperties.queryStringObject.id
    : false;

    if(phone) {
      data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData) {
          data.delete('tokens', id, (err) => {
            if(!err) {
              callback(200, {
                'message': 'token was successfully deleted'
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

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if(!err && tokenData) {
      if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > date.now()) {
        callback(true)
      } else {
        callback(false)
      }
    } else {
       callback(false)
    }
  })
}

module.exports = handler;
