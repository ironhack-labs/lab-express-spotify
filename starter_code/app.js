const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
let allArtists = ["Eminem","Drake","Kid Cudi","Lil uzi vert","Lady Gaga", "Miley Cyrus", "Kanye West", 
"Aerosmith","Grateful Dead", "Rolling Stones", "Elvis","Tupac","Rihanna","Snoop Dogg","Michael Jackson","Cool and the Gang","Jay Z","Rocksteady Crew","2 Live Crew","Jurrasic 5",
"Del the funky homosapien","Gorillaz","Red hot chili peppers","Smashing pumpkins","U2","DJ Laz"]
// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'ce48874a2dc44b30a1644fef9eb8baab',
    clientSecret = '3ada1a064e1441fa8b353cf801021be3';

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
app.get('/',(req,res,next)=>{
  res.render('homepage');
})
app.get("/artists",(req,res,next)=>{
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render("artists",data.body.artists)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/random-artist",(req,res,next)=>{
  let random = Math.floor(Math.random() * allArtists.length);
  let randomArtist = allArtists[random];
  spotifyApi.searchArtists(randomArtist)
    .then(data => {
      res.render("artists",data.body.artists)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/albums/:artistId",(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render("albums",data.body)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/playlist-tracks/:playlistId",(req,res,next)=>{
  spotifyApi.getPlaylistTracks(req.params.playlistId)
    .then(data => {
      res.render("playlist-tracks",data.body)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/tracks/:albumId",(req,res,next)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render("tracks",data.body)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/new-releases",(req,res,next)=>{
  spotifyApi.getNewReleases()
  .then(data=>{
    res.render("new-releases",data.body.albums);
    console.log("The received data from the API: ", data.body);

  })
  .catch(err=>{
    console.log(err);
  })
})
app.get('/playlists',(req,res,next)=>{
  console.log(req.query.playlist);
  spotifyApi.searchPlaylists(req.query.playlist)
  .then((data)=>{
    res.render('playlist',data.body.playlists)
    console.log("The received data from the API: ", data.body.playlists)
  })
  .catch((err)=>{
    console.log(err);
  })
})
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
