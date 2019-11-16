/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express"),
bodyParser = require('body-parser');
//utils = require("../../router/routes/utils"),
//app_init = require("../../router/routes/modules/app_initialization");
//recognitions_flow = require("../../router/routes/modules/recognition_flow"),
//process_recognition = require("../../router/routes/modules/process_recognition");

module.exports = function () {
    var app = express.Router();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());    

    //Hello Router
    app.get("/hello", function (req, res) {
        res.send("Hello World Node.js");
    });
    
    app.get("/results", function (req, res) {
        var hdbext = require("@sap/hdbext")
        ,client = req.db
        ,resultSets='$resultSets'
        ,returnObject={}
        ,self = this;

        
          
            hdbext.loadProcedure(client, null, "GetFixtures", function (err, sp) {
                if (err) {
                    //console.log("Error on Loading Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    reject(result);
                } // error response
                sp([], function (err, parameters, rs) {
                    if (err) {
                        console.log("Error on Calling Procedure.", err.stack);
                        var result = {
                            message: 'Error calling procedure: ' + JSON.stringify(err.stack)
                        };
                        reject(result);
                    } // error response
                    else {                        
                         console.log(rs);
                         //resolve(rs);
                        //returnObject = rs
                        if(rs){
                            res.send(rs);                            
                        } else {
                            res.send(null);
                        }
                    } // successful response
                });
            });        

        
    });

    return app;
};