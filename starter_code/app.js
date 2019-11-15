require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");


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
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:


app.get('/artists', (req,res,next) => {
    console.log(req.query);
    //res.send(req.query);

   // for (const key in req.query) {
      //  console.log("el resiltado es", req.query.artists)
    //  }*/
    

    spotifyApi
    .searchArtists(req.query.artists)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render('artists',{artistsList:data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});



app.get('/', (req,res,next) => {
    res.render('index');
    
});








app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
