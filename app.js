require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// --- Register the location for handlebars partials here: ---
//hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/', (req, res) => {
	//console.log('Client is requesting home page');
	res.render('index');
})

app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
        //console.log('The received data from the API: ', data.body);
        //console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
        res.render('artist-search-results', {artistResult: data.body.artists.items});

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/artists/:artistId/albums', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        //console.log('The received data from the API: ', data.body.items);
        //console.log('The received data from the API: ', data.body.items.images);
        res.render('albums', {albumsResult: data.body.items})
        //res.send(data.body.items)
    })
    .catch(err => console.log('This error while searching the albums of the artist occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        //console.log('The received data from the API: ', data.body.items);
        res.render('tracks', {tracksResult: data.body.items})
    })
    .catch(err => console.log('This error occured while trying to retrieve the tracks of the album: ', err));
});






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
