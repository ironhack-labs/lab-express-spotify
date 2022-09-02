require('dotenv').config();

const express = require('express');
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
app.get('/', (req, res) => {
    res.render('homepage', )
})

app.get('/artist-search', (req, res) => {
	const queryString = req.query.q
    spotifyApi
    .searchArtists(queryString)
    .then(data => {
        //res.json(data)
        console.log('The received data from the API: ', data.body.artists.items) 
        const artistsList =  data.body.artists.items.filter(artist => {
             return (artist.name.toLowerCase().includes(queryString.toLowerCase()))
        })
        res.render('artist-search-results', {artistsList})	
        //console.log (artistsList)        
    })       
     .catch(err => console.log('The error while searching artists occurred: ', err));    
})

app.get('/albums/:artistId', (req, res) => {
    const id = req.params.artistId
    spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
        //res.json(data)
        //console.log('Artist albums', data.body.items);
        const albumsList =  data.body.items
        res.render('albums', {albumsList})

    })
    .catch(err => console.log('The error while searching albums occurred: ', err));    
  });

  app.get('/tracks/:albumId', (req, res) => {
    const id = req.params.albumId
    spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
        //res.json(data)
        //console.log('Artist albums', data.body.items);
        const tracksList =  data.body.items
        res.render('tracks', {tracksList})

    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));    
  });

  




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
