var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var generator = require('generate-password');
const nodemailer = require('nodemailer');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('favbook');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.verifyToken = verifytoken;
service.reset=reset;
service.savebook=savebook;
service.removebook=removebook;
module.exports = service;

function savebook(userParam) {
  var deferred = Q.defer();
    // fields to update
    var bookinfo =  userParam.bookdetails;
   var _id = userParam.id;
    db.users.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $addToSet: { favbook:  bookinfo}},
        function (err, doc) {
          console.log(err)
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
        return deferred.promise;
}

function removebook(userParam) {
  var deferred = Q.defer();
    // fields to update
    var bookinfo =  userParam.bookdetails;
   var _id = userParam.id;
   var bookid=userParam.bookid;
    db.users.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $pull: { favbook: {id: bookid}}},
        function (err, doc) {
          console.log(err)
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
        return deferred.promise;
}

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
          if (user.state=='active'){
            // authentication successful
            console.log(jwt.sign)
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));

          }
            else{
                deferred.resolve();
            }

        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);

            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
function verifytoken(_id){
  var deferred = Q.defer();

// validation

    // fields to update
    var set = {
        state:'active'
    };
    db.users.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });


return deferred.promise;

}

function reset(username){
  var deferred = Q.defer();
   var _id="";
db.users.findOne({ username: username }, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);
      _id=user._id;
});
let password = generator.generate({
length: 10,
numbers: true
});


console.log(password);


var set={};
    // fields to update
    set.hash = bcrypt.hashSync(password, 10);


    db.users.update(
        { username: username },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
          }
        )
        var smtpTrans = nodemailer.createTransport({
           service: 'Gmail',
           auth: {
            user: 'webprogram1234@gmail.com',
            pass: 'Abc@1234'
          }
        });
        console.log(_id);
        console.log(password);
        smtpTrans.sendMail({
          from: 'webprogram1234@gmail.com',
          to: username,
          subject:'Forgot Password',
          text:'Hi \n\n'+"Your new password is :\n\n" +
            password.toString()+ '\n\n'
});



return deferred.promise;
}
