const express = require('express')
const router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// // Endpoints
router.get('/', (req, res) => {


    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log(data.body.artists.items[0].images[0]);
            res.render('artist-search-result', { data: data.body.artists.items })
        }
        )
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API's
        .catch(err => console.log('The error while searching artists occurred: ', err));
})




// // Detalle de libro
router.get('/detalle/:album_id', (req, res) => {

    const albumId = req.params.album_id
    console.log('textos')

    spotifyApi
        .getArtistAlbums(albumId)
        .then(theAlbum => res.render('details', theAlbum))
        .catch(err => console.log(err))
})


module.exports = router
