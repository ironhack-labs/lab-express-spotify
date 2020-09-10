module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    app.use('/artist-search', require('./artist-search.js'))
    app.use('/albums', require('./albums.js'))
    app.use('/tracks', require('./tracks.js'))

}

