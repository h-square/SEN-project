const express = require('express');
const config = require('../../config');
const MongoClient = require('mongodb').MongoClient;
const validator = require('express-validator');

const router = express.Router();

// add user
router.post('/', [
    validator.check('email').isEmail(),
    validator.check('password').isLength({min: 5})
], (req, res) => {
    if(!config.use_atlas){
        res.status(500).json({status: 'SERVER ERROR', msg: 'DATABASE DISCONNECTED'});
        return;
    }

    let err = validator.validationResult(req);
    if(!err.isEmpty()){
        res.status(422).json({status: 'ENTRY ERROR', msg: err.array()})
    }else{
        let dburi = `mongodb+srv://`+
        `${config.atlas_user}:${config.atlas_pass}`+
        `@smap-pmi7t.mongodb.net/test?retryWrites=true&w=majority`;

        MongoClient.connect(dburi, {useUnifiedTopology: true}, (err, client) => {
            if(err){
                console.log(err);
                res.status(500).json({status: "DB_ERROR", msg: "CAN'T CONNECT"});
            }else{
                const collection = client.db("data").collection("auth");

                let user = {
                    email: req.body.email,
                    password: req.body.password
                };

                let matches = [];
                collection.find({email: user.email})
                .forEach(doc => matches.push(doc))
                .then(() => {
                    if(matches.length === 0){
                        collection.insertOne(user);
                    }else if(matches.length === 1){
                        throw 'exists';
                    }else{
                        throw 'multiple duplicates';
                    }
                }).then(() => {
                    res.json({status: "OK", msg: 'NEW USER CREATED', user});
                    client.close();
                }).catch(err => {
                    //console.log(err);
                    if(err === 'exists'){
                        res.status(422).json({status: "ENTRY ERROR",
                        msg: 'EMAIL EXISTS'});
                    }else{
                        res.status(500).json({status: "DB ERROR",
                        msg: 'DATABASE INCONSISTENT'});
                    }
                    client.close();
                });
            }
        });
    }
});



module.exports = router;