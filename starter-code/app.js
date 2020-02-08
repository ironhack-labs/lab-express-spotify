require('dotenv').config();

const express = require('express');
const app = express();
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


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
app.get('/', (req, res) => {
  res.render('index');
})

app.get('/artist-search',(req,res)=>{
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    let objectArtist = {
      searchedArtist: data.body.artists.items
    };
    res.render('artist-search-results', objectArtist);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})

app.get('/albums/:artistId',(req, res)=>{
  spotifyApi.getArtistAlbums(req.params.artistId,{limit: 20, offset: 20},(err,data)=>{
    if(err){
      console.error("something went wrong");
    }
    else{
      let objectAlbums = {
        artistAlbums: data.body.items
      };
      res.render("albums",objectAlbums);
    }
  });
});

app.get("/tracks/:trackId",(req, res) =>{
  spotifyApi.getAlbumTracks(req.params.trackId,{limit: 10, offset: 1})
  .then(data=>{
    let objectTrack ={
      artistTrack : data.body.items
    }
    res.render("tracks", objectTrack);
  })
  .catch(err=>{
    console.log("something with wrongvvv ",err);
  })
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));