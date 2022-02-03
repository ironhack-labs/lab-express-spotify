const router = require("express").Router()
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => console.log(spotifyApi.setAccessToken(data.body['access_token'])))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
router.get('/', (req, res) => {
    res.render('index')
})

router.get('/artist-search', (req, res) => {
    // res.send('hola')
    //  console.log(data.)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('artist-search-results', { data: data.body.artists.items })
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})
router.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then((data) => {

            console.log('-----', data)

            res.render('albums', { data: data.body.items })

        }).catch(err => console.log(err))
    // res.render('albums/' + req.params.artistId, req.params)
    // console.log('esto es:' +  req.params.artistId)
})

module.exports = router