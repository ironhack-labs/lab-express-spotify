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

app.get("/", (req, res, next) => {
    res.render("home");
});

app.get('/artist-search', (req, res, next) => {

    console.log(req.query.artistName)
    spotifyApi.searchArtists(req.query.artistName)
        .then((data) => {
            console.log(data.body.artists);
            console.log('Search artists', data.body.artists.items);
            res.render('artist-search-results', { artistsArr: data.body.artists.items });
        })

    .catch(error => console.log('Something went wrong with the artist search', error));

})


app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then((data) => {
            console.log('Artist albums', data.body.items);
            res.render('albums', { albumsArr: data.body.items })

        })
        .catch(error => console.log('Something went wrong', error));
});



app.get('/tracks/:albumId', (req, res, next) => {

    console.log(req.params.albumId)

    spotifyApi.getAlbumTracks(req.params.albumId)
        .then((data) => {
            console.log(data.body.items);
            res.render('tracks', { tracksArr: data.body.items })

        })
        .catch(error => console.log('Something went wrong', error));

});
//console.log(data);

//console.log(data.body.items);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));