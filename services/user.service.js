var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var util = require("util");
db.bind('users');

var sqldb = require("./db.service");


var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getGroupList = getGroupList
module.exports = service;



function getGroupList(param) {
    var deferred = Q.defer();
    console.log("sqldb executed!")
    sqldb.executeSql("select * from GRP", function ( group, err) {
        if (err) {
            console.log('error message is: '+err);
            deferred.reject(err.name + ': ' + err.message);
            //customizedMsg.Msg500(req, rsp, err);
            // rsp.writeHead(500, "Internal Error", { "Content-Type": "application/json" });
            // rsp.write(JSON.stringify({ data: " Interanl Error Occured:" + err }));
        } 

        if(group){
            console.log('group message is: '+group);
            deferred.resolve(group)
        }
        else{
            deferred.resolve();
        }
      

    });
    return deferred.promise;
};

function authenticate(username, password) {
// function authenticateUser(username, password){
    var deferred = Q.defer();
    console.log('username is ' + username + ', password is ' + password);
    sqldb.executeSql( "select * from CUSTM_USR where EMP_NO = " +username, function(user, err){
        if (err) deferred.reject(err.name + ': ' + err.message);
        // if( user ){
        //     for( var key in user[0] ){
        //         if ( user[0].hasOwnProperty(key)){
        //         console.log('authenticate, user[0][' + key + '] = '+user[0][key])
        //     }
        //   }
        // }

        
        console.log('user[0][pwd] is '+ user[0]['PWD']);
        bcrypt.compare(password,user[0]['PWD'].trim(),function(err,result){
        //bcrypt.compare('121','$2a$10$H8A70LuIMnuwAQ06IjWwjOtGaru68DzDGdUIo5uEqwSlospaIrfHm',function(err,result){
                

                if(err) throw err;
                //isPwdSynced = result;
                console.log( 'bcrypt.compare result is ' + result);

                if (user && result ) {
                    console.log('authentication successfully, and user._id is ' + user[0]['CUSTM_USRID']);
                            // authentication successful
                            deferred.resolve(jwt.sign({ sub: user[0]['CUSTM_USRID'] }, config.secret));
                } else {
                            // authentication failed
                            deferred.resolve();
                        }

            });
      
       
    });
    return deferred.promise;

}



function getById(userID) {
// function getCustomUserById(userId){
    var deferred = Q.defer();
    console.log('getById is invoked now!');
    console.log("get custom userid is invoked and id is " + userID);
    sqldb.executeSql( "select * from CUSTM_USR where CUSTM_USRID = " + parseInt(userID), function(user, err){
        if( err ){
            
            deferred.reject(err.name + ': ' + err.message);
        }
        console.log('user is User[PWD]');
        if (user) {
            //  return user pwd without hash

            // return user (without hashed password)
            for( var key in user[0] ){
                if ( user[0].hasOwnProperty(key)){
                console.log('getbyid, user[' + key + '] = '+user[0][key]);
                }
            }
            deferred.resolve(_.omit(user, 'hash'));
            console.log('omit user hash is ' + _.omit(user, 'PWD')[0]['PWD']);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}




function create( userParam ){
    var deferred = Q.defer();
    console.log("sql db executed! and userParam is "+ userParam.password);
    sqldb.executeSql( "select * from CUSTM_USR where EMP_NO = " + userParam.username, function(user, err){
        if( err ){
            console.log('error message is: ' + err.message);
        }
        if (user) {
            for( var key in user ){
                if ( user.hasOwnProperty(key)){
                console.log('after query for emp in create, user[' + key + '] = '+user[key]);
                }
            }
        }
        if (user === undefined) {
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
        console.log("before bcrypt.hashSync and userParam is "+ userParam.password);
        bcrypt.genSalt(8,function(err,salt){
            bcrypt.hash ( userParam.password, salt, function(err, hash){
                if( err ) throw err;
                console.log('createUser hash value is '+ hash);

                bcrypt.compare( userParam.password, hash, function(err, result){
                    if (err) throw err;

                    console.log('bcrypt.compare returns '+ result);
                });
                //*******
    
                var sql = "INSERT INTO CUSTM_USR ( " +                
                 "USR_NM," +               
                 "EMP_NO," +                
                 "TEAM_ID," +
                 "GRP_ID," +        
                 "ISRT_DT," +
                 "USR_RBC_JOIN_DT," +
                 "ACTV_IND," +
                 "ADMIN_IND," +
                 "STF_IND," +
                 "SUPER_USR_IND," +
                 "MGR_IND," +
                 "PRFL_IND," +
                 "PWD " +
                 ") VALUES ";
        
                sql += util.format("('%s','%s',%d,%d,'%s','%s',%d,%d,%d,%d,%d,%d,'%s')",                
                userParam.firstName,                
                userParam.username,               
                1,
                1,        
                "2011-05-26T07:56:00.123Z",
                "2011-05-26T07:56:00.123Z",
                1,
                1,
                1,
                1,
                1,
                1,
                hash       
                );
                
                sqldb.executeSql( sql, function(err, doc){
                    if( err ) deferred.reject(err.name + ': ' + err.message);
        
                    deferred.resolve();
                });
                //*******
               
            } ) ;
          

        });
       
       
        for( var key in user ){
            if ( user.hasOwnProperty(key)){
            console.log('CREATEUSER, user[' + key + '] = '+user[key])
            }
        }
       
    }

    return deferred.promise;
}

function update( emp_no, userParam){
    var deferred = Q.defer();
    sqldb.executeSql('select * from CUSTM_USR where EMP_NO =' + emp_no, function( user, err) {
        if( err ) deferred.reject(err.name + ': ' + err.message );

        if ( user[0]['EMP_NO'] === userParam.username){
            //check if this has been taken
        //     sqldb.executeSql('select * from CUSTM_USR where EMP_NO = '+ userParam.username,function(user, err){
        //         if ( err ) deferred.reject( err.name + ': ' + err.message);

        //         if(user) {
        //             deferred.reject('Username "' + req.body.username + '" has been taken');
        //         } else {
        //             updateUser();
        //         }
        //     } );
        // } else {
            updateUser();
        }
    });

    function updateUser() {
        var registerUserSet = {
            firstName : userParam.firstName,
            lastName :  userParam.lastName,
            username : userParam.username,
        };

        if ( userParam.password ) {
            registerUserSet.hash = bcrypt.hashSync( userParam.password, 10 );
        }

        sqldb.executeSql( ' update CUSTM_USR set PWD = ' +  registerUserSet.hash + ' where EMP_NO = ' + registerUserSet.username, function(err, doc){
            if (err ) deferred.reject ( err.name + ': ' + err.message );

            deferred.resolve();
            } );
        }
        return deferred.promise;
    
}



function _deleteuser(_id) {
    var deferred = Q.defer();
    console.log('delete func in user.service is invoked now...');
    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function _delete(_id){
    var deferred = Q.defer();
    sqldb.executeSql('delete from CUSTM_USR where CUSTM_USRID =' + _id,function(err, result){
        if( err ) deferred.reject(err.name + ':' + err.message);
        deferred.resolve();
    });
    return deferred.promise();
}