require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

// require spotify-web-api-node package here:

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:
app.get('/', (req, res) => {
	res.render('index')
})
app.get('/artist-search', (req, res) => {
	/* 	console.log('query :', req.query)
	let query = req.query
	// res.render('index')
	console.log(query) */

	spotifyApi
		.searchArtists(req.query.artist)
		.then((data) => {
			//console.log('The received data from the API: ', data.body)
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
		//	console.log('Entro a endpoint')
			//const items = {items: data.body.artists.items}
			let { items } = data.body.artists
			//console.log(items)
			res.render('artist-search-results', { items: items })
		})
		.catch((err) => console.log('The error while searching artists occurred: ', err))
})
app.get('/albums/:id', (req, res) => {
	console.log('ID :', req.params.id)
	spotifyApi
		.getArtistAlbums(req.params.id)
		.then((data) => {
			console.log(data.body)
			return res.render('album-detail', { items: data.body.items, id: data.body.id })
		})
		.catch((err) => console.log(err))
})
app.get('/tracks/:id', (req, res) => {
	//console.log('ID :', req.params.id)
	spotifyApi
		.getAlbumTracks(req.params.id)
		.then((data) => {
			//console.log(data.body)
			return res.render('tracks', { items: data.body.items })
		})
		.catch((err) => console.log(err))
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
