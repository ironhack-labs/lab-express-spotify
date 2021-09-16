require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();
hbs.registerPartials(__dirname+ "/views/partials")

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
app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/artist-search",(req,res)=>{
    console.log(req.query)
    



spotifyApi
  .searchArtists(req.query.artist)
  .then((data) => {
    // console.log('The received data from the API: ', data.body.artists);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artista = data.body.artists.items
    let artistImages= data.body.artists.items[0].images[1].url
    console.log(artistImages)
    res.render("artist-search-results",{
        artista:artista
    })
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err)
  );
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
