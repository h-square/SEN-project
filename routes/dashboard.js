const express = require('express');

const router = express.Router();

// replace with dashboard
router.get('/', (req, res) => {
    res.status(200).send('DASHBOARD WORKING');
});

module.exports = router;