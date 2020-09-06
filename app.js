require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/albums/:artistID',(req,res,next)=>{
    //code goes here
    console.log("id quuer",req.params.artistID)
   const artistsid = spotifyApi.getArtistAlbums(req.params.artistID)
   .then((data) => {
     console.log('The received data from the API: ', data.body.items);
     res.render('albums',{artistName:data.body.items})
     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   })
   .catch((err) => console.log('The error while searching artists  ID occurred: ', err)
  );
})

   app.get('/list/:songID',(req,res,next)=>{
    //code goes here
 //   console.log("songlist ID",req.params.songID)
    const songsId = spotifyApi.getAlbumTracks(req.params.songID, { limit : 5, offset : 1 })
    .then((data) => {
      console.log('The received data from the API: ', data.body.items);
    //  console.log("url is ",data.body.items.preview_url)
     res.render('tracks',{songList:data.body.items})
     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})
.catch((err) => console.log('The error while searching artists songs list occurred: ', err)
);
   })
app.get('/artist-search/',(req,res)=>{
  const result = spotifyApi
  .searchArtists(req.query.artistSearch)
  .then((data) => {
    res.render('artist-search-results',{artistName:data.body.artists.items})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch((err) => console.log('The error while searching artists occurred: ', err)
  );
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
