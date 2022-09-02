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
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', function (req, res) {
    res.render('home' , { doctitle: 'Spotify App'});
	// res.render('movies', { movieList: movies, doctitle: 'Movies' })
})

app.get('/artist-search', (req, res) => {
	const queryString = req.query.q
    spotifyApi
  .searchArtists(queryString)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);

    const artists = data.body.artists.items
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
	
	// res.send(artists)
    res.render('artist-search-results', { artistsSearch: artists, doctitle: 'Search for: '+queryString})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
	const queryString = req.params.artistId
    spotifyApi
  .getArtistAlbums(queryString)
  .then(data => {
    // console.log('The received data from the API: ', data.body.items[0].id);

    const artist = data.body.items[0].artists[0].name

    const albums = data.body.items
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
	
	// res.send('hello')
    res.render('albums-views', { albums: albums, doctitle: 'Albums of: ' + artist})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistName/:albumName/:trackId', (req, res) => {
	const queryString = req.params.trackId
    const album = req.params.albumName
    const artist = req.params.artistName
    spotifyApi
  .getAlbumTracks(queryString)
  .then(data => {
    // console.log('The received data from the API: ', data.body);

    const tracks = data.body.items
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
	
	// res.send(tracks[0].name)
    res.render('view-tracks', { tracks: tracks, doctitle: 'Tracks of: ' + album, album: {artist:artist, album:album}})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
