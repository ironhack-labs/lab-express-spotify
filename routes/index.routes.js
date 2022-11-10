const router = require('express').Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

const artistName = ""

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/artist-search', (req, res) => {
    console.log(req.query.artist)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const { items } = data.body.artists
            res.render('artist-search-results', { items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

router.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const { items } = data.body
            console.log('Artist albums', items);
            
            spotifyApi.getArtist(artistId)
                .then(function (data) {
                    const { name } = data.body;
                    res.render('albums', { items, name });
                }, function (err) {
                    console.error(err);
                });
        })
        .catch(err => console.error(err));
});

router.get('/tracks/:albumId', (req, res) => {
    const { albumId } = req.params

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const { items } = data.body
            console.log('Artist tracks', items);
            res.render('tracks', { items });
        })
        .catch(err => console.error(err));
});

module.exports = router;