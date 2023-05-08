require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// require spotify-web-api-node package here:
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

app.get('/', (req,res)=>{
    res.render('index');
})

app.get('/artist-search', async (req,res)=>{
    try{
        let data = await spotifyApi.searchArtists(req.query.artist)
        console.log(data.body.artists.items[0].images)
        res.render('artist-search', {result: data.body.artists.items})
    }catch(error){
        console.log(error)
    }
})

app.get('/albums/:artistId', async (req, res) => {
    try{
        let albumSearch = await spotifyApi.getArtistAlbums(req.query.artist)
        console.log(data.body.artists.artistId)
        res.render('artist-search', {result: data.body.artists.artistId})
    }

    catch(err) {
        console.error(err);
    }
      
  });
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
