const express = require('express');
const config = require('../../config.js');
const axios = require('axios');
const firestore = require('../../firebase/firebase').firestore();

const router = express.Router();
const collection = firestore.collection('quotes');
const stocksdb = require('../../firebase/stocks');

router.get('/:symbol', (req, clientres) => {
    symbol = req.params.symbol;

    if(!stocksdb.has(symbol)){
        clientres.json({
            status: "FAILED",
            msg: "Invalid stock or Not in Database"
        });
        return;
    }

    if(config.use_av || !config.use_firestore)
    {
        axios({
            url: 'http://www.alphavantage.co/query',
            method: 'get',
            params: {
                function: 'GLOBAL_QUOTE',
                symbol,
                apikey: config.av_key
            }
        })
        .then(res => {
            // if request fails or api has bad data
            if(res.status !== 200){
                throw `alphavantage connection error`;
            } else {
                if(res.data['Global Quote']){
                    return res.data['Global Quote'];
                } else {
                    throw 'alphavantage api error';
                }
            }
        })
        .then(data => {
            let res = {
                symbol: data['01. symbol'],
                open: parseFloat(data['02. open']),
                high: parseFloat(data['03. high']),
                low: parseFloat(data['04. low']),
                price: parseFloat(data['05. price']),
                volume: parseFloat(data['06. volume']),
                lastTradingDay: data['07. latest trading day'],
                previousClose: parseFloat(data['08. previous close']),
                change: parseFloat(data['09. change']),
                changePercent: parseFloat(data['10. change percent'].slice(0, -1))
            };
            res.status = "OK";
            clientres.json(res);
        })
        .catch(err => {
            clientres.json({status: "Failed", msg: err});
        });
    }
    else
    {   
        collection.where('symbol', '==', symbol)
        .get().then(snapshot => {
            if(snapshot.empty){
                clientres.json({msg: "Quote Data not available"});
            } else {
                if(snapshot.size != 1){
                    clientres.json({msg: "Database Inconsistent"});
                } else {
                    snapshot.forEach(doc => {
                        let data = doc.data();
                        data.status = "OK";
                        clientres.json(data);
                    })
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg: "UNKNOWN ERROR"});
        });
    }
});

module.exports = router;