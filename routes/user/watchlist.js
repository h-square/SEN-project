const express = require('express');
const firestore = require('../../firebase/firebase').firestore();

const router = express.Router();
const watchlists = firestore.collection('watchlists');
const stocksdb = require('../../firebase/stocks');

router.get('/', (req, res) => {
    if(!req.user){
        res.status(401).json({
            status: "FAILED",
            msg: `User not logged in!`
        });
        return;
    }

    watchlists.where('email', '==', req.user.email).get()
    .then(snapshot => {
        if(snapshot.empty){
            res.json({
                status: "OK",
                stocks: []
            });
            watchlists.add({
                email: req.user.email,
                stocks: []
            });
        } else if(snapshot.size != 1){
            res.status(500).json({
                status: "Failed",
                msg: "Database Error, Inconsistent (Multiple users)",
                user:req.user
            });
        } else {
            snapshot.forEach(doc => {
                res.json({
                    status: "OK",
                    stocks: doc.data().stocks
                });
            });
        }
    });
});

router.post('/add', (req, res) => {

    let {stocks} = req.body;
    let new_stocks = stocks;

    if(!req.user){
        res.status(401).json({
            status: "FAILED",
            msg: `User not logged in!`
        });
        return;
    }

    watchlists.where('email', '==', req.user.email).get()
    .then(snapshot => {
        if(snapshot.empty){
            res.json({
                status: "OK",
                stocks
            });
            watchlists.add({
                email: req.user.email,
                stocks
            });
        } else if(snapshot.size != 1){
            res.status(500).json({
                status: "Failed",
                msg: "Database Error, Inconsistent (Multiple users)",
                user: req.user
            });
        } else {
            snapshot.forEach(doc => {
                let stocks = doc.data().stocks;
                new_stocks.forEach(stock => {
                    if(!stocks.includes(stock) && stocksdb.has(stock)){
                        stocks.push(stock);
                    }
                });
                watchlists.doc(doc.id).set({
                    email: req.user.email,
                    stocks
                });
                res.json({
                    status: "OK",
                    stocks
                });
            });
        }
    });
});

router.post('/remove', (req, res) => {

    let {stocks} = req.body;
    let del_stocks = stocks;

    if(!req.user){
        res.status(401).json({
            status: "FAILED",
            msg: `User not logged in!`
        });
        return;
    }

    watchlists.where('email', '==', req.user.email).get()
    .then(snapshot => {
        if(snapshot.empty){
            res.json({
                status: "OK",
                stocks: []
            });
            watchlists.add({
                email: req.user.email,
                stocks: []
            });
        } else if(snapshot.size != 1){
            res.status(500).json({
                status: "Failed",
                msg: "Database Error, Inconsistent (Multiple users)",
                user: req.user
            });
        } else {
            snapshot.forEach(doc => {
                let stocks = doc.data().stocks;
                let new_stocks = [];
                stocks.forEach(stock => {
                    if(!del_stocks.includes(stock) && stocksdb.has(stock)){
                        new_stocks.push(stock);
                    }
                });
                watchlists.doc(doc.id).set({
                    email: req.user.email,
                    stocks: new_stocks
                });
                res.json({
                    status: "OK",
                    stocks: new_stocks
                });
            });
        }
    });
});

module.exports = router;