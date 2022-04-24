require('dotenv').config();

const { request } = require('express');
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
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        console.log("hola")
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req,res,next)=>{
    
        res.render("index")
    })
    


app.get("/artist-search", (req,res,next)=>{

    // conseguir info de la ruta

     console.log(req.query.artist)



    
    spotifyApi.searchArtists(req.query.search)
  .then(function(data) {
    console.log('Search artists by "Love"', data.body.artists.items);

    const artist = {artist: data.body.artists}
    

    res.render("artist-search-results", artist)
  }, function(err) {
    console.error(err);
  });
})

app.get("/albums/:artistId", (req,res,next)=>{

    console.log(req.params.artistId)

    spotifyApi.getArtistAlbums(req.params.artistId, {limit: 5})
    .then(data => {
        console.log('The received data from the API: ', data.body.items);

        const albums = {albums: data.body}

        res.render("albums", {data})
    })
    .catch(error=>{
        console.log("Que es?",error)
        res.send("Error: 500")
    })
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));