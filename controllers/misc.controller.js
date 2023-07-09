module.exports.getHome = (req, res, next) => {
    res.render('home', { title: 'Home' })
  }
