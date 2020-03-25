const express = require('express');

const router = express.Router();

// replace with dashboard
router.get('/', (req, res) => {
    res.status(200).json({msg: 'DASHBOARD WORKING'});
});

module.exports = router;