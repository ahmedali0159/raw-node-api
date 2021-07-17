// dependencies
   const data = require('../../lib/data');
   const {hash} = require('../../helper/utilities');
// const {parseJSON} = require('../../helper/utilities');


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
   const firstName = typeof(requestProperties.body.firstName) === "string" && requestProperties.firstName.trim().length > 0
   ? requestProperties.body.firstName : false;

   const lastName = typeof(requestProperties.body.lastName) === "string" && requestProperties.lastName.trim().length > 0
   ? requestProperties.body.lastName : false;

   const phone = typeof(requestProperties.body.phone) === "string" && requestProperties.phone.trim().length === 11
   ? requestProperties.body.phone : false;

   const password = typeof(requestProperties.body.password) === "string" && requestProperties.password.trim().length > 0
   ? requestProperties.body.password : false;

   const toAgreament = typeof(requestProperties.body.toAgreament) === "boolean" && requestProperties.toAgreament.trim().length > 0
   ? requestProperties.body.toAgreament : false;

    if (firstName && lastName && phone &&  password && toAgreament) {
      data.read('users', phone, (err, user) => {
        if(err) {
            const userObject = {
              firstName,
              lastName,
              phone,
              password: hash(password),
              toAgreament
            };
            data.create('users', phone, userObject, (err) => {
              if (!err) {
                callback(200, {
                  'message': 'Users was created successfully'
                })
              } else {
                callback(500, {
                  'error': 'Could not create  user'
                })
              }
            }) 
        } else {
          callback(500, {
            'error': 'There was a problem in server side'
          })
        }
      })
    } else {
      callback(400, {
        error: 'You have a problem in your request'
      })
    }
    };

//       if(firstName && lastName && phone && password && toAgrement) {
//         data.read('users', phone, (err, user) => {
//             if(err) {
//                 let userObject = {
//                     firstName,
//                     lastName,
//                     phone,
//                     password: hash(password),
//                     tosAgrement
//                 }
//                 // stored the user to database
//                 data.create('users', phone, userObject), (err) => {
//                     if(!err) {
//                             callback(200, {
//                                 'message': 'Users was created successfully'
//                             })
//                     } else {
//                         callback(500, {
//                             'error': 'Could not create users'
//                         })
//                     }
//                 };
//             } else {
//                 callback(500, {
//                     'error': 'There was a problem in server side'
//                 })
//             }
//         })
//       } else {
//           callback(400, {
//              ' error': 'You have a problem in your request'
//           })
//       }
 

 handler._users.get = (requestProperties, callback) => {
  callback(200);
  // const phone =
  // typeof requestProperties.queryStringObject.phone === "string" &&
  // requestProperties.queryStringObject.phone.trim().length === 11
  //   ? requestProperties.queryStringObject.phone
  //   : false;

  //   if(phone) {
  //       data.read('users', phone, (err, u) => {
  //         const user = {...parseJSON(u)}
  //         if(!err && user) {
  //           delete  user.password;
  //           callback(200, user);
  //         } else {
  //           callback(404, {
  //             'error': 'requsted user was not found'
  //           })
  //         }
  //       })
  //   } else {
  //       callback(404, {
  //         'error': 'requsted user was not found'
  //       })
  //   }
};

// handler._users.put = (requestProperties, callback) => {};

// handler._users.delete = (requestProperties, callback) => {};
 module.exports = handler;


