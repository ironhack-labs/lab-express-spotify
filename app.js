require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebApi({

clientId: process.env.CLIENT_ID,
clientSecret: process.env.CLIENT_SECRET
    
});

//CONNECT TO THE API:
spotifyWebApi
  .clientCredentialsGrant()
  .then(data => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/home', (req, res) => {
    res.render('home')
})


app.get('/artist-search', async (req, res) => {
   
    const artists = req.query.artists;
    const results = await spotifyWebApi.searchArtists(artists);
    const artistsResult = results.body.artists.items;
    
    console.log(artistsResult[0].images[0]);
    
   res.render("artists-search-results", { artistsResult } );
});


app.get("/albums/:id", async (req, res) =>{
  
  const chosenAlbums =  await spotifyWebApi.getArtistAlbums(req.params.id);
  const allAlbums = chosenAlbums.body.items;

  res.render("albums", {allAlbums} );

   console.log(chosenAlbums)
});



app.get('/tracks/:albumId', async (req, res) => {
  const theresult = await spotifyWebApi.getAlbumTracks(req.params.albumId);
  const tracks = theresult.body.items;
  res.render("tracks", { tracks });

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
