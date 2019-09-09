//setup dotenv package

require("dotenv").config();



const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


// setting the spotify-api goes here:
const clientId = process.env.CLIENT_ID,
 clientSecret = process.env.CLIENT_SECRET;

 const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });

  
  spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })  






// the routes go here:
app.get("/",(req,res)=>{
    res.render("index.hbs")
})
app.get("/artists",(req,res)=>{
    const artista=req.query.artists
    console.log(artista)
    spotifyApi.searchArtists(artista)
    .then(data => {
        
        let cartas=data.body.artists.items
        res.render("artists.hbs",{cartas} );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
    

})

app.get("/albums/:artist",(req,res)=>{
    let artistId= req.params.artist;
    spotifyApi.getArtistAlbums(artistId)
  .then(function(data) {
      let albums=data.body.items;
    
    res.render("albums.hbs", {albums});


  }, function(err) {
    console.error(err);
  });

})

app.get("/tracks/:album",(req,res)=>{
    let albumId=req.params.album;
    spotifyApi.getAlbumTracks(albumId).then(function(data) {
        console.log(data.body.items);
        let track=data.body.items;
        res.render("tracks.hbs", {track});

    }, function(err) {
      console.error(err);
    });
   

})


  


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
