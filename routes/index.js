module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))

    app.use('/', require('./artist-search.routes.js'))
}