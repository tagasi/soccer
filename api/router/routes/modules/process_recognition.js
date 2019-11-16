/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express"),
    async = require("async"),
    utils = require("../../../router/routes/utils");

module.exports = {
    IsDuplicateCheck: function(req,res,guid,callback){        
        var client = req.db,
        statement = 'select count(*) as \"checkVal\" from \"Users.RecognitionPoints\" where \"Id\"=?';

        client.prepare(
            statement,
            function (err, statement) {
                if (err) {
                    res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                }
                statement.exec([guid],
                    function (err, results) {
                        if (err) {
                            res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;

                        } else {
                            callback(results[0].checkVal);                            
                            // res.type("application/json").status(200).send(JSON.stringify(username));
                        }
                    });
            });
    },
    getUserData: function (req, res, idUsers, callback) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var User = {};

        hdbext.loadProcedure(client, null, "jobpts.procedures::GetUserDetailsProcessRecognition", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([idUsers], function (err, parameters, resultSet) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    if (resultSet.length > 0) {
                        User.IdUsers = resultSet[0].IdUsers;
                        User.FirstName = resultSet[0].FirstName;
                        User.FullName = resultSet[0].FullName;
                        User.Username = resultSet[0].Username;
                        User.Email = resultSet[0].Email;
                        User.UiLangLocale = resultSet[0].UiLangLocale;
                        User.FirstManagerIdUsers = resultSet[0].FirstManagerIdUsers;
                        User.FirstManagerFirstName = resultSet[0].FirstManagerFirstName;
                        User.FirstManagerFullName = resultSet[0].FirstManagerFullName;
                        User.FirstManagerUsername = resultSet[0].FirstManagerUsername;
                        User.FirstManagerEmail = resultSet[0].FirstManagerEmail;
                        User.FirstManagerUiLangLocale = resultSet[0].FirstManagerUiLangLocale;
                        User.SecondManagerIdUsers = resultSet[0].SecondManagerIdUsers;
                        User.SecondManagerFirstName = resultSet[0].SecondManagerFirstName;
                        User.SecondManagerFullName = resultSet[0].SecondManagerFullName;
                        User.SecondManagerUsername = resultSet[0].SecondManagerUsername;
                        User.SecondManagerEmail = resultSet[0].SecondManagerEmail;
                        User.SecondManagerUiLangLocale = resultSet[0].SecondManagerUiLangLocale;

                        /*getLocalization(User.UiLangLocale);
                        getLocalization(User.FirstManagerUiLangLocale);
                        getLocalization(User.SecondManagerUiLangLocale);*/

                        callback(User);
                    } else {

                        callback({})
                    }
                } // successful response
            });
        });
    },
    SaveRecognition: function(req, res, recognitionObject, recognitionGiver, recognitionRecipient, callback){	
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var User = {},ManagerToReceiver= 'IsManagerToReceiver',isManagerToReceiver=false;

        hdbext.loadProcedure(client, null, "jobpts.procedures::ProcessRecognition", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([recognitionGiver.IdUsers, recognitionRecipient.IdUsers, recognitionObject.Amount, recognitionGiver.Username, 
                recognitionRecipient.Username, recognitionObject.RecognizeMessage === 'undefined' ? '': recognitionObject.RecognizeMessage, 
                recognitionObject.AwardReason, recognitionObject.Guid, recognitionObject.IdAwardConfig], function (err, parameters, resultSet) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    if (resultSet.length > 0) {
                        
                        isManagerToReceiver = resultSet[0][ManagerToReceiver] === 1 ? true: false;
                        /*getLocalization(User.UiLangLocale);
                        getLocalization(User.FirstManagerUiLangLocale);
                        getLocalization(User.SecondManagerUiLangLocale);*/

                        
                    } else {
                        
                    }
                    callback(true);
                } // successful response
            });
        });       
    },
    ProcessRecognition: function (req, res) {
        /*
        Amount: 100
        AwardReason: "aaaa"
        Guid: "91bee62b770a898d5bf7089aacaccf4d"
        IdAwardConfig: 509
        IdUsers: 3
        RecognitionRecipients: [{IdUsers: 6, NotifyManager: false}]
        RecognizeMessage: "aaaa"
        */
        var RecognitionObject = req.body,
            RecognitionRecipients = req.body.RecognitionRecipients,
            recognitionGiver = {},
            currentRecipient = {},
            self = this,
            x=0,
            ResponseObject={};

        async.series([
            function(cb) {
                self.IsDuplicateCheck(req,res,RecognitionObject.Guid,function(checkVal){
                    if(checkVal===0){
                        cb();
                    } else {
                        ResponseObject.IsDuplicate=true;
                        ResponseObject.Success=false; 
                        cb(ResponseObject);                       
                        return;
                    }
                });
            },
            function (cb) {               
                self.getUserData(req,res,req.id_users,function(user){
                    recognitionGiver = user;
                    cb();
                })
            },
            function (cb) {
                async.each(RecognitionRecipients, function (recipient, cb) {                    

                    self.getUserData(req,res,recipient.IdUsers, function (user) {
                        currentRecipient = user;
                        currentRecipient['notifyManager'] = recipient.NotifyManager;

                        self.SaveRecognition(req,res,RecognitionObject, recognitionGiver, currentRecipient,function(result){
                            ResponseObject.IsDuplicate=false;
                            ResponseObject.Success=true;
                            cb();
                        });                        
                    });
                }, function (err) {
                    // if any of the file processing produced an error, err would equal that error
                    if (err) {
                        // One of the iterations produced an error.
                        // All processing will now stop.
                        console.log(err);
                    } else {
                        cb();
                    }
                });
            }
        ], function (err) {
            if (err) {
                res.type("application/json").status(200).send(JSON.stringify(err));
            }
            else {                                
                res.type("application/json").status(200).send(ResponseObject);
            }
        });

        // res.type("application/json").status(200).send(req.body);
    }
}