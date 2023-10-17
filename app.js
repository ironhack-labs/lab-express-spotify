//that loads env file
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

//root path(main page)
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const searchedItem = data.body.artists.items.filter(item => {
                return item.images.length > 0
            }).map(item => {
                // console.log(JSON.stringify(item))
                return { image: item.images[0].url, title: item.name, link: `/albums/${item.id}` }
            })
            res.render('artist-search', { artists: searchedItem });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            const albums = data.body.items.filter(album => {
                return album.images.length > 0
            }).map(album => {
                // console.log(JSON.stringify(album))
                return { image: album.images[0].url, title: album.name, link: `/tracks/${album.id}` }
            })

            res.render('albums', { albums: albums });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            const tracks = data.body.items.filter(track => {
                return track.preview_url != null
            }).map(track => {
                // console.log(JSON.stringify(item))
                return { preview_url: track.preview_url, name: track.name }
            })

            res.render('tracks', { tracks: tracks });

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));