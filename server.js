const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');


app = express();
const KEY = fs.readFileSync('key.txt');
console.log(`Key obtained: ${KEY}`);
const BASE = "https://www.alphavantage.co/query";
const PORT = process.env.PORT || 5000;

// static...what does it do?
app.use(express.static(path.join(__dirname, 'client/build')));

// replace with homepage
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


// client receives JSON object from server and displays it
// server serves client-side scripts and APIs

// example
// use this API to get data on the client side
// and display charts
app.get('/api/prices/:symbol', (req, res) => {
    symbol = req.params.symbol;

    let url = BASE + `?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${KEY}`
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
});

app.get('/api/indicators/SMA/:symbol-:period', (req, res) => {
    symbol = req.params.symbol;
    period = req.params.period;
    let url = BASE + `?function=sma&symbol=${symbol}&interval=daily&time_period=${period}&series_type=open&apikey=${KEY}`;

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
});

app.get('/api/indicators/EMA/:symbol-:period', (req, res) => {
    symbol = req.params.symbol;
    period = req.params.period;
    let url = BASE + `?function=ema&symbol=${symbol}&interval=daily&time_period=${period}&series_type=open&apikey=${KEY}`;

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
});


app.listen(PORT, () => console.log(`Server running on ${PORT}...`));
