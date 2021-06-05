module.exports.home = (req, res, next) => {
    res.render('commons/home', {
        title: 'Spotify, your music'
    })
}

