require('dotenv').config()

// require spotify-web-api-node package here:
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs')
const bodyParser = require('body-parser')

// Remember to insert your credentials here
const clientId = process.env.clientId,
    clientSecret = process.env.clientSecret;


console.log(process.env.PORT)

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

// Retrieve an access token // the routes go here:
spotifyApi.clientCredentialsGrant()
  .then( data => {
    console.log("It is connected to the Api")
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {console.log('Something went wrong when retrieving an access token', error)
  })


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials')



// setting the spotify-api goes here:


app.get('/', (req, res, next) => {
  res.render('index')
})


//artist
app.get("/artists", (req, res, next) => {
  console.log(req.body.artist)
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", {data: data.body.artists.items})
      console.log("I am receiving data from the API: ", data.body.artists.items)

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })

    .catch(err => {console.log("The error while searching artists occurred: ", err)})

})



app.get('/albums/:artistId', (req, res) => {
  console.log(req.params.artistId)

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
      console.log('Artist albums', data.body.items);
      res.render('albums', {albums: data.body.items} )
    })
  .catch(err => {console.error("The error while searching albums occurred: ", err)})

})


app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params.albumId)

  spotifyApi.getAlbumTracks(req.params.albumId)// Promise: when you get my request 
  .then(data => {                              //then render me this request to the browser  
      console.log('Albums Id', data.body.items)
      res.render('tracks', {tracks: data.body.items})
      //res.send({tracks: data.body.items[0].name}) //show me in the browser the object in items 0 ; songs name

      
    })
  .catch(err => {console.error("The error while searching albums occurred: ", err)})

})





















//renderiza la vista del formulario
app.get('/', (req, res, next) => res.render("index"))


app.listen(process.env.PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
