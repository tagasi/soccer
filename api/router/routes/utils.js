/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = {    

    convertObjectToArray: function(object){
        var array = [], key;
        for (key in object){
            if (object.hasOwnProperty(key)) {
                array.push(object[key]);
             }
        }
        return array;
    },

    ensureAuthorized: function(req, res, next) {        
        var client = req.db;
        client.prepare(
            "select \"IdUsers\",\"Username\" from \"Users.Users\" where \"Email\"=?",
            function (err, statement) {
                if (err) {
                    // res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;	}
                    res.send(500);
                }
                statement.exec([req.user.id],
                    function (err, results) {
                        if (err) {
                            res.send(500);

                        } else {
                            var result = JSON.stringify({ Objects: results, User: req.user.id });
                            if (results.length > 0) {
                                // var data = {
                                //     IdUsers : results[0].IdUsers,
                                //     username : results[0].Username                                    
                                // }
                                // req.UserData = data; 
                                req.username = results[0].Username;
                                req.id_users = results[0].IdUsers;
                                next();
                            } else {
                                res.send(403);
                            }
                        }
                    });
            });
    },

    /*
    function getUser(userId, callback) {
  var mydbAPI = something;
  var myQuery = somethingElse;

  mydbAPI.getUser(myQuery, function(data) {
    //parse data a little here:
    myParsedData = ...;

    callback(myParsedData);
  });
}    
    */

    UserInfo : function(req,res,par,callback){ // 1 - return IdCountry 2 - RoleId 3 - IdCurrency   4 - All in Array // DEFAULT All IN object
		var query = "Select u.\"IdCountry\", r.\"IdAdminRoles\", cc.\"IdCurrency\", c.\"ShortName\", u.\"IdUsers\", u.\"UiLangLocale\" from \"Users.Users\" as u left outer join \"Account.UsersInAdminRoles\" as r on r.\"IdUsers\" = u.\"IdUsers\" left join \"Codes.Country\" as cc on u.\"IdCountry\" = cc.\"IdCountry\" left join \"Codes.Currency\" as c on c.\"IdCurrency\" = cc.\"IdCurrency\" WHERE u.\"Username\" = ?";				
            var client = req.db,
             username = req.username,
             rs={},
             rsArr=[];
        client.prepare(
            query,
            function (err, statement) {
                if (err) {
                    res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                }
                statement.exec([username],
                    function (err, results) {
                        if (err) {
                            res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;

                        } else {                            

                            for (var x in results) {
                                rs = {};
                                rs.IdCountry = results[x].IdCountry;
                                rs.RoleId = results[x].IdAdminRoles;
                                rs.IdCurrency = results[x].IdCurrency;
                                rs.ShortName = results[x].ShortName;
                                rs.IdUsers = results[x].IdUsers;
                                rs.UiLangLocale = results[x].UiLangLocale;
                            }                           
                            switch(par){
                                case 1: 
                                    callback(rs.IdCountry);
                                    break;
                                case 2: 
                                    callback(rs.RoleId);
                                    break;
                                case 3: 
                                    callback(rs.IdCurrency);
                                    break;
                                case 4:
                                    rsArr.push(rs.IdCountry,rs.RoleId,rs.IdCurrency);
                                    callback(rsArr);
                                    break;
                                case 5:
                                    callback(rs.ShortName);
                                    break;
                                case 6:
                                    callback(rs.IdUsers);
                                    break;
                                case 7:
                                    callback(rs.UiLangLocale);
                                    break;
                                default:
                                    callback(rs);
                                    break;
                                }
                        }
                    });
            });                                  
	}
}