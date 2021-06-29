require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
app.all("/", (request, response)=> {
    response.render('homepage')
})


app.get("/artist-search", (request, response)=> {

    spotifyApi.searchArtists(request.query.artist)
    .then(data => {
        let results = data.body.artists.items
        //better: let results = {artistsArray: data.body.artists.items}
        console.log('The received data from the API: ', results);
        response.render( "artists-search-results", {results} )
    
    })
    .catch(err => console.log('Error while searching artists: ', err));
})


app.all("/albums/:id", (req, response)=> {
    spotifyApi.getArtistAlbums(req.params.id)
    .then( data => {
        let albumResults = data.body.items
        console.log("Albums= " , albumResults)
        response.render('albums', {albumResults})
    })
    .catch(err => console.log('Error while searching albums: ', err))
})

app.all("/tracks/:id", (req, response)=> {
    console.log(req.params.id)
    spotifyApi.getAlbumTracks(req.params.id)
    .then( data => {
        let tracksResults = data.body.items
        console.log("Tracks= " , tracksResults)
        response.render('tracks', {tracksResults})
    })
    .catch()
})




/* app.all("/beers/:id" , (req, res) => {
    punkAPI.getBeer(req.params.id)
    .then(data => {
      res.render("onebeer" , data[0])
    })
  })
  
 */


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));



