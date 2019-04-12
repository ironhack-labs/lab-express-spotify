const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const app = express();



// require spotify-web-api-node package here:



hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '5f6377e1b088440e9c11693b6493459d',
    clientSecret = 'd1d3b5b5e3264d9a9e286ca48a0d5e8f';

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
    // console.log('Something went wrong when retrieving an access token', error);
  })



// the routes go here:

app.get('/', (req, res, next) => {
  res.render("home");
});  

app.post("/searchartist", (req,res)=>{
  
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      let artist = data.body.artists.items;
      res.render("artist", {artist});
    })
    .catch(err => {
      // console.log("The error while searching artists occurred: ", err);
    })
})


// albumData => {
//   var albumNames = albumData.body.items.map(album => ({
//       albumName: album.name,
//       photo: album.images[0].url
//   }))

//   res.render("albums", { albumNames })
// })
// })
// .catch(err => {
// console.log("The error while searching artists occurred: ", err);
// })

// }


app.get("/albums/:artist",(req,res)=>{
  
  spotifyApi.getArtistAlbums(req.params.artist)
  .then(data=>{ 
    let album = data.body;
    // console.log(album)
    res.render("albums",{album})})
})


app.get("/tracks/:album",(req,res)=>{
  
  spotifyApi.getAlbumTracks(req.params.album)
  .then(data=>{ 
    let tracks = data.body;
    // console.log(tracks)
    res.render("tracks",{tracks})})
})




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
