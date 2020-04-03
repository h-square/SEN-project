const express = require('express');
const config = require('../../config.js');
const axios = require('axios');
const firestore = require('../../firebase/firebase').firestore();

const router = express.Router();
const collection = firestore.collection('reports');
const stocksdb = require('../../firebase/stocks');

router.get('/:symbol-:year', (req, res) => {
    const symbol = req.params.symbol;
    const year = parseInt(req.params.year);

    if(!stocksdb.has(symbol)){
        res.json({
            status: "FAILED",
            msg: "Invalid stock or Not in Database"
        });
        return;
    }

    if(year < 2000 || year > 3000){
        res.json({
            status: "FAILED",
            msg: "Invalid year"
        });
        return;
    }

    if(config.use_fmprep || !config.use_firestore)
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
        collection.where('symbol', '==', symbol)
        .where('year', '==', year)
        .get().then(snapshot => {
            let matches = [];
            if(snapshot.empty){
                res.status(404).json({msg: "NO AVAILABLE DATA"});
            } else {
                snapshot.forEach(doc => matches.push(doc.data()));

                let income_statement = matches[0].income_statement;
                let balance_statement = matches[0].balance_statement;
                let cash_statement = matches[0].cash_statement;

                if(matches.length == 1) {
                    res.status(200).json({
                        status: "OK", symbol, year,
                        income_statement,
                        balance_statement,
                        cash_statement
                    });
                } else {
                    res.status(500).json({status: "DB ERROR", msg: "INCONSISTENT DATABASE"});
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