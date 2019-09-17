require('dotenv').config()


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const path    = require('path');
const func=require('./func');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public')); when this one worked??? huhhh
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });



// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/artists', (req, res, next) => {
  
  console.log('get artists:'+req.query.search);
  
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
	  
	  var newData=func.format(data.body.artists.items);
	  console.log('oco1'+JSON.stringify(newData));
	  
	  res.render('artists',newData);
    console.log("The received data from the API: ", data.body.artists.items[3].images[0].url	);
	 console.log("The received data from the API: ", data.body.artists.items[4].name	);
	
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
  
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
