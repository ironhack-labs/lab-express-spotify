![Ironhack Logo](https://i.imgur.com/1QgrNNw.png)

# DE | Express Spotify Searcher

![](https://i.imgur.com/XhBF66a.png=500x)

## Introduction

[Spotify](https://www.spotify.com/us/) is a super cool music streaming service that provides you access to tons of music without ever having to buy an album.

Today, we're going to build an Express app to search spotify for artists, albums, and tracks. In addition, we'll be able to play a preview of some of these songs.

To see the final product check out the deployed version: https://iron-spotify.herokuapp.com/.

It may seem like a lot, but let's break it down into steps!


### `spotify-web-api-node`

Spotify is great for streaming music from the app, but they also have a [Web Service](https://en.wikipedia.org/wiki/Web_service) for us developers to play with.

We don't need to delve too deeply into what an API is until later, thanks to the npm package `spotify-web-api-node`. This package gives us simple methods to make requests to Spotify, and give us back artists, albums, tracks, and more.

First, create a new folder, and set up your package.json:

```
$ mkdir express-spotify-app && cd express-spotify-app
$ npm init
$ npm install --save spotify-web-api-node prettyjson
$ touch app.js
```

```javascript
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

spotify.searchArtists("The Beatles", {}, (err, data) => {
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists)
});

```

The object that Spotify sends us is *huge*. Let's open the node Chrome inspector to check it out:

```
node --inspect --debug-brk app.js
```

`data.body.artists.items` is an array of objects, those objects being different artists.

![](https://i.imgur.com/zprIbW4.png)


Why an array?

Well, when you search for "Kanye West", it will return a list of artists close to that name: ie "Kanye Best", and "Kanye West ft. T-Pain".

Let's take a look at that object:

![](https://i.imgur.com/fEbczuj.png)

Included with the Artist object is the name, id, images, and much more. The album and tracks returned are in a *very similar structure*.

#### In Express

Using the package in express can be a bit trickier. Until this point, we've made a request to a route, and then rendered a page. The Spotify package is asynchronous, meaning we don't want to render our view until it is finished retrieving the data. That would like something like this:

**Pseudocode**

```
// ...
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');

app.get('/some-route', (req, res, next) => {
  spotify.searchArtists("The Beatles", {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;
    // Render after the data from spotify has returned
    res.render('some-view', { artists });
  });
});
// ...
```

:fire: *Styling should be the last thing you focus on. Functionality first this module!*

## Iteration 0 | Setup

We've already set up our package.json, and `app.js`. You should set up an Express app with all of the packages we've used thusfar.

Your directory should look like this once you're done:

```
├── app.js
├── package.json
├── public
│   ├── public/images
│   ├── public/javascripts
│   └── public/stylesheets
│       └── public/stylesheets/style.css
└── views
    ├── views/layouts
```

You should also have the following packages installed:

```javascript
  "dependencies": {
    "body-parser": "~1.15.2",
    "ejs": "~2.5.2",
    "express": "~4.14.0",
    "express-ejs-layouts": "^2.2.0",
    "morgan": "~1.7.0",
    "spotify-web-api-node": "^2.3.6"
  }
```
## Iteration 1 | Search for an Artist

### Step 1 | [Create a Homepage](https://iron-spotify.herokuapp.com/)

Create a simple home page. You'll need a basic index route, that renders a home page.

On this page, you should have a search form. This form should direct its query to `/artists`, and have one input with a name of `artist`.

![](https://i.imgur.com/YuTA0vQ.png=400x)


### Step 2 | [Display results for artist search](https://iron-spotify.herokuapp.com/artists?artist=The+Beatles)

Create the route `/artists`. This route will receive the search term from the query parameters, and make a search request using the Spotify Package.

Display the name, an image, and a button to show the albums for a particular artist on a new view.

![](https://i.imgur.com/ZqjmoCZ.png=400x)

## Iteration 2 | [View Albums](https://iron-spotify.herokuapp.com/albums/3WrFJ7ztbogyGnTHbHJFl2)

When someone clicks on the "View Albums" button, they should be taken to a page to show all of the albums for that particular artist.

:zap: Check out the `getArtistAlbums` method in the `spotify-web-api-node` package.

**Hint**

You're going to need to use ejs inside of the "View Albums" link to create an href.

Your route should look like the following:

```javascript
app.get('/albums/:artistId', (req, res) => {
  // code
});
```

Meaning that your href for the view more button is going to have to look like this:

```html
<a href="/albums/1UarLtyjvxGiRTsfFXxtnA">View More</a>
```

`1UarLtyjvxGiRTsfFXxtnA` is a unique ID for a particular artist. Replace that with ejs to make it dynamic!

![](https://i.imgur.com/oaoqQMj.png)

## Iteration 3 | [View Tracks](https://iron-spotify.herokuapp.com/tracks/0n9SWDBEftKwq09B01Pwzw)

Make the "View Tracks" button work on the albums page. This page should take you to a page with a list of all of the tracks on a particular album.

**Note**: :zap: Check out the `getAlbumTracks` method in the `spotify-web-api-node` package.

A track object comes with a `preview_url`, which is the source for a 30 second preview of a particular song. You can plug this into an HTML [`audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) tag, and it will play the preview.

![](https://i.imgur.com/XVKoeqg.png)

### Requirements

- 4 Pages with artist / album / track information populated from Spotify
  - Home
  - Artists
  - Albums
  - Tracks
- Basic dev level logging with Morgan
- Some styling, it doesn't have to look like the example.
- A layout

Happy Coding!
