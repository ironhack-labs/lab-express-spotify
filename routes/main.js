const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/artist-search', (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.artist_name)
		.then((data) => console.log('The received data from the API : ', data.body))
		.catch((error) => console.log('The error while searching artists occured: ', error));
});

module.exports = router;
