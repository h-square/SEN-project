const express = require('express');
const config = require('../../../config.js');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();

router.get('/:symbol-:period', (req, res) => {
    const symbol = req.params.symbol;
    const period = req.params.period;
    
    if(config.use_av || !config.use_atlas)
    {
        let url = `https://www.alphavantage.co/query?`+
            `function=sma`+
            `&symbol=${symbol}`+
            `&interval=daily`+
            `&time_period=${period}`+
            `&series_type=open`+
            `&apikey=${config.av_key}`;
        
        axios.get(url)
            .then(res_av => {
                data = res_av.data;
                if( !('Technical Analysis: SMA' in data))
                    throw 'BAD_REQUEST';
                data = data['Technical Analysis: SMA'];
                
                const timestamp = [];
                const analysis_data = [];
                Object.keys(data).forEach(date => {
                    timestamp.push(date);
                    analysis_data.push(parseFloat(data[date]['SMA']));
                });
                //console.log(timestamp, sma_data);
                res.json({status: "OK", timestamp, analysis_data});
            })
            .catch(err => {
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
                const collection = client.db("data").collection("indicators");

                const timestamp = [];
                const analysis_data = [];

                collection.find({symbol, indicator: 'sma-'+period})
                .forEach(doc => {
                    timestamp.push(doc.timestamp);
                    analysis_data.push(doc.value);
                })
                .then(() => {
                    if(timestamp.length > 0)
                        res.json({status: "OK", timestamp, analysis_data});
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