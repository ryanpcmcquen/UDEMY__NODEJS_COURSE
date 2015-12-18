var mongoose = require('mongoose');
var NodePbkdf2 = require('node-pbkdf2'),
  hasher = new NodePbkdf2({
    iterations: 10000,
    saltLength: 12,
    derivedKeyLength: 30
  });
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


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  hasher(candidatePassword, hash, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
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
  hasher(newUser.password, function(err, hash) {
    if (err) {
      throw err;
    }
    // set hashed pw
    newUser.password = hash;
    // create user
    newUser.save(callback);
  });
};
