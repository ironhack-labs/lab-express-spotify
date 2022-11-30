require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/artist-search', (req,res) =>{
    console.log(req.query)
    spotifyApi.searchArtists(req.query.theArtistName)
    .then(data =>{
        console.log(data.body.artists.items)
        res.render('artist-search-results',{artists: data.body.artists.items})
    })
    .catch(error => console.log('Hay un error en la busqueda:', error))
})

app.get("/albums/:artistId", (req,res)=>{
    console.log(req.params.artistId);
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log(data)
        res.render('albums',{albums: data.body.items})
    })
    .catch(error => console.log("ya hubo falla:",error))
})

app.get('/tracks/:albumId',(req,res)=>{
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then( data => {
        console.log(data)
        res.render('tracks' ,{ tracks: data.body.items})
    })
    .catch(error => {console.log(error)})
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
