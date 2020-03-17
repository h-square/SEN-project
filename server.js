const express = require('express');
const path = require('path');
const config = require('./config');
const bodyParser = require('body-parser');

// setting up the server 
app = express();
app.use(bodyParser.urlencoded({extended: false}));

// static folder
app.use(express.static(path.join(__dirname, 'client/build')));

// homepage
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// prices
app.use('/api/prices', require('./routes/api/prices'));

// indicators
app.use('/api/indicators/SMA', require('./routes/api/indicators/sma'));
app.use('/api/indicators/EMA', require('./routes/api/indicators/ema'));

// annual reports
app.use('/api/report', require('./routes/api/report'));

// add user
const isValidUser = require('./routes/auth/uservalidate');
app.use('/useradd', require('./routes/auth/useradd'));

// start listening
const PORT = process.env.PORT || config.serv_port;

app.listen(PORT, () => console.log(`Server running on ${PORT}...`));