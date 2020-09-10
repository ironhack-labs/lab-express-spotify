module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    app.use('/artist-search', require('./base.routes.js'))


}