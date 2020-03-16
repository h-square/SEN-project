const express = require('express');
const path = require('path');
const config = require('./config');

// setting up the server 
app = express();

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

// start listening
const PORT = process.env.PORT || config.serv_port;
app.listen(PORT, () => console.log(`Server running on ${PORT}...`));