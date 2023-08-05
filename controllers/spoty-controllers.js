exports.home = (req, res) => {
    res.send("Welcome to Spotify home!");
  };
  
  exports.artists = (req, res) => {
    res.send("Artist search results");
  };
  
  exports.albums = (req, res) => {
    const albumId = req.params.id;
    res.send(`Album details for album with id ${albumId}`);
  };
  
  exports.tracks = (req, res) => {
    const albumId = req.params.id;
    res.send(`Tracks of album with id ${albumId}`);
  };
