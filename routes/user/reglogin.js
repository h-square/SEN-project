const express = require('express');
const config = require('../../config.js');
const firestore = require('../../firebase/firebase').firestore();
const passport = require('passport');
const protect = require('../../auth/protect');

const router = express.Router();
const collection = firestore.collection('users');

// get user details
router.get('/', protect, (req, res) => {
    console.log(req.body);
    if(req.user) {
        res.json({status: "OK", user});
    } else {
        res.status(500).json({msg: "USER NOT FOUND"});
    }
});

// post requests
router.post('/register', (req, res) => {
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
        res.status(422).json({status: "REG ERROR", errors});
    }else{
        let user = {
            name,
            email,
            password
        };

        
        collection.where('email', '==', email).get()
        .then(snapshot => {
            let matches = [];
            snapshot.forEach(doc => matches.push(doc.data()));
            return matches;
        })
        .then(matches => {
            if(matches.length === 0){
                collection.add(user);
                console.log(`${user.email} was registered!`);
                res.status(200).json({status: "OK", msg: "USER ADDED", user});
            }else if(matches.length === 1){
                errors.push('Already Exists');
                res.status(422).json({status: "ERROR", errors, user});
            }else{
                errors.push('multiple duplicates');
                res.status(500).json({status: "INTERNAL SERV ERROR", errors, user});
                throw 'multiple duplicates';
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.log(err);
            return next(user);
        }
        if(!user){
            return res.status(401).json({status: "AUTHENTICATION FAILED"});
        }else{
            req.logIn(user, err => {
                if(err){
                    return next(err);
                }else{
                    console.log(`${user.email} just logged in`);
                    req.session.save(() => {
                        res.status(200).json({status: "OK", msg: "AUTHENTICATED"});
                    });
                }
            });
        }
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.json({status: "OK", msg: "LOGGED OUT"});
});

module.exports = router;