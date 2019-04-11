const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


// setting the spotify-api goes here:


const clientId = '928f759b24c244b08283035e708de5c9',
    clientSecret = '0aea948de7504a53b4628a17f93c3949';

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
app.get("/", (req, res) =>{
  res.render("index");
});

app.post("/artists", (req, res) =>{
    var data = {name : req.body.name}
    spotifyApi.searchArtists(data.name)
    .then(data => {

        res.render("artists",data);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

    
    
  });

  app.get('/artists/:id', (req, res, next) => {
    console.log(req.params.id)
    spotifyApi.getArtistAlbums(req.params.id)
        .then((data) => 
        {
          data.artistId = req.params.id;
          res.render("albums",data);
             //res.json(data)
        })
        .catch((err) =>
        {
            console.log("error", err)
        })
  });

  app.get('/albums/:albumid', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumid)
        .then((data) => 
        {
          res.render("tracks",data);
            // res.json(data)
        })
        .catch((err) =>
        {
            console.log("error", err)
        })
  });
  

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
