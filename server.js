const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');


app = express();
const KEY = fs.readFileSync('key.txt');
console.log(`Key obtained: ${KEY}`);
const BASE = "https://www.alphavantage.co/query";
const PORT = process.env.PORT || 5000;

// replace with homepage
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// static...what does it do?
app.use('/static', express.static(path.join(__dirname, 'client/build')));


// client receives JSON object from server and displays it
// server serves client-side scripts and APIs

// example
// use this API to get data on the client side
// and display charts
app.get('/api/prices_monthly/:symbol', (req, res) => {
    symbol = req.params.symbol;

    // fetch the data from the database but since
    // we don't have one right now we use alphavantage
    axios.get(BASE + `?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${KEY}`)
        .then(res_av => {
            // extract the data
            data = res_av.data;
            if( !('Monthly Time Series' in data))
                throw 'BAD_REQUEST';
            data = data['Monthly Time Series'];
            
            const timestamp = [];
            const prices = [];

            // format the data as defined by the API
            // in this case it is status of request, timestamps and prices
            // the client can generate a simple plot locally
            Object.keys(data).forEach(date => {
                timestamp.push(date);
                prices.push(parseInt(data[date]['1. open']));
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

app.get('/api/sma/:symbol', (req, res) => {
    symbol = req.params.symbol;

    axios.get(BASE + `?function=SMA&symbol=${symbol}&interval=weekly&time_period=10&series_type=open&apikey=${KEY}`)
        .then(res_av => {
            res.send(res_av.data);
        })
        .catch(err => {
            res.json({status: "SERVER_ERROR OR BAD_REQUEST"});
        });
});


app.listen(PORT, () => console.log(`Server running on ${PORT}...`));
