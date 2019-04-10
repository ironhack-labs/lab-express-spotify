const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

////////////////////////////////////////////////////


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = '4ca1248346724a93b9f14a08ec18674d',
    clientSecret = '7a223ff3743c4321900f17cdbc07e610';

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

// the routes go here:
app.get("/", (req, res) => {
    res.render("home");
  });


app.get("/artists",(req,res)=>{
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // res.json(data);
      //console.log("The received data from the API: ", data.body);
       res.render("artists",{artists: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data =>{
        res.json(data.body)
        //res.render('albums', {albums: data.body.items})
    })
    .catch(err =>{
        console.log("Oops something's wrong add more console.log")
    })
  });


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));