require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// retrieve an access token
const getAccessToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    // console.log(`The access token is: ${data.body.access_token}`)
    spotifyApi.setAccessToken(data.body.access_token);
  } catch (error) {
    console.log(error);
  }
};
getAccessToken();

const app = express();

// hbs setup
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

hbs.registerPartials(`${__dirname}/views/partials`);

// setting the spotify-api goes here:

// the routes go here:
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/artists/:name?', async (req, res) => {
  console.dir(req.query);
  const data = await spotifyApi.searchArtists(req.query.name);
  console.log('query response from spotify: ', data);
  res.send(data); // send obj to this pace?;
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧')
);
