const express = require('express');
const config = require('../../config.js');
const axios = require('axios');
const firestore = require('../../firebase/firebase').firestore();

const router = express.Router();
const collection = firestore.collection('prices');
const stocksdb = require('../../firebase/stocks');

router.get('/:symbol', (req, res) => {
    symbol = req.params.symbol;

    if(!stocksdb.has(symbol)){
        res.json({
            status: "FAILED",
            msg: "Invalid stock or Not in Database"
        });
        return;
    }

    if(config.use_av || !config.use_firestore)
    {
        let url = `https://www.alphavantage.co/query?`+
            `function=TIME_SERIES_DAILY`+
            `&symbol=${symbol}`+
            `&outputsize=full`+
            `&apikey=${config.av_key}`;
        // fetch the data from the database but since
        // we don't have one right now we use alphavantage
        axios.get(url)
        .then(res_av => {
            // extract the data
            data = res_av.data;
            if( !('Time Series (Daily)' in data))
                throw 'BAD_REQUEST';
            data = data['Time Series (Daily)'];
            
            const timestamp = [];
            const prices = [];

            // format the data as defined by the API
            // in this case it is status of request, timestamps and prices
            // the client can generate a simple plot locally
            Object.keys(data).forEach(date => {
                timestamp.push(date);
                prices.push(parseFloat(data[date]['1. open']));
            });

            // send the proper response
            res.json({status: "OK", timestamp, prices});

        })
        .catch(err => {
            // the above .then code could generate error
            // we can inspect the error and do different tasks
            // but here we don't
            res.json({status: "SERVER_ERROR OR BAD_REQUEST"});
        });
    }
    else
    {   
        collection.where('symbol', '==', symbol)
        .where('year', '>=', config.earliest_year)
        .get().then(snapshot => {
            let timestamp = [];
            let prices = [];
            if(snapshot.empty){
                res.status(404).json({msg: "NO AVAILABLE DATA"});
            } else {
                snapshot.forEach(doc => {
                    doc.data().data.forEach(dataPoint => {
                        timestamp.push(dataPoint.date);
                        prices.push(dataPoint.price);
                    });
                })
                res.status(200).json({status: "OK", timestamp, prices});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg: "UNKNOWN ERROR"});
        });
    }
});

module.exports = router;