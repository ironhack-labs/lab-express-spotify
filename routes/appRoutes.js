const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.render('home'));
router.get('/artist-search', (req, res) => res.render('artist-search'));

module.exports = router;