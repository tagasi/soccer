/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = { 

    GetSystemSettings: function(req,res){
        var client = req.db;
        client.prepare(
            "select \"Key\",\"Value\" from \"System.Settings\" ",
            function (err, statement) {
                if (err) {
                    res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                }
                statement.exec([],
                    function (err, results) {
                        if (err) {
                            res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;

                        } else {
                            //var result = JSON.stringify({ Objects: results });
                            res.type("application/json").status(200).send(results);
                        }
                    });
            });
    },
    GetUserDetails: function(req,res){
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var username = req.username;
        var idUsers = req.id_users;
        var action = req.query.what;
        if(action==='points'){        
            client.prepare(
                "select \"RemainingPoints\" from \"POINTS_BY_USER\" where \"IdUsers\" = ?",
                function (err, statement) {
                    if (err) {
                        res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                    }
                    statement.exec([idUsers],
                        function (err, results) {
                            if (err) {
                                res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
    
                            } else {
                                //var result = JSON.stringify({ Objects: results });
                                res.type("application/json").status(200).send(results);
                            }
                        });
                });
        } else {
            //(client, Schema, Procedure, callback)
            hdbext.loadProcedure(client, null, "GetUserDetails", function (err, sp) {
                if (err) {
                    console.log("Error on Loading Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                sp(username, function (err, parameters ,details) {
                    if (err) {
                        console.log("Error on Calling Procedure.", err.stack);
                        var result = {
                            message: 'Error ' + JSON.stringify(err.stack)
                        };
                        res.type("application/json").status(500).send(result);
                    } // error response
                    else {
                        var respData = {
                            parameters:parameters
                            ,results: details
                            ,Username: username
                            ,IdUsers: idUsers
                            ,ActionQuery: action
                        };

                        var result = {
                            message: 'Great Job!',
                            data: respData
                        };
                        if(details.length>0){
                            res.type("application/json").status(200).send(details[0]);
                        } else {
                            res.type("application/json").status(200).send({});
                        }
                        
                    } // successful response
                });
            });
        } 
    },
    TranslationService: function(req,res){
        var client = req.db;
        var language = req.query.lang;
        client.prepare(
            "select \"LanguageCode\",\"TranslationKey\",\"TranslationValue\" from \"System.Translation\" where \"LanguageCode\"=?",
            function (err, statement) {
                if (err) {
                    res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                }
                statement.exec([language],
                    function (err, results) {
                        if (err) {
                            res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;

                        } else {  
                            
                            var obj = {};
                            for(var key in results){
                                obj[results[key].TranslationKey]=results[key].TranslationValue
                            }
                            
                            res.type("application/json").status(200).send(obj);
                        }
                    });
            });
    }
}