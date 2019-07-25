const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')
const clientId = process.env.CLIENTID,
	clientSecret = process.env.CLIENTSECRET

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
})

spotifyApi
	.clientCredentialsGrant()
	.then(data => {
		spotifyApi.setAccessToken(data.body['access_token'])
	})
	.catch(error => {
		console.log('Something went wrong when retrieving an access token', error)
	})

router.get('/', (req, res, next) => {
	spotifyApi
		.searchArtists(`${req.query.artist}`)
		.then(data => {
			console.log('The received data from the API: ', data.body.artists.items[0].id)
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			res.render('artist-list', { data: data.body.artists.items })
		})
		.catch(err => {
			console.log(req.query.artist)
			console.log('The error while searching artists occurred: ', err)
		})
})

module.exports = router
