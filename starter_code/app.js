const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const PORT = process.env.PORT

app.use(express.static('public'))
app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
const clientId = 'bc1ea0a8dd044541bfefa3e90010f62b',
	clientSecret = '77cf1f3210d64a568f888fd544b47f85';

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
})

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

//RUTAS
//index  
app.get('/', (req,res) => {
	res.render('index') 
})


//Render All ARTISTS
app.get('/artists',(req,res) => {
	let artists = req.query.artist;
	//console.log(artists)
	  spotifyApi.searchArtists(artists)
		 .then(data => {
			 //console.log( data.body.artists.items[0]);
			  res.render('artists',{artists: data.body.artists.items})
		 })
		 .catch(err => {
			  console.log("Error while searching artists occurred: ", err)
	})
})


// Get ALBUMS
app.get('/albums/:id',(req,res) => {
	let albumid = req.params.id
	spotifyApi.getArtistAlbums(albumid)
	.then( data => {
		const albums = data.body.items
		console.log(data.body.items);
		res.render('albums', {albums})
	})
	.catch(err => {
		console.log("Error de album: ", err)
	})
})


//Get Albums Tracks
app.get('/tracks/:id', (req, res) => {
	let tracksId = req.params.id
	spotifyApi.getAlbumTracks(tracksId)
	.then((data) => {
		const tracks = data.body.items
		console.log(data.body.items)
		res.render('tracks', {tracks})
	})
	.catch(err => {
		console.log("Error de album: ", err)
	})
})



// setting the spotify-api goes here:






// the routes go here:
//app.use('/', require('./routes'))


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));