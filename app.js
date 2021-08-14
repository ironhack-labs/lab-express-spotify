require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs');

app.use(express.urlencoded({ extended: true }));

const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
console.log('CLIENT ID: ', process.env.CLIENT_ID);
console.log('CLIENT SECRET: ', process.env.CLIENT_SECRET);
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

//retrieve an access 😜 token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((err) =>
    console.log('Something went wrong when retrieving an access token', err)
  );

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(`${__dirname}/views/partials`);

// setting the spotify-api goes here:

// Our routes go here:
app.get(`/`, (req, res) => {
  res.render('index');
});

app.get(`/artist-search`, (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      console.log(
        `The received data from the API:`,
        // JSON.stringify(data.body.artists)
        JSON.stringify({ data: data.body.artists.items })
      );
      res.render(`artist-search-results`, { data: data.body.artists.items });
    })
    .catch((err) => {
      console.log(`The error appeared while searching artists occured ${err}`);
    });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
