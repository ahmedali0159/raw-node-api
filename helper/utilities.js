const crypto = require("crypto");
//module scaffolding
const utilities = {};
const environments = require('./environments')

// parse json string to object
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// hashing
utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
      const hash = crypto.createHmac("sha256", environments.secretkey).update(str).digest("hex");
      return hash;
  }
      return false;
};

module.exports = utilities;
