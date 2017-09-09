var sqlDb = require("mssql");
var config = require("../configure");
var path = require('path');
var util = require('util');

var logFormat ="[%s:%s:ver%s]-[p:%s]-[t:%s]-[%s]-%s"; 
//var timeStamp = require('moment-timezone');

//PROMISE to handle asyn call to db and also formulate the patterns
exports.executeSql = function (sql, callback) {
    console.log('db.service is starting');
    var conn = new sqlDb.Connection(config.dbConfig);
    conn.connect()
        .then(function () {
            var req = new sqlDb.Request(conn);
            req.query(sql)
                .then(function (recordset) {
                    console.log("recordset is: "+ recordset);
                    callback(recordset);
                    // console.log(util.format(logFormat, "DD00", "sptools", "version 1.0", process.pid, null, "msg", sql));

                    //need confirm if we need log every sql statement
                    //loggerHelper.logMessage(sql); 
                    conn.close();
                })
                .catch(function (err) {
                    console.log(err);
                    //loggerHelper.logError("Error when executing sql. Error:" + JSON.stringify(err.stack));
                    callback(null, err);
                    conn.close();
                });

        })
        .catch(function (err) {
            console.log(err);
            //loggerHelper.logError("Error when executing sql. Error:" + JSON.stringify(err.stack));
            callback(null, err);
        });


};

function executeStoredProc(sql) {
    //2. 
    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
         
        //3.
        var request = new sql.Request(dbConn);
        request.input('Salary', sql.Int, 50000)
        .execute(sql).then(function (recordSet) {
            //4.
            console.log(recordSet);
            dbConn.close();
        }).catch(function (err) {
            //5.
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        //6.
        console.log(err);
    });
}
