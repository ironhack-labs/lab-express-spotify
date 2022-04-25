require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require("body-parser")

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

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use( bodyParser.urlencoded( {extended:true} ) )

// setting the spotify-api goes here:

// Our routes go here:
app.get("/",(req,res,next)=>{
    res.render("home")
})


app.get("/artist-search",(req,res,next)=>{
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    const artists = data.body.artists.items
    res.render("artist-search-results.hbs",{artists})
  })
  .catch(err => console.log("The error while searching artist ocurred: ", err))
})

app.get("/albums/:artistId",(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data=>{
    const albums = data.body.items
    res.render("albums",{albums})
  })
  .catch(err => console.log("The error while searching artist albums ocurred: ", err))
})

app.get("/tracks/:albumId",(req,res,next)=>{
spotifyApi.getAlbumTracks(req.params.albumId)
.then(data=>{
  const tracks = data.body.items
  res.render("tracks",{tracks})
})
.catch(err => console.log("The error while searching album tracks ocurred: ", err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
