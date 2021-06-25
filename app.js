require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require ("spotify-web-api-node")
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebApi ({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

//Connect to the API
spotifyWebApi
  .clientCredentialsGrant()
  .then(data => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
//Step 2
app.get("/",(req, res)=>{
    res.render("index")
})
//Lembrar de colocar data.body
app.get("/artist-search", async (req,res)=>{
    const artistName = req.query.artistName
    let results = await spotifyWebApi.searchArtists(artistName) //Query String
    const urlImg = results.body.artists.items[0].images[0].url
    console.log(urlImg)
    res.render("artist-search-results", {artists: results.body.artists.items})
})

app.get("/artist-search-results", (req, res)=>{

    res.render(artist-search-results)
})
app.get('/albums/:artistId', async (req, res, next) => {
    let albumResult = await spotifyWebApi.getArtistAlbums(req.params.artistId) //Query String
    console.log(albumResult.body.items.name)
    res.render("albums", {albums: albumResult.body.items})
  });
  
app.get("/tracks/:albumId", async (req, res, next)=>{
    let getTracks = await spotifyWebApi.getAlbumTracks(req.params.albumId)
    console.log(getTracks.body.items)
    res.render("tracks", {tracks: getTracks.body.items})
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
