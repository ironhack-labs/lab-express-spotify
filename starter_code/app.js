require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
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
//SET BODY parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.get('/artists', (req,res,next) => {
  console.log(req.query.artist);
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log("The received data from the API: ",data.body.artists.items[0].images[0].url);
    res.render('artist',{artistList:data.body.artists.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here  req.params.artistId
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log("The received data from the API: ",data.body.items);
    res.render('albums',{albumList:data.body.items});
  })
  .catch(err => {
    console.log("The error while searching albums occurred: ", err);
  });
});

app.get("/tracks/:albumId", (req,res,next) =>{
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log("The received data from the API: ",data.body.items);
    res.render('tracks',{trackList:data.body.items});
  })
  .catch(err => {
    console.log("The error while searching tracks occurred: ", err);
  });
});

app.get('/',(req,res,next) => {
  res.status(200);
  res.render('index');        
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
