const app = require('./app')
const PORT = process.env.PORT || 3000

app.listen(PORT, () =>
    console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`
    ));
