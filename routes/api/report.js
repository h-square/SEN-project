const express = require('express');
const config = require('../../config.js');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();

router.get('/:symbol-:year', (req, res) => {
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

module.exports = router;