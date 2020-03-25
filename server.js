const express = require('express');
const path = require('path');
const config = require('./config');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const setupPassport = require('./auth/passport');
const protect = require('./auth/protect');

// setting up the server 
app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); 
    next();
});

// setup passport and sessions
app.use(session({
    secret: 'stuff',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
setupPassport(passport);

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

// login and registeration
app.use('/user', require('./routes/user/reglogin'));

// dashboard
app.use('/dashboard', protect, require('./routes/dashboard'));

// start listening
const PORT = process.env.PORT || config.serv_port;

app.listen(PORT, () => console.log(`Server running on ${PORT}...`));