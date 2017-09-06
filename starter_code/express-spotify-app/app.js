const express        = require('express')
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi  = require('spotify-web-api-node')
const bodyParser     = require('body-parser')

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressLayouts)

app.set('layout', __dirname + '/views/layouts/main-layout')
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

const clientId = '5bab7bc0c1fd4f6da42ea252421d75a4',
    clientSecret = 'f83df6ba27f24e55a0d09e6dd42b2d48'

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

// Routes
app.get('/artists', (req, res) => {

})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err)
})

// Server Started
let port = 3000;
app.listen(port, () => {
  console.log(`My first app listening on port ${port}!`);
});