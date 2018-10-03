const
  spotifyApi = require(`./spotify.api`),
  express    = require(`express`),
  app        = express(),
  bodyParser = require(`body-parser`),
  logger     = require(`morgan`),
  hbs        = require(`hbs`),
  path       = require(`path`);

var searchQuery; // input name

app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set(`views`, `${__dirname}/views`);
app.set(`view engine`, `hbs`);

hbs.registerPartials(`${__dirname}/views/partials`);

app.get(`/`, (req, res) => {
  console.log(`===>`);
  const data = {
    title: `Home | Express Spotify`,
    style: `index.css`
  };
  res.render(`index`, {data});
});

app.post(`/artists`, (req, res) => {
  console.log(`===>`);
  searchQuery = req.body.artists; // input name
  const
    data = {
      title: `Artists | Express Spotify`,
      style: `artists.css`,
      query: searchQuery
    }
  ;
  spotifyApi
    .searchArtists(searchQuery)
    .then( resObj => {
      const
        info = resObj.body.artists,
        artists = info.items
      ;
      // console.log(info);
      res.render(`artists`, {data, artists, info});
    })
    .catch( err => console.log(err) )
  ;
});

app.get(`/tracks`, (req, res) => {
  console.log(`===>`);
  const
    id = req.query.albumId,
    limit = 5
  ;
  spotifyApi
    .getAlbumTracks(id, { limit : limit, offset : 1 })
    .then( resObj => {
      const
        info = resObj.body,
        tracks = info.items,
        artist = tracks[0].artists[0].name,
        data = {
          title: `Tracks | Express Spotify`,
          style: `tracks.css`
        }
      ;
      // res.send(tracks[0])
      // res.json(info);
      res.render(`tracks`, {data, info, tracks, artist});
    })
    .catch( err => console.log(err) )
  ;
});

app.get(`/:artistId`, (req, res) => {
  console.log(`===>`);
  const
    id = req.params.artistId,
    data = {
      title: `Albums | Express Spotify`,
      style: `albums.css`
    }
  ;
  spotifyApi
    .getArtistAlbums(id)
    .then( resObj => {
      const
        info = resObj.body,
        albums = info.items,
        artist = albums[0].artists[0].name
      ;
      res.render(`albums`, {data, info, albums, artist});
    })
    .catch( err => console.log(err) )
  ;
});


app.listen(3000);