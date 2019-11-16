//example - https://github.com/SAP/com.sap.openSAP.hana5.example/blob/master/core-js/utils/initialize.js
"use strict";
module.exports = {
    initExpress: function () {
        var xsenv = require("@sap/xsenv");
        //var passport = require("passport");
        var xssec = require("@sap/xssec");
        var xsHDBConn = require("@sap/hdbext");
        var express = require("express");

        //logging
        var logging = require("@sap/logging");
        var appContext = logging.createAppContext();

        //Initialize Express App for XS UAA and HDBEXT Middleware
        var app = express();
        /*passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
            uaa: {
                tag: "xsuaa"
            }
        }).uaa));*/
        app.use(logging.expressMiddleware(appContext));
        //app.use(passport.initialize());
        var hanaOptions = xsenv.getServices({
            hana: {
                tag: "hana"
            }
        });
        app.use(
            xsHDBConn.middleware(hanaOptions.hana)            
        );

        /*app.use(passport.authenticate("JWT", {
            session: false
        }));*/
        
        return app;
    }
};