![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Express Spotify Searcher

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_eb6313ef8c1bd11e3732034ebd4edafa.png)

## Introduction

[Spotify](https://www.spotify.com/us/) is a super cool music streaming service that provides you access to tons of music without ever having to buy an album.

Today, we're going to build an Express app to search spotify for artists, albums, and tracks. In addition, we'll be able to play a preview of some of these songs.

To see the final product check out the deployed version: https://spotify-lab.herokuapp.com.

It may seem like a lot, but let's break it down into steps!


## Requirements

- Fork this repo
- Clone this repo


## Submission

- Upon completion, run the following commands:

```
$ git add .
$ git commit -m "done"
$ git push origin master
```
- Create Pull Request so your TAs can check up your work.


### `spotify-web-api-node`

Spotify is great for streaming music from the app, but they also have a [Web Service](https://en.wikipedia.org/wiki/Web_service) for us developers to play with.

We don't need to delve too deeply into what an API is until later, thanks to the npm package `spotify-web-api-node`. This package gives us simple methods to make requests to Spotify, and give us back artists, albums, tracks, and more.

The **Spotify** API ask for a `clientId` and `clientSecret` in order to have permissons to make requests. For getting both of them, follow these steps:
1. Navigate to [Spotify Developers](https://developer.spotify.com/my-applications/#!/)
2. Click on the "LOGIN" button. If you do not have an account they will ask you to create one, it´s free :wink:
3. After the login, click on the **Create an App** button.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_a3a19d215083c5526df1f53f3c1fdf6f.png)

4. Complete the fields and submit the form

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_db933b4f08d71ceff0b0d5d4ca124594.png)

5. We are ready to go! We have all the info we need :muscle: Let´s start!

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_8859d022ca1d53adc9f9ec829ec3d17b.png)

## Iteration 1 | Spotify API Setup

As always `fork` this repo, and clone it.

Then, inside the `starter_code` folder, create a new folder, and set up your package.json. Use the following commands:

```
$ mkdir express-spotify-app
$ cd express-spotify-app
$ npm init
$ npm install --save spotify-web-api-node prettyjson
$ touch app.js
```

Inside the `app.js` file, copy/paste the following code:

```javascript
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

```

:fire: *Styling should be the last thing you focus on. Functionality first this module!*

## Iteration 2 | Express Setup

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
    ├── views/layout
```

We will need some npm packages for this project, so let´s install them:

```
$ npm install --save body-parser hbs express morgan
```

:::info
Don't worry if it is not exactly the same! Specially on versions! And don't forget to **require** all this packages on your `app.js` file.
:::

```javascript
const express = require('express');
const app = express();
const hbs = require('hbs');
```

## Iteration 3 | Search for an Artist

### Step 1 | Create a Homepage

Create a simple home page. You'll need a basic index route, that renders a home page.

On this page, you should have a search form. This form should direct its query to `/artists`, and have one input with a name of `artist`.

![](https://i.imgur.com/YuTA0vQ.png=400x)


### Step 2 | Display results for artist search

Create the route `/artists`. This route will receive the search term from the query string, and make a search request using the Spotify Package.

Display the name, an image, and a button to show the albums for a particular artist on a new view.

The function we will use from the npm package is: `spotifyApi.searchArtists()`. So you should have something like this:

```javascript
spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
```

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_9dc721e76158df1836ef07565b5385c2.png)


## Iteration 4 | View Albums

When someone clicks on the "View Albums" button, they should be taken to a page to show all of the albums for that particular artist.

:zap: Check out the `getArtistAlbums` method in the `spotify-web-api-node` [package](https://www.npmjs.com/package/spotify-web-api-node) from npm.

**Hint**

Your route should look like the following:

```javascript
app.get('/albums/:artistId', (req, res) => {
  // code
});
```

Meaning that your `href` for the view more button is going to have to look like this:

```html
<a href="/albums/1UarLtyjvxGiRTsfFXxtnA">View More</a>
```

`1UarLtyjvxGiRTsfFXxtnA` is a unique ID for a particular artist. Replace that with the value you send to the view to make it dynamic!

![](https://i.imgur.com/oaoqQMj.png)

## Iteration 5 | View Tracks

Make the "View Tracks" button work on the albums page. This page should take you to a page with a list of all of the tracks on a particular album.

**Note**: :zap: Check out the `getAlbumTracks` method in the `spotify-web-api-node` [package](https://www.npmjs.com/package/spotify-web-api-node) from npm.

A track object comes with a `preview_url`, which is the source for a 30 second preview of a particular song. You can plug this into an HTML [`audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) tag, and it will play the preview.

![](https://i.imgur.com/XVKoeqg.png)

### Requirements

- 4 Pages with artist / album / track information populated from Spotify
  - Home
  - Artists
  - Albums
  - Tracks
- Basic dev level logging with [Morgan](https://www.npmjs.com/package/morgan)
- Some styling, it doesn't have to look like the example.
- A layout

Happy Coding! :heart:
