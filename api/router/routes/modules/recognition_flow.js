/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express"),
    utils = require("../../../router/routes/utils");

module.exports = {
    GetListOfRecognitionOptions: function (req, res) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var username = req.username;
        var idUsers = req.id_users;
        var action = req.query.what;
        //(client, Schema, Procedure, callback)
        hdbext.loadProcedure(client, null, "jobpts.procedures::GetListOfRecognitionOptions", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([username], function (err, parameters, details) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    var respData = {
                        parameters: parameters
                        , results: details
                        , Username: username
                        , IdUsers: idUsers
                        , ActionQuery: action
                    };

                    var result = {
                        message: 'Great Job!',
                        data: respData
                    };
                    res.type("application/json").status(200).send(utils.convertObjectToArray(details));

                } // successful response
            });
        });
    },
    CheckAwardAvailableBudget: function (req, res) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var username = req.username;
        var idUsers = req.id_users;
        var IdAwardConfig = req.query.IdAwardConfig;
        //(client, Schema, Procedure, callback)
        hdbext.loadProcedure(client, null, "jobpts.procedures::CheckAwardConfigForRemainingBudget", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp(IdAwardConfig, username, function (err, parameters, details) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {

                    if (details.length > 0) {
                        var respData = {
                            CanGo: details[0].CanGo
                            , RemainingBudget: details[0].RemainingBudget
                            , AwardHasBudget: details[0].AwardHasBudget
                            , IdBudgetGroup: details[0].IdBudgetGroup
                        };

                        res.type("application/json").status(200).send(respData);
                    } else {
                        res.type("application/json").status(200).send({});
                    }
                } // successful response
            });
        });
    },
    GetMonetaryValuesForAward: function (req, res) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var IdAwardConfig = req.query.IdAwardConfig;

        utils.UserInfo(req, res, 1, function (loggedUserIdCountry) {
            //(client, Schema, Procedure, callback)
            hdbext.loadProcedure(client, null, "jobpts.procedures::GetMonetaryValuesForAward", function (err, sp) {
                if (err) {
                    console.log("Error on Loading Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                sp([IdAwardConfig, loggedUserIdCountry], function (err, parameters, rs) {
                    if (err) {
                        console.log("Error on Calling Procedure.", err.stack);
                        var result = {
                            message: 'Error ' + JSON.stringify(err.stack)
                        };
                        res.type("application/json").status(500).send(result);
                    } // error response
                    else {
                        var retArr = [], respDate = {};
                        if (rs.length > 0) {
                            if (rs[0].AwardByRange === 1) {
                                respDate.AwardByRange = rs[0].AwardByRange;
                                respDate.MinValue = rs[0].MinValue;
                                respDate.MaxValue = rs[0].MaxValue;
                                respDate.Image = rs[0].Image;
                                respDate.AwardTextKey = rs[0].TextKey;
                                respDate.AssistanceTextKey = rs[0].AssistanceTextKey;
                                respDate.CssClass = rs[0].CssClass;
                                retArr.push(respDate);
                            } else {
                                for (var key in rs) {
                                    respDate = {};
                                    respDate.StepValue = rs[key].StepValue;
                                    respDate.AwardByRange = rs[key].AwardByRange;
                                    respDate.Image = rs[key].Image;
                                    respDate.AwardTextKey = rs[key].TextKey;
                                    respDate.AssistanceTextKey = rs[key].AssistanceTextKey;
                                    respDate.CssClass = rs[key].CssClass;
                                    retArr.push(respDate);
                                }
                            }
                        } else {
                            respDate.Error = true;
                            respDate.Country = true;
                            retArr = respDate;
                        }
                        res.type("application/json").status(200).send(retArr);
                    } // successful response
                });
            });
        });
    },

    GetListOfAwardRecipients: function (req, res) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var searchParameter = req.query.search,
            idAwardConfig = req.query.awardConfig,
            startIndex = req.query.start,
            username = req.username;

        hdbext.loadProcedure(client, null, "jobpts.procedures::SearchAwardRecipient", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([searchParameter, username, idAwardConfig, startIndex], function (err, parameters, details) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    res.type("application/json").status(200).send(utils.convertObjectToArray(details));
                } // successful response
            });
        });
    },

    CheckBudgetUserSelection: function (req, res) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var idAwardConfig = req.query.IdAwardConfig,
            idUsers = req.query.IdUsers,
            returnObj = {};

        hdbext.loadProcedure(client, null, "jobpts.procedures::CheckBudgetUserSelection", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([idAwardConfig, idUsers], function (err, parameters, data) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    if (data.length > 0) {
                        returnObj.RemainingBudget = data[0].RemainingBudget;
                        if (data[0].IdBudgetGroup === 2) {
                            returnObj.UserOrgUnit = data[0].UserOrgUnit;
                        }
                        if (data[0].IdBudgetGroup === 5) {
                            returnObj.UserIdCountry = data[0].UserIdCountry;
                            returnObj.UserCountryName = data[0].UserCountryName;
                        }
                    }
                    res.type("application/json").status(200).send(returnObj);
                } // successful response
            });
        });
    },
    convertAmountBetweenCurrencies(req, res, sourceAmount, sourceCurrency, destinationCurrency, callback) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;        

        hdbext.loadProcedure(client, null, "jobpts.procedures::ConvertMoneyBetweenCurrencies", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([sourceAmount, sourceCurrency, destinationCurrency], function (err, parameters, rs) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    if (rs.length > 0) {
                        var convertedAmount = {
                            LocalMoney: rs[0].ConvertedAmount,
                            CurrencyShortName: destinationCurrency.toLowerCase()
                        };
                        callback(convertedAmount);
                    } else {
                        callback({});
                    }
                } // successful response
            });
        });
    },
    ConvertPointsToUserLocalCurrency: function (req, res) {
        var hdbext = require("@sap/hdbext");
        var client = req.db;
        var points = req.query.pts,
            idUsers = req.query.idUsers,
            isStripe = req.query.stripe
            , retObj = {};

        hdbext.loadProcedure(client, null, "jobpts.procedures::ConvertPointsToUsersLocalCurrency", function (err, sp) {
            if (err) {
                console.log("Error on Loading Procedure.", err.stack);
                var result = {
                    message: 'Error ' + JSON.stringify(err.stack)
                };
                res.type("application/json").status(500).send(result);
            } // error response
            sp([points, idUsers], function (err, parameters, rs) {
                if (err) {
                    console.log("Error on Calling Procedure.", err.stack);
                    var result = {
                        message: 'Error ' + JSON.stringify(err.stack)
                    };
                    res.type("application/json").status(500).send(result);
                } // error response
                else {
                    if (rs.length > 0) {
                        var currency = rs[0].CurrencyShortName.toLowerCase();
                        if (isStripe == 1 && (currency === 'ars' || currency === 'mxn' || currency === 'brl')) {
                            // stripe doesn't support some of the south americans currencies, we convert to USD
                            convertAmountBetweenCurrencies(rs[0].LocalMoney, rs[0].CurrencyShortName, 'USD', function (MoneyToUsd) {
                                retObj.localValue = MoneyToUsd.LocalMoney + ' ' + MoneyToUsd.CurrencyShortName;
                                retObj.value = MoneyToUsd.LocalMoney;
                                retObj.currency = MoneyToUsd.CurrencyShortName;
                                res.type("application/json").status(200).send(retObj);
                            });

                        } else if (isStripe == 1 && currency === 'huf') {
                            // stripe doesn't support some of the european currencies, we convert to EUR
                            convertAmountBetweenCurrencies(req, res, rs[0].LocalMoney, rs[0].CurrencyShortName, 'EUR', function (MoneyToEur) {
                                retObj.localValue = MoneyToEur.LocalMoney + ' ' + MoneyToEur.CurrencyShortName;
                                retObj.value = MoneyToEur.LocalMoney;
                                retObj.currency = MoneyToEur.CurrencyShortName;
                                res.type("application/json").status(200).send(retObj);
                            });
                        } else {
                            retObj.localValue = rs[0].LocalMoney + ' ' + currency;
                            retObj.value = rs[0].LocalMoney;
                            retObj.currency = currency;
                            res.type("application/json").status(200).send(retObj);
                        }
                    } else {
                        retObj.Error = 'An error occured while converting points to local currency.';
                        res.type("application/json").status(200).send(retObj);
                    }
                } // successful response
            });
        });
    },
    GetAwardReasonConfig: function(req,res,IdAwardConfig,callback){
        // var hdbext = require("@sap/hdbext");
        var client = req.db,
            statement = 'select ifnull("AwardReasonIsRequired", 0) as "IsRequired", ifnull("AwardReasonIsText", 0) as "IsText" from "Award.AwardConfig" where "IdAwardConfig" = ?';

        client.prepare(
            statement,
            function (err, statement) {
                if (err) {
                    res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                }
                statement.exec([IdAwardConfig],
                    function (err, results) {
                        if (err) {
                            res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;

                        } else {
                            if(results.length>0)
                            {
                                callback(results[0]);
                            } else {
                                callback({});
                            }
                            
                            // res.type("application/json").status(200).send(JSON.stringify(username));
                        }
                    });
            });
    },
    GetListOfAwardReasonsCall: function(req,res,IdAwardConfig,callback){
        // var hdbext = require("@sap/hdbext");
        var client = req.db,
        statement = 'select ac."IdAwardReasons",ac."TitleKey", ac."DescriptionKey" from "Award.AwardReasonsConfig" arc inner join "Codes.AwardReasons" ac on arc."IdAwardReasons" = ac."IdAwardReasons" where arc."IdAwardConfig" =? order by arc."DisplayOrderIndex" asc';

        client.prepare(
            statement,
            function (err, statement) {
                if (err) {
                    res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;
                }
                statement.exec([IdAwardConfig],
                    function (err, results) {
                        if (err) {
                            res.type("text/plain").status(500).send("ERROR: " + err.toString()); return;

                        } else {
                            callback(utils.convertObjectToArray(results));                            
                            // res.type("application/json").status(200).send(JSON.stringify(username));
                        }
                    });
            });
    }
    ,
    GetListOfAwardReasons: function(req,res){
        // var hdbext = require("@sap/hdbext");
        // var client = req.db;
        var idAwardConfig = req.query.IdAwardConfig;
        
        var self = this;
        self.GetAwardReasonConfig(req,res,idAwardConfig,function(config){
            var award_config = config;            
            self.GetListOfAwardReasonsCall(req,res,idAwardConfig,function(awardReasonsList){
                var data = {
                    AwardReasonIsRequired: award_config.IsRequired,
                    AwardReasonIsText: award_config.IsText,
                    AwardReasonsList: awardReasonsList
                };
                res.type("application/json").status(200).send(data);
            });
            // res.type("application/json").status(200).send(award_config);
        })
    }    
}