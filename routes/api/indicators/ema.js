const express = require('express');
const config = require('../../../config.js');
const axios = require('axios');
const firestore = require('../../../firebase/firebase').firestore();

const router = express.Router();
const collection = firestore.collection('indicators-ema');

router.get('/:symbol-:period', (req, res) => {
    const symbol = req.params.symbol;
    const period = req.params.period;
    
    if(config.use_av || !config.use_firestore)
    {
        let url = `https://www.alphavantage.co/query?`+
            `function=ema`+
            `&symbol=${symbol}`+
            `&interval=daily`+
            `&time_period=${period}`+
            `&series_type=open`+
            `&apikey=${config.av_key}`;

        axios.get(url)
        .then(res_av => {
            data = res_av.data;
            if( !('Technical Analysis: EMA' in data))
                throw 'BAD_REQUEST';
            data = data['Technical Analysis: EMA'];
            
            const timestamp = [];
            const analysis_data = [];
            Object.keys(data).forEach(date => {
                timestamp.push(date);
                analysis_data.push(parseFloat(data[date]['EMA']));
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
        collection.where('symbol', '==', symbol)
        .where('period', '==', parseInt(period))
        .where('year', '>=', config.earliest_year)
        .get().then(snapshot => {
            let timestamp = [];
            let analysis_data = [];
            if(snapshot.empty){
                res.status(404).json({msg: "NO AVAILABLE DATA"});
            } else {
                snapshot.forEach(doc => {
                    doc.data().data.forEach(dataPoint => {
                        timestamp.push(dataPoint.date);
                        analysis_data.push(dataPoint.ema);
                    });
                })
                res.status(200).json({status: "OK", timestamp, analysis_data});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg: "UNKNOWN ERROR"});
        });
    }
});

module.exports = router;