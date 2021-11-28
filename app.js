require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

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

app.get("/", (req, res)=>res.render('index'))

app.get("/artist-search/:name", async (req, res)=>{
    try{

    const artists = await (await spotifyApi.searchArtists(req.params.name)).body.artists.items

        res.render('searchResults', { artists }) // Render the page whith the result of artists search
console.log(artists)


    }catch(err){
        console.log('The error while searching was: ', err)
    }
})

app.get('/albums/:id', async(req, res) => {
    try{
        const name = await (await spotifyApi.getArtist(req.params.id)).body.name
        const albums = await (await spotifyApi.getArtistAlbums(req.params.id)).body.items
        res.render('albumsResults.hbs', { name, albums })
    }
    catch(err){
        console.log(chalk.bgRed('Error:', err))
    }
})


app.get("/searchResults", (req, res)=>res.render('searchResults'))

app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
