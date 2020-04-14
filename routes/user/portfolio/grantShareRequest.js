const express = require('express');
const jwt = require('jsonwebtoken');
const firestore = require('../../../firebase/firebase').firestore();
const nodemailer = require('nodemailer');
const config = require('../../../config');
const router = express.Router();

const auth = require('./smapgmail');
const portfolios = firestore.collection('portfolios');
const sharedPortfolios = firestore.collection('sharedPortfolios');


router.get('/', (req,res) => {
    const token = req.query.token;
    
    //check for token
    if(!token) {
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors: [
                {msg: 'No token found attached to the request.'}
            ]
        });
        return;
    }

    try {
        //Decode token
        const decoded = jwt.verify(token, config.keys.jwt);
        const {reqFrom, reqTo, portfolioName} = decoded;
        const message = require('./message').grantShareRequest;
            
        let transporter = nodemailer.createTransport({
            service : 'gmail',
            auth,
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: '"Stock Market Analysis and Prediction" <noreply.smap@gmail.com>', // sender address
            to: reqFrom,
            subject: "[TEST Mail] Access-Request Granted",
            html: message(reqTo, reqFrom, portfolioName)
        };

        res.json({msg: 'Request Has been granted, actual db logic not yet inserted'});

        // use token to find the requested portfolio in the sharedPortfolio
        // database and add the timestamp or something to the name
        // to prevent name clashes
        // example both the users have portfolios named "techx" so the shared
        // portfolio techx should appear in the requesting user as something like
        // techx (obtained from userx on timestamp)


        // for the stuff below, ask Rag
        //insert this after you verify requested portfolio exist
        /*
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log('Mail failed!');
            }
            else {
                console.log(`Mail sent: ${reqFrom}`);
            };
        });
        */
        
    } catch {
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors: [
                {msg: 'Invalid or expired token'}
            ]
        });
    };
});

module.exports = router;