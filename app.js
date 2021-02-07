require('dotenv').config();

const { request } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi =require('spotify-web-api-node')
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

app.get('/', (req,res,next)=>{
    res.render('index')
})

app.get('/artist-search', async(req,res,next) => {
  let   clientPageSearch = req.query.artistSearch
  let   artistSearched =  await spotifyApi.searchArtists(clientPageSearch)

    res.render('artist-search-result',
    {
    dataArtist: artistSearched,
    search: clientPageSearch}
    )
   //console.log(artistSearched.body.artists.items)
})

app.get("/albums/:artistId",async (req,res,next)=>{
    let aId = String(req.params.artistId)
    let albumCheck = await spotifyApi.getArtistAlbums(aId)
    
    //console.log(albumCheck.body.items[0].artists[0])
    res.render("albums",{albumCheck})
})

app.get("/tracks/:albumId", async(req,res, next)=> {
    let album = await String(req.params.albumId)
    let albumCheck = await spotifyApi.getAlbum(album)
    let trackCheck = await spotifyApi.getAlbumTracks(album)
    console.log(albumCheck.body)
    res.render("tracks", {
      tracks: trackCheck,
      artistAlbum:albumCheck,
      releaseDate: albumCheck.body.release_date
    })
})
/*${artistClick}*/
//'23wEWD21D4TPYiJugoXmYb'
//server
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
