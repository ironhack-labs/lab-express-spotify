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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/homepage', (req, res)=>{
    res.render('search');
});

app.get('/artist-search', async (req, res)=>{
  try{
    let artistResponse = await spotifyApi.searchArtists(req.query.artist);
  //console.log(artistResponse.body.artists)
    res.render('artist-search-results', {result:artistResponse.body.artists.items})
  }
  catch(error){console.error(error)}
})

app.get('/albums/:artistsId', async (req, res)=>{
  try{
    let response = await spotifyApi.getArtistAlbums(req.params.artistsId)
    //console.log(response.body.items)
    res.render('albums', {answer: response.body.items})
  }

  catch(error){console.error(error)}
})


app.get('/tracks/:albumId', async (req, res) => {
  try{
    let response = await spotifyApi.getAlbumTracks(req.params.albumId)
    console.log('response', response.body.items);
    res.render('tracks',{info: response.body.items})

  }catch(error){
      console.error(error);
  }

});


//------------------END--------------------------------
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
