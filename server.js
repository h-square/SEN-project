const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js');

// setting up the server 
app = express();

// static folder
app.use(express.static(path.join(__dirname, 'client/build')));

// homepage
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// prices daily
app.get('/api/prices/:symbol', (req, res) => {
    symbol = req.params.symbol;

    if(config.use_av || !config.use_atlas)
    {
        let url = `https://www.alphavantage.co/query?\
            function=TIME_SERIES_DAILY\
            &symbol=${symbol}\
            &outputsize=full\
            &apikey=${config.av_key}`;
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

// indicators sma
app.get('/api/indicators/SMA/:symbol-:period', (req, res) => {
    symbol = req.params.symbol;
    period = req.params.period;
    
    
    if(config.use_av || !config.use_atlas)
    {
        let url = `https://www.alphavantage.co/query?\
            function=sma\
            &symbol=${symbol}\
            &interval=daily\
            &time_period=${period}\
            &series_type=open\
            &apikey=${config.av_key}`;
        
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

// indicators ema
app.get('/api/indicators/EMA/:symbol-:period', (req, res) => {
    const symbol = req.params.symbol;
    const period = req.params.period;
    
    if(config.use_av || !config.use_atlas)
    {
        let url = `https://www.alphavantage.co/query?\
            function=ema\
            &symbol=${symbol}\
            &interval=daily\
            &time_period=${period}\
            &series_type=open\
            &apikey=${config.av_key}`;

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

                collection.find({symbol, indicator: 'ema-'+period})
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

// annual reports
app.get('/api/report/:symbol-:year', (req, res) => {
    const symbol = req.params.symbol;
    const year = parseInt(req.params.year);

    if(config.use_fmprep || !config.use_atlas)
    {
        let url_income = 'https://financialmodelingprep.com/api/'+
                'v3/financials/income-statement/'+
                `${symbol}`;
        let url_balance = 'https://financialmodelingprep.com/api/'+
                'v3/financials/balance-sheet-statement/'+
                `${symbol}`;
        let url_cash = 'https://financialmodelingprep.com/api/'+
                'v3/financials/cash-flow-statement/'+
                `${symbol}`;
        
        let income_statement = axios.get(url_income)
        .then(res_fmprep => {
            let data = res_fmprep.data;
            let result = {};
            if(!data.financials){
                throw 'BAD_API';
            }else{
                for(let i=0; i<data.financials.length; i++)
                {
                    rep_year = parseInt(data.financials[i].date.split('-')[0]);
                    if(rep_year === year)
                    {
                        Object.keys(data.financials[i])
                        .forEach(key => {
                            if(key !== 'date')
                                result[key] = parseFloat(data.financials[i][key]);
                        });

                        return result;
                    }
                }
            }
            return {};
        })
        .catch(err => {
            throw err;
        });

        let balance_statement = axios.get(url_balance)
        .then(res_fmprep => {
            let data = res_fmprep.data;
            let result = {};
            if(!data.financials){
                throw 'BAD_API';
            }else{
                for(let i=0; i<data.financials.length; i++)
                {
                    rep_year = parseInt(data.financials[i].date.split('-')[0]);
                    if(rep_year === year)
                    {
                        Object.keys(data.financials[i])
                        .forEach(key => {
                            if(key !== 'date')
                                result[key] = parseFloat(data.financials[i][key]);
                        });
                        
                        return result;
                    }
                }
            }
            return {};
        })
        .catch(err => {
            throw err;
        });

        let cash_statement = axios.get(url_cash)
        .then(res_fmprep => {
            let data = res_fmprep.data;
            let result = {};
            if(!data.financials){
                throw 'BAD_API';
            }else{
                for(let i=0; i<data.financials.length; i++)
                {
                    rep_year = parseInt(data.financials[i].date.split('-')[0]);
                    if(rep_year === year)
                    {
                        Object.keys(data.financials[i])
                        .forEach(key => {
                            if(key !== 'date')
                                result[key] = parseFloat(data.financials[i][key]);
                        });
                        
                        return result;
                    }
                }
            }
            return {};
        })
        .catch(err => {
            throw err;
        });

        Promise.all([income_statement, balance_statement, cash_statement])
        .then(values => {
            let final = {status: "OK", symbol, year};
            if(Object.keys(values[0]).length > 0)
                final.income_statement = values[0];
            else{
                res.json({status: "API_ERROR", msg: "NO DATA"});
                return;
            }
            
            if(Object.keys(values[1]).length > 0)
                final.balance_statement = values[1];
            else{
                res.json({status: "API_ERROR", msg: "NO DATA"});
                return;
            }
            
            if(Object.keys(values[2]).length > 0)
                final.cash_statement = values[2];
            else{
                res.json({status: "API_ERROR", msg: "NO DATA"});
                return;
            }

            res.json(final);
        })
        .catch(err => {
            console.log(err);
            res.json({status: "API_ERROR", msg: "UNEXPECTED ERROR"});
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
                res.json({status: "DB_ERROR", msg: "CAN'T CONNECT"});
            }else{
                const collection = client.db("data").collection("reports");

                let reports = [];
                collection.find({symbol, year})
                .forEach(doc => reports.push(doc))
                .then(() => client.close())
                .then(() => {
                    if(reports.length === 1)
                    {
                        delete reports[0]._id;
                        reports[0].status = "OK";
                        res.json(reports[0]);
                    }
                    else if(reports.length === 0)
                        res.json({status: "DB_ERROR", msg: "NO DATA"});
                    else
                        res.json({status: "DB_ERROR", msg: "UNEXPECTED ERROR"});
                })
                .catch(err => {
                    console.log(err);
                    res.json({status: "DB_ERROR", msg: "UNEXPECTED ERROR"});
                });
            }
        });
    }
});

// start listening
const PORT = process.env.PORT || config.serv_port;
app.listen(PORT, () => console.log(`Server running on ${PORT}...`));