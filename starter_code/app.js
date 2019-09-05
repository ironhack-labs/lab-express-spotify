const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const path= require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


// Remember to insert your credentials here
const clientId = '3d0545c342fc4b1d9509c0d7ee163ace',
    clientSecret = '7dbf2fe62dc24b81ae0940112e06a0e7';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  app.get('/', (req, res, next) => {
    res.render('index');
  });

  app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(artistFromApi => {
      const data= {
        artists: artistFromApi.body.artists.items
      }
      res.render('artists',data);
      console.log("The received data from the API: ", artistFromApi.body.artists.items)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

app.get('*',(request,response,next)=>{
  response.status(404);
  response.send("There has been an error");
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
