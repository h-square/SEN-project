const express = require('express');
const jwt = require('jsonwebtoken');
const firestore = require('../../../firebase/firebase').firestore();
const nodemailer = require('nodemailer');
const config = require('../../../config');
const router = express.Router();

const auth = require('./smapgmail');
const portfolios = firestore.collection('portfolios');
const sharedPortfolios = firestore.collection('sharedPortfolios');
const sharedList = firestore.collection('sharedList');


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

        portfolios.where('email', '==', reqTo).get()
        .then(snapshot=>{
            if(snapshot.empty){
                res.json({
                    status: config.statusCodes.failed,
                    errorType: config.errorCodes.db,
                    errors: [
                        {msg: 'No such user exists'}
                    ]
                });
            } else if(snapshot.size>1){
                res.json({
                    status: config.statusCodes.failed,
                    errorType: config.errorCodes.db,
                    errors: [
                        {msg: 'Mutliple such users exist.'}
                    ]
                });
            } else{
                snapshot.forEach(doc=>{
                    const ports=doc.data().portfolios;
                    var reqPortfolio={};
                    let exists=false;
                    for(let i=0; i<ports.length; i++){
                        if(ports[i].name==portfolioName){
                            exists=true;
                            reqPortfolio=ports[i];
                            break;
                        }
                    };
                    if(!exists){
                        res.json({
                            status: config.statusCodes.failed,
                            errorType: config.errorCodes.db,
                            errors: [
                                {msg: 'The owner may have deleted the required portfolio since the request was made.'}
                            ]
                        });
                    }else{//checked
                        sharedList.where('owner','==', reqTo).where('receiver','==',reqFrom).where('name','==', portfolioName).get()
                        .then(snapshot2=>{
                            if(snapshot2.size!=1){
                                res.json({
                                    status: config.statusCodes.failed,
                                    errorType: config.errorCodes.db,
                                    errors: [
                                        {msg: 'Inconsistent database or invalid request.'}
                                    ]
                                });
                            }
                            else{
                                snapshot2.forEach(doc2=>{
                                    sharedList.doc(doc2.id).update({
                                        granted:true
                                    });

                                    sharedPortfolios.where('email','==', reqFrom).get()
                                    .then(snapshot3=>{
                                        if(snapshot3.empty){
                                            sharedPortfolios.add({
                                                email:reqFrom,
                                                portfolios:[reqPortfolio]
                                            })
                                            .then(()=>{
                                                res.json({
                                                    status: config.statusCodes.ok,
                                                    msg: `Portfolio ${portfolioName} added!`
                                                });
                                                transporter.sendMail(mailOptions, (err, info) => {
                                                    if(err) {
                                                        console.log('Mail failed!');
                                                    }
                                                    else {
                                                        console.log(`Mail sent: ${reqFrom}`);
                                                    };
                                                });
                                            })
                                        }else if(snapshot3.size>1){
                                            res.json({ 
                                                status: config.statusCodes.failed,
                                                errorType: config.errorCodes.db,
                                                errors: [
                                                    {msg: `Multiple users found! (Inconsistent database)`}
                                                ]
                                            });
                                        }
                                        else{
                                            snapshot3.forEach(doc3=>{
                                                const userData=doc3.data();
                                                for(let i=0; i<userData.portfolios.length; i++){
                                                    if(userData.portfolios[i].name == portfolioName){
                                                        const s2=reqTo.substring(0,reqTo.indexOf('@'));
                                                        reqPortfolio.name=portfolioName.concat('by'+ s2);
                                                     }
                                                }
                                                userData.portfolios.push(reqPortfolio);
                                                sharedPortfolios.doc(doc3.id).set(userData)
                                                .then(()=>{
                                                    res.json({
                                                        status: config.statusCodes.ok,
                                                        msg: `Portfolio ${portfolioName} added!`
                                                    });
                                                    transporter.sendMail(mailOptions, (err, info) => {
                                                        if(err) {
                                                            console.log('Mail failed!');
                                                        }
                                                        else {
                                                            console.log(`Mail sent: ${reqFrom}`);
                                                        };
                                                    });
                                                });
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })        
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