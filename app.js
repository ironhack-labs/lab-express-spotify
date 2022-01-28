require('dotenv').config();

const express = require('express');
const { render } = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.route('/').get((req,res,next) => {
    res.render('home');
})

app.get('/artist-search',(req, res, next) => {
  const { searchTerm } = req.query;
  //console.log(searchTerm); 
  spotifyApi
    .searchArtists(searchTerm)
    .then(responseFromAPI => {
      console.log('The received data from the API: ', responseFromAPI.body.artists.items);
       res.render("artist-search-results", { artists: responseFromAPI.body.artists.items }); //needed several paths here because of the layered objects
    })
    .catch(err => console.log('This error occurred while searching artists: ', err));
})

app.get('/albums/:artistId', (req,res,next) => {
  //const { artist } = req.params;
  //console.log(req.params.artistId);
  //console.log(artist);    //why can't it be done this way? it returns undefined
  spotifyApi
    .getArtistAlbums(req.params.artistId, 'GB')
    .then(responseFromAPI => {
      console.log('The reponse from Albums API query:', responseFromAPI.body.items);
      res.render('albums', {albums: responseFromAPI.body.items});
    })
    .catch(err => console.log('This error occurred while searching albums: ', err));
})

app.get("/tracks/:albumId", (req, res, next) => { 
  
  spotifyApi
    .getAlbumTracks(req.params.albumId, 'GB')
    .then(responseFromAPI => {
      console.log('The response from the tracks search is:', responseFromAPI.body.items);
      res.render('tracks', {tracks: responseFromAPI.body.items});
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
