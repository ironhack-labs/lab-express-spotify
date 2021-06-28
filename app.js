require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

//Connect to the API
spotifyWebApi
  .clientCredentialsGrant()
  .then(data => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error)
  );

//Routes

app.get("/", (req, res) => {
    res.render("home");
});

// app.get("/artists", async (req, res) => {
//     const allArtistsFromAPI = await spotifyWebApi.searchArtists();
//     allArtistsFromAPI.forEach(element => {
//         element= req.query;
//     });
//     console.log(req.query);
//     //res.render("artists", allArtistsFromAPI);
//   });

app.get("/artist-search", async (req, res) => {
    let artist = req.query.artist;  
    let results = await spotifyWebApi.searchArtists(artist);
    let artistsFromApi = results.body.artists.items;
    console.log(artistsFromApi);
    //console.log(artistsFromApi[0].images[0].url);
    res.render('artist-search', { artistsFromApi } );

//  let results = await spotifyApi.searchArtists(artist)
//     .then(results  =>  { 
//     console.log ('Os dados recebidos da API:',  results.body).catch (err => 
//         console.log ('Ocorreu um erro ao pesquisar artistas:', err));
// });
});

app.get('/albums/:artistId', async (req, res) => {  
    let results = await spotifyWebApi.getArtistAlbums(req.params.artistId);
    console.log(results.body.items);
    const albums = results.body.items;
    res.render("albums", { albums});
  });


  app.get('/tracks/:albumId', async (req, res) => {  
    let results = await spotifyWebApi.getAlbumTracks(req.params.albumId);
    console.log("tracks", results.body.items);
    const tracks = results.body.items;
    res.render("tracks", {tracks});
    //res.render("tracks");
  });

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
