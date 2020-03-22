const express = require('express');
const config = require('../../config.js');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');

const router = express.Router();

// forms
router.get('/login', (req, res) => {
    res.send('To be replaced with a form');
});
router.get('/register', (req, res) => {
    res.send('To be replaced with a form');
});


// post requests
router.post('/register', (req, res) => {
    // console.log(req.body);
    let {name, email, password, password2} = req.body;
    let errors = [];

    if (!name || !email || !password || !password2){
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != password2){
        errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if(errors.length > 0){
        res.status(422).json({errors});
    }else{
        let dburi = `mongodb+srv://`+
        `${config.atlas_user}:${config.atlas_pass}`+
        `@smap-pmi7t.mongodb.net/test?retryWrites=true&w=majority`;

        let user = {
            name,
            email,
            password
        };

        MongoClient.connect(dburi, {useUnifiedTopology: true}, (err, client) => {
            if(err){
                console.log(err);
                res.json({status: "DB_ERROR", msg: "CAN'T CONNECT"});
            }else{
                const collection = client.db("data").collection("auth");

                let matches = [];
                collection.find({email})
                .forEach(doc => matches.push(doc))
                .then(() => {
                    if(matches.length === 0){
                        collection.insertOne(user);
                        res.status(200).json({status: "OK", msg: "USER ADDED", user});
                    }else if(matches.length === 1){
                        errors.push('Already Exists');
                        res.status(422).json({status: "ERROR", errors, user});
                    }else{
                        errors.push('multiple duplicates');
                        res.status(500).json({status: "INTERNAL SERV ERROR", errors, user});
                        throw 'multiple duplicates';
                    }
                    client.close();
                })
                .catch(err => {
                    console.log(err);
                    client.close();
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/badlogin',
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// replace with proper login error page
router.get('/badlogin', (req, res) => {
    res.send('please login!');
});

module.exports = router;