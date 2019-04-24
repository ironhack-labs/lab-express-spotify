const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



require('dotenv').config() 

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId : 'f802c36829c14e638d0f2ec1af178394',
  clientSecret : process.env.clientSecret
});

// Remember to insert your credentials here

// console.log(process.env.clientId, process.env.clientSecret)



// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  



// the routes go here:


//Home 

app.get("/", (req, res, next)=>{
  res.render("index")
})

//Search

app.get('/search', (req, res, next) => {
  console.log('searching for ',req.query)
  spotifyApi.searchArtists(req.query.artist) //Tupac
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items);
      //res.json(data.body) //Send back Tupacs data 
      res.render('artists.hbs', {items: data.body.artists.items} )
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    })
})


//Albums

 app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      let albums = data.body.items;
      albums = { ...albums };
      res.render("albums", { albums });
    },
    function(err) {
      console.error(err);
    }
  );
});
 

//Tracks

app.get("/tracks/:albumId", (req, res, next) => {
  let albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId, { limit: 20, offset: 0 }).then(
    function(data) {
      let tracks = data.body.items;
      res.render("tracks", { tracks });
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
