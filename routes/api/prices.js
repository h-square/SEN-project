const express = require('express');
const config = require('../../config.js');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();

router.get('/:symbol', (req, res) => {
    symbol = req.params.symbol;

    if(config.use_av || !config.use_atlas)
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
        let dburi = `mongodb+srv://`+
        `${config.atlas_user}:${config.atlas_pass}`+
        `@smap-pmi7t.mongodb.net/test?retryWrites=true&w=majority`;

        MongoClient.connect(dburi, {useUnifiedTopology: true}, (err, client) => {
            if(err){
                console.log(err);
            }else{
                const collection = client.db("data").collection("prices");
                const timestamp = [];
                const prices = [];

                collection.find({symbol})
                .forEach(doc => {
                    timestamp.push(doc.timestamp);
                    prices.push(doc.prices);
                })
                .then(() => {
                    if(timestamp.length > 0)
                        res.json({status: "OK", timestamp, prices});
                    else
                        res.json({status: "DB_ERROR", msg: "No data"});
                    client.close();
                })
                .catch(err => {
                    console.log(err);
                    res.json({status: "DB_ERROR", msg: "Unexpected Error"});
                });
            }
        });
    }
});

module.exports = router;