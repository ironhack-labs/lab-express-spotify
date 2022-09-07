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
app.get("/", (req,res) => {
    res.render("index")
});

//localhost:3000/artist-search?artist=zoe

app.get("/artist-search",(req,res)=>{
    console.log(req.query)
    spotifyApi
  .searchArtists(req.query,artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    console.log(data.body.artists.itms[0]);
    const datos ={
        busqueda: req.query.artist,
        itms: data.body.artists.itms
    };
    res.render("artist-search-results", datos)
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//localhost:3000/albums/id
app.get("/albums/:idArtista",(req,res) =>{
    console.log(req.params)
    spotifyApi.getArtistAlbums(req.params.idArtista)
    .them((data) => {
        console.log(data.body)
        res.render("albums", data.body)
    })
    .catch((err) => console.log(err))
   
})

//localhost:3000/tracks/:idAlbum
app.get("/tracks/:idAlbum", (req,res) => {
    spotifyApi
    .getAlbumTracks(req.params.idAlbum)
    .then ((data) => {
        console.log(data.body)
        res.render("tracks",data.body)
    })
    .catch((err) => console.log(err))
    
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
