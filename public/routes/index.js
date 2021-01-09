const express = require('express');
const router = express.Router();
// require spotify-web-api-node package here: ==================
const SpotifyWebApi = require('spotify-web-api-node');
// ===============================================================
// setting the spotify-api goes here: -----------------------------
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
// ----------------------------------------------------------------
// Retrieve an access token ****************************************
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
//   ***************************************************************




// GET home page
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/artist-search', (req, res, next) => {
    // console.log({theQuery: req.query});
    spotifyApi
        .searchArtists(req.query.searchQuery)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.redirect('back');
            const dataToDisplay = {
                searchResults: data.body.artists.items
            };
            res.render('search-results', dataToDisplay);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

module.exports = router;