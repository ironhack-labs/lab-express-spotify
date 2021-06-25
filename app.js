require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');


const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  app.get('/', (req, res) => {
    res.render('index');
  });


app.get('/artist-search', (req, res) => {
	// we need to use the value of the name attribute in the input form - in that case title
	//console.log(req.query.title);
	//const filteredMovies = movies.filter(function (movie) {
	//	return movie.title.toLowerCase().includes(req.query.title.toLowerCase());
	//})
	// console.log(filteredMovies);
	//res.render('movies', { moviesList: filteredMovies, doctitle: 'filtered movies' });



spotifyApi
  .searchArtists(req.query.title)
  //ask whether title comes from input in hbs
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    //const filteredArtists = SpotifyWebApi.filter(function (artist) {
	//	return artist.title.toLowerCase().includes(req.query.title.toLowerCase());
    res.render('artist-search-results', {artistas: data.body.artists.items});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));



})

app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log("THE RECEIVED DATA", data)
    res.render('albums', {albumes: data.body.items})
  })

});

app.get('/tracks/:albumId', (req, res, next) => {

  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log("THE RECEIVED DATA", data.body.items)
    res.render('tracks', {tracks: data.body.items})
  })

});
// setting the spotify-api goes here:

// Our routes go here:



app.listen(9000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
