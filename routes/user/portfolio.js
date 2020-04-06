const express = require('express');
const firestore = require('../../firebase/firebase').firestore();
const config = require('../../config');

const router = express.Router();
const portfolios = firestore.collection('portfolios');
const quotes = firestore.collection('quotes');
const stocksdb = require('../../firebase/stocks');

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
        }
    }

    Promise.all(promises)
    .then(values => {
        portfolios.where('email', '==', req.user.email).get()
        .then(snapshot => {
            if(snapshot.size != 1){
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
            watchlists.add({
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
        console.log('Portfolio get failed:', err);
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.internal,
            errors: [
                {msg: 'Unexpected Error', error: err}
            ]
        });
    });;
});





module.exports = router;