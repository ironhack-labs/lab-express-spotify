require('dotenv').config();

import express, { static } from 'express';
import hbs from 'hbs';

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
.clientCredentialsGrant()
.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
.catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
);




// Our routes go here:
app.get('/', (req, res) => {
res.render('Home.hbs');
});


app.get('/artist-search', (req, res) => {

spotifyApi
.searchArtists(req.query.artistName, { limit: 5 })
.then((data) => {
const artist = data.body.artists.items;
console.log(artist);
res.render('artist-search-results', { artist });
})
.catch((err) =>
console.log('The error while searching artists occurred: ', err)
);
} );

app.get('/albums/:artistId', (req, res, next) => {
spotifyApi
.getArtistAlbums(req.params.artistId, { limit: 6 })
.then((data) => {
res.render('albums', { albums: data.body.items });
.catch((err) =>
console.log('The error while searching artists occurred: ', err)
);
});

app.get('/tracks/:albumId', (req, res, next) => {
spotifyApi
.getAlbumTracks(req.params.albumId)
.then((data) => {

res.render('tracks', { track: data.body.items });
})
.catch((err) =>
console.log('The error while searching artists occurred: ', err)
);
});


app.listen(3000, () =>
console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
