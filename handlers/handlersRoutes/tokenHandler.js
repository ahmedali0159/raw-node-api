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
 
};
handler._token.delete = (requestProperties, callback) => {
 
};

module.exports = handler;
