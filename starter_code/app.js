const SpotifyWebApi = require('spotify-web-api-node'),
  express = require('express'),
  bodyParser = require('body-parser'),
	expressLayout = require('express-ejs-layouts'),
	//module = require('module'),
  app = express()

app.get('/', (req, res) => {
	res.send('Hello World!!')
})

// Remember to paste here your credentials
const clientId = 'ebc59619b9874451adf2518d983009c0',
    clientSecret = '60e32fb1773f45cc98aa80d507217460'

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err)
})

app.listen(3000, (req, res) => {
	console.log('App running on localhost:3000')
})
