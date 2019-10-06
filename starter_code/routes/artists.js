const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    let artists = global.searchArtists
    let search = global.searchInput
    if (!artists) {
        res.render('artists', {errorMessage: 'Error! Something went wrong.'});
        return;
    }

    res.render('artists', {artists, search} );
});

module.exports = router;