const express = require('express');
const firestore = require('../../../firebase/firebase').firestore();
const config = require('../../../config');

const router = express.Router();
const portfolios = firestore.collection('portfolios');
const quotes = firestore.collection('quotes');
const stocksdb = require('../../../firebase/stocks');

// portfolio structure
// p1 = {
//     name: 'portfolio top secret',
//     items: [
//         {
//             symbol: 'MSFT',
//             price: 546.23,
//             quantity: 50
//         },
//         {
//             symbol: 'FB',
//             quantity: 23 // if price is not mentioned then latest quote will be added
//         }
//     ]
// }


// get all portfolios for the user
router.get('/', (req, res) => {
    if(!req.user){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.auth,
            errors: [
                {msg: 'Authenticated but user not Found'}
            ]
        });
        return;
    }

    portfolios.where('email', '==', req.user.email).get()
    .then(snapshot => {
        if(snapshot.empty){
            res.json({
                status: config.statusCodes.ok,
                portfolios: []
            });
            portfolios.add({
                email: req.user.email,
                portfolios: []
            });
        } else if(snapshot.size != 1){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.db,
                errors: [
                    {msg: 'Inconsistent Database (Multiple users)'}
                ]
            });
        } else {
            snapshot.forEach(doc => {
                res.json({
                    status: config.statusCodes.ok,
                    portfolios: doc.data().portfolios
                });
            });
        }
    })
    .catch(err => {
        console.log('Portfolios (All) get failed:', err);
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.internal,
            errors: [
                {msg: 'Unexpected Error', error: err}
            ]
        });
    });;
});


//get all the shared portfolios
router.get('/shared', (req, res) => {
    if(!req.user){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.auth,
            errors: [
                {msg: 'Authenticated but user not Found'}
            ]
        });
        return;
    }

    sharedPortfolios.where('email', '==', req.user.email).get()
    .then(snapshot => {
        if(snapshot.empty){
            res.json({
                status: config.statusCodes.ok,
                portfolios: [],
                msg: `User has no shared portfolios!`
            });
        } else if(snapshot.size != 1){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.db,
                errors: [
                    {msg: 'Inconsistent Database (Multiple users)'}
                ]
            });
        } else {
            snapshot.forEach(doc => {
                res.json({
                    status: config.statusCodes.ok,
                    portfolios: doc.data().portfolios
                });
            });
        }
    })
    .catch(err => {
        console.log('Shared portfolios (All) get failed:', err);
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.internal,
            errors: [
                {msg: 'Unexpected Error', error: err}
            ]
        });
    });;
});




// add a portfolio for the user
router.post('/add', (req, res) => {
    if(!req.user){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.auth,
            errors: [
                {msg: 'Authenticated but user not Found'}
            ]
        });
        return;
    }

    const data = req.body.portfolio;
    if(!data){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors: [
                {msg: 'No portfolio found in request'}
            ]
        });
        return;
    }

    const errors = [];
    if(!data.name){
        errors.push({msg: 'Portfolio has no name!'});
    }
    if(!(data.items instanceof Array)){
        errors.push({msg: 'Portfolio has no items array!'});
    }
    if(errors.length > 0){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors
        });
        return;
    }

    const portfolio = {
        name: data.name,
        items: []
    };
    const promises = [];
    for(let i=0; i<data.items.length; i++){
        let {symbol, price, quantity} = data.items[i];

        // item has no proper symbol
        if(!stocksdb.has(symbol)){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.api,
                errors: [
                    {msg: `Item index ${i} has no valid symbol`}
                ]
            });
            return;
        }

        // item has no quantity present
        if(!quantity || isNaN(quantity) || quantity <= 0){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.api,
                errors: [
                    {msg: `Item index ${i} has no valid quantity`}
                ]
            });
            return;
        }

        // price is present but not valid
        if(price && (isNaN(price) || price < 0) ){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.api,
                errors: [
                    {msg: `Item index ${i} has no valid price`}
                ]
            });
            return;
        } else { // price is absent, bring from quote
            if(!price){
                portfolio.items.push({
                    symbol,
                    quantity
                });
                promises.push(quotes.where('symbol', '==', symbol).get()
                .then(snapshot => {
                    if(snapshot.size != 1){
                        res.json({ // inconsistent database
                            status: config.statusCodes.failed,
                            errorType: config.errorCodes.db,
                            errors: [
                                {msg: `Item index ${i} is valid but (none/multiple) quotes`}
                            ]
                        });
                    } else { // assign price
                        snapshot.forEach(doc => {
                            portfolio.items[i].price = doc.data().price;
                        });
                    }
                }));
            } else {
                portfolio.items.push({
                    symbol,
                    quantity,
                    price
                });
                promises.push('Price was present');
            }
            
        }
    }

    Promise.all(promises)
    .then(values => {
        portfolios.where('email', '==', req.user.email).get()
        .then(snapshot => {
            if(snapshot.empty){
                portfolios.add({
                    email: req.user.email,
                    portfolios: [portfolio]
                })
                .then(() => {
                    res.json({
                        status: config.statusCodes.ok,
                        msg: `Portfolio ${portfolio.name} added!`
                    });
                });
            } else if(snapshot.size > 1){
                res.json({ // inconsistent database
                    status: config.statusCodes.failed,
                    errorType: config.errorCodes.db,
                    errors: [
                        {msg: `Multiple users found! (Inconsistent database)`}
                    ]
                });
            } else {
                snapshot.forEach(doc => {
                    const userData = doc.data();

                    for(let i=0; i<userData.portfolios.length; i++){
                        // check for duplicate portfolio names
                        if(userData.portfolios[i].name == portfolio.name){
                            res.json({
                                status: config.statusCodes.failed,
                                errorType: config.errorCodes.api,
                                errors: [
                                    {msg: `Portfolio ${portfolio.name} already exists!`}
                                ]
                            });
                            return;
                        }
                    }

                    userData.portfolios.push(portfolio);
                    portfolios.doc(doc.id).set(userData)
                    .then(() => {
                        res.json({
                            status: config.statusCodes.ok,
                            msg: `Portfolio ${portfolio.name} added!`
                        });
                    });
                });
            }
        })
    })
    .catch(err => {
        console.log('Portfolio add failed:', err);
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.internal,
            errors: [
                {msg: 'Unexpected Error', error: err}
            ]
        });
    });

});

// remove a portfolio
router.post('/remove', (req, res) => {
    if(!req.user){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.auth,
            errors: [
                {msg: 'Authenticated but user not Found'}
            ]
        });
        return;
    }

    const portfolioName = req.body.name;
    if(!portfolioName){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors: [
                {msg: 'No portfolioName found in request'}
            ]
        });
        return;
    }

    portfolios.where('email', '==', req.user.email).get()
    .then(snapshot => {
        if(snapshot.empty){
            portfolios.add({
                email: req.user.email,
                portfolios: []
            })
            .then(() => {
                res.json({
                    status: config.statusCodes.failed,
                    errorType: config.errorCodes.api,
                    errors: [
                        {msg: `Portfolio ${portfolioName} doesn't exist`}
                    ]
                });
            });
        } else if(snapshot.size > 1){
            res.json({ // inconsistent database
                status: config.statusCodes.failed,
                errorType: config.errorCodes.db,
                errors: [
                    {msg: `Multiple users found! (Inconsistent database)`}
                ]
            });
        } else {
            snapshot.forEach(doc => {
                let allPortfolios = doc.data().portfolios;
                let wasRemoved = false;
                allPortfolios = allPortfolios.filter(portfolio => {
                    if(portfolio.name == portfolioName){
                        wasRemoved = true;
                        return false;
                    } else {
                        return true;
                    }
                });
                if(wasRemoved){
                    portfolios.doc(doc.id).update({
                        portfolios: allPortfolios
                    })
                    .then(() => {
                        res.json({
                            status: config.statusCodes.ok,
                            msg: `Portfolio ${portfolioName} removed!`
                        })
                    });
                } else {
                    res.json({
                        status: config.statusCodes.failed,
                        errorType: config.errorCodes.api,
                        errors: [
                            {msg: `Portfolio ${portfolioName} doesn't exist!`}
                        ]
                    });
                } 
            });
        }
    })
    .catch(err => {
        console.log('Portfolio remove failed:', err);
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.internal,
            errors: [
                {msg: 'Unexpected Error', error: err}
            ]
        });
    });

});


// modify a portfolio for the user
router.post('/edit', (req, res) => {
    if(!req.user){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.auth,
            errors: [
                {msg: 'Authenticated but user not Found'}
            ]
        });
        return;
    }

    const data = req.body.portfolio;
    if(!data){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors: [
                {msg: 'No portfolio found in request'}
            ]
        });
        return;
    }

    const errors = [];
    if(!data.name){
        errors.push({msg: 'Portfolio has no name!'});
    }
    if(!(data.items instanceof Array)){
        errors.push({msg: 'Portfolio has no items array!'});
    }
    if(errors.length > 0){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.api,
            errors
        });
        return;
    }

    const portfolio = {
        name: data.name,
        items: []
    };
    const promises = [];
    for(let i=0; i<data.items.length; i++){
        let {symbol, price, quantity} = data.items[i];

        // item has no proper symbol
        if(!stocksdb.has(symbol)){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.api,
                errors: [
                    {msg: `Item index ${i} has no valid symbol`}
                ]
            });
            return;
        }

        // item has no quantity present
        if(!quantity || isNaN(quantity) || quantity <= 0){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.api,
                errors: [
                    {msg: `Item index ${i} has no valid quantity`}
                ]
            });
            return;
        }

        // price is present but not valid
        if(price && (isNaN(price) || price < 0) ){
            res.json({
                status: config.statusCodes.failed,
                errorType: config.errorCodes.api,
                errors: [
                    {msg: `Item index ${i} has no valid price`}
                ]
            });
            return;
        } else { // price is absent, bring from quote
            if(!price){
                portfolio.items.push({
                    symbol,
                    quantity
                });
                promises.push(quotes.where('symbol', '==', symbol).get()
                .then(snapshot => {
                    if(snapshot.size != 1){
                        res.json({ // inconsistent database
                            status: config.statusCodes.failed,
                            errorType: config.errorCodes.db,
                            errors: [
                                {msg: `Item index ${i} is valid but (none/multiple) quotes`}
                            ]
                        });
                    } else { // assign price
                        snapshot.forEach(doc => {
                            portfolio.items[i].price = doc.data().price;
                        });
                    }
                }));
            } else {
                portfolio.items.push({
                    symbol,
                    quantity,
                    price
                });
                promises.push('Price was present');
            }
        }
    }

    Promise.all(promises)
    .then(values => {
        portfolios.where('email', '==', req.user.email).get()
        .then(snapshot => {
            if(snapshot.empty){
                portfolios.add({
                    email: req.user.email,
                    portfolios: []
                })
                .then(() => {
                    res.json({
                        status: config.statusCodes.failed,
                        errorType: config.errorCodes.api,
                        msg: `Portfolio ${portfolio.name} doesn't exist!`
                    });
                });
            } else if(snapshot.size > 1){
                res.json({ // inconsistent database
                    status: config.statusCodes.failed,
                    errorType: config.errorCodes.db,
                    errors: [
                        {msg: `Multiple users found! (Inconsistent database)`}
                    ]
                });
            } else {
                snapshot.forEach(doc => {
                    const userData = doc.data();

                    let exists = false;

                    for(let i=0; i<userData.portfolios.length; i++){
                        // check for old copy
                        if(userData.portfolios[i].name == portfolio.name){
                            exists = true;
                            userData.portfolios[i] = portfolio;
                            break;
                        }
                    }

                    if(exists){
                        portfolios.doc(doc.id).set(userData)
                        .then(() => {
                            res.json({
                                status: config.statusCodes.ok,
                                msg: `Portfolio ${portfolio.name} modified!`
                            });
                        });
                    } else {
                        res.json({
                            status: config.statusCodes.failed,
                            errorType: config.errorCodes.api,
                            msg: `Portfolio ${portfolio.name} doesn't exist!`
                        });
                    }
                });
            }
        })
    })
    .catch(err => {
        console.log('Portfolio Modify failed:', err);
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.internal,
            errors: [
                {msg: 'Unexpected Error', error: err}
            ]
        });
    });

});




module.exports = router;