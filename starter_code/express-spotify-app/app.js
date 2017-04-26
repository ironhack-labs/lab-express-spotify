const SpotifyWebApi = require('spotify-web-api-node')
const spotify = new SpotifyWebApi()
const express = require('express')
const app = express()

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', (req, res, next) => {
  res.render('index')
})
app.post('/artists', (req, res, next) => {
  spotify.searchArtists("The Beatles", {}, (err, data) => {
    if (err) throw err
    let artists = data.body.artists.items
    console.log(artists)
    res.render('artists', { artists })
  })
})

app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
})
