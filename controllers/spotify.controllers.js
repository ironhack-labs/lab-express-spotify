const spotifyApi = require("../config/spotify.config");

module.exports.home = (req, res) => {
    res.render("pages/render", { home: true });
};

module.exports.result = (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then((data) => {
            const newData = data.body.artists.items;
            newData.forEach((e) => {
            e.ref = "albums";
            e.link = "View Albums";
            });

            res.render("pages/render", { search: true, data: newData });
        })
        .catch((err) => console.log("The error while searching artists occurred: ", err));
};

module.exports.albums = (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then((data) => {
            const newData = data.body.items;
            newData.forEach((e) => {
                e.ref = "tracks";
                e.link = "View Tracks";
            });

            res.render("pages/render", { search: true, data: newData });
        })
        .catch((err) => console.log("The error while searching artists occurred: ", err));
};

module.exports.tracks = (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.tracks)
        .then((data) => {
            res.render("pages/render", { track: true, data: data.body.items });
        })
        .catch((err) => console.log("The error while searching artists occurred: ", err));
};