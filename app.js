require('dotenv').config();

const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
spotifyApi
  .clientCredentialsGrant()
  .then((data) => { 
    spotifyApi.setAccessToken(data.body.access_token);
    //console.log(spotifyApi);
  })
  .catch((error) => {
    console.log("Something went wrong retrieving the access token", error);
  });


// Our routes go here:
app.get("/", (req, res, next)=>{
    res.render("index");
})

app.get("/artist-search", (req, res)=>{
    console.log(req.query.artistName);
    spotifyApi
      .searchArtists(req.query.artistName)
      .then( (data) => {
        //console.log("The received data from the API: ", data.body);
        //console.log(data.body.artists.items);
        res.render("artist-search-results", { artists : data.body.artists.items });
      })
      .catch((err) => console.log('The error while searching artists occured: ', err));
})

app.get('/albums/:artistId', (req, res, next)=>{
    console.log(req.params.artistId);
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
        //console.log('Artist albums', data.body.items);
        res.render("albums", {albums: data.body.items });
     })
    .catch((err) =>{console.log(err);})
    
})

app.get('/tracks/:albumId', (req, res, next)=>{
    console.log(req.params.albumId);
    spotifyApi
    .getAlbumTracks(req.params.albumId, { limit : 10, offset : 1 })
    .then((data) => {
        //console.log('Album tracks', data.body);
        res.render("tracks", {tracks: data.body.items })
    })
    .catch((err) =>{console.log(err);}) 
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
