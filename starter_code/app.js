const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');




const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = '9e34f6e0e8684d3fb384e4d2aabbb7b5',
    clientSecret = '323bea18e431415cb77813eba3df70c5';

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

  console.log(req.query)
  console.log(res.query)
  res.render("index");
});


// app.get("/albums/:id", (req, res) => {
// spotifyApi.getArtistAlbums(req.params.id, {limit: 10}).then(function(data) {
//   return data.map(function(a) { return a.id; });
// })
// .then(function(albums) {
//   return spotifyApi.getAlbums(albums);
// }).then(function(data) {
//   console.log(data);
// });
// })
app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id).then(data=>{
    const albumsSorted = data.body.items;
    res.render("albums",{albums:albumsSorted});
      
    });
  })
  app.get("/tracks/:id", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(function(data) {
      // return data.tracks.map(function(t) { return t.id; });
      const songsSorted = data.body.items;
      console.log(songsSorted)
      res.render("tracks",{songs:songsSorted});
    })
    

  })



  
 
  
  



app.get("/artists", (req, res) => {
  
  spotifyApi.searchArtists(req.query.q)
    .then(data => {
        const artistName = data.body.artists.items[0].name;
        const artistImage = data.body.artists.items[0].images[0].url;
        const artistId = data.body.artists.items[0].id;

        // name: [0].name 
      console.log("The received data from the API: ",data.body.artists.items[0].id);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", {name: artistName,image:artistImage,id:artistId});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

  

app.listen(3010, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));


