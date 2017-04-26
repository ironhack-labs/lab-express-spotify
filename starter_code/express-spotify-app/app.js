const SpotifyWebApi = require('spotify-web-api-node')
const spotify = new SpotifyWebApi()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', (req, res, next) => {
  res.render('index')
})

app.post('/artists', (req, res, next) => {
  spotify.searchArtists(req.body.artist, {}, (err, data) => {
    if (err) throw err

    let artists = data.body.artists.items
    res.render('artists', { artists })
  })
})

app.get('/artists/:artistId', (req, res) => {
  spotify.getArtistAlbums()
})

app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
})
