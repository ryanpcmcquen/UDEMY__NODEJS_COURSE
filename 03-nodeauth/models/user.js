var mongoose = require('mongoose');
var crypto = require('crypto');
var hash = crypto
  .createHash("sha512")
  .update(req.body.pass)
  .digest('hex');
mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// user schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileimage: {
    type: String
  }
});



UserSchema.methods = {


  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  ,

  /**
   * Validation is not required if using OAuth
   */

  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }
};

var User = module.exports = mongoose.model('User', UserSchema);

// module.exports.comparePassword = function(candidatePassword, hash, callback) {
//   hasher(candidatePassword, hash, function(err, isMatch) {
//     if (err) {
//       return callback(err);
//     }
//     callback(null, isMatch);
//   });
// };

module.exports.comparePassword = function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
};


module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
};


module.exports.createUser = function(newUser, callback) {
  // hasher(newUser.password, function(err, hash) {
  encryptPassword = function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha512', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
    // set hashed pw
    newUser.password = hash;
    // create user
    newUser.save(callback);
  }
};
