require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
const bodyParser = require('body-parser')

//----------------------------
const app = express();

const clientSecret = process.env.CLIENTSECRET, 
      clientId = process.env.CLIENTID

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
  })

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}))

hbs.registerPartials(`${__dirname}/views/partials`)


// setting the spotify-api goes here:

// the routes go here:
app.get('/', (req, res)=>{
  res.render('home')
})

app.get('/artists', (req, res)=>{
  let {artist} = req.query

  spotifyApi.searchArtists(artist)
    .then(data => {
      //console.log("The received data from the API: ", data.body)
      res.render('artists', data.body.artists)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err)
    })
})


app.get('/albums/:id', (req, res)=>{
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
      res.render('albums', data.body)
    })
  .catch(err=> {
      console.error(err)
    })
})

app.get('/tracks/:id', (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    console.log('Track information', data.body.items.length)
    console.log(data.body)
    res.render('tracks', data.body)
  })
  .catch(err => {
    console.log('Something went wrong!', err)
  })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
