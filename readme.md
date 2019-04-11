![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Express Spotify Searcher

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_eb6313ef8c1bd11e3732034ebd4edafa.png)

## Introduction

[Spotify](https://www.spotify.com/us/) is a super cool music streaming service that provides you access to tons of music without ever having to buy an album.

Today, we're going to build an Express app to search Spotify for artists, albums, and tracks. In addition, we'll be able to play a preview of some of these songs.

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


## The key helper: `spotify-web-api-node` npm package

Spotify is great for streaming music from the app, but they also have a [Web Service](https://en.wikipedia.org/wiki/Web_service) for us developers to play with.

For purpose of this exercise we will use [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-js) npm package. This package gives us simple methods to make requests to Spotify, and give us back artists, albums, tracks, and more. 

**In this lab we have two main goals**:
- we are going to apply our knowledge of GET method and when and why to use req.query and req.params and 
- we are going to practice how to read the documentation (of this npm package particularly) and to use the given examples from the docs to successfully finish all the iterations.

### Registering the app and getting the credentials 
The **Spotify** API will need a `clientId` and `clientSecret` in order to give us permission to make requests and get some data back. In order to get clientId and clientSecret we have to register our app on the official Spotify Developers web site (you won't be charged for this, neither a credit card information will be required). Let's follow these couple of steps:
1. Navigate to [Spotify Developers](https://developer.spotify.com/my-applications/#!/)
2. Click on the "LOGIN" button. If you do not have an account they will ask you to create one, it´s free :wink:
3. After the login, click on the **Create an App** button.

The following screens might be outdated since Spotify changed its interface recently, but really they don't matter - just follow the steps, you got this!

<!-- ![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_a3a19d215083c5526df1f53f3c1fdf6f.png) -->

4. Complete the fields and submit the form

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_db933b4f08d71ceff0b0d5d4ca124594.png)

5. We are ready to go! We have all the info we need :muscle: Let´s start!

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_8859d022ca1d53adc9f9ec829ec3d17b.png)

## Iteration 1 | Spotify API Setup

You're pretty much given *almost* empty `starter_code` folder and that's because in the next couple of steps you'll create all the files you need. So far you have some basic setup in `app.js` but that's not quite enough. As you remember, in order to get some packages (including express one) in our app, we have to create `package.json` file. So let's start listing the steps:
1. create `package.json` (or as we can say: let's initialize our project :wink: )
2. `npm install --save express hbs spotify-web-api-node prettyjson`
3. inside the `app.js` file, require *spotify-web-api-node*
  ```js
  const SpotifyWebApi = require('spotify-web-api-node');
  ```
4. inside the `app.js` file, you'll find the comment where to paste the following code:

```javascript
// Remember to insert your credentials here
const clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })
```

:fire: *Styling should be the last thing you focus on. Functionality first!* 🙏🏻

## Iteration 2 | Express Setup

Now let's add a couple of folders and files in our app. Please follow the following set up:

```
├── app.js
├── package.json
├── public
│   ├── public/images
│   └── public/stylesheets
│       └── public/stylesheets/style.css
└── views
    ├── views/layout.hbs
```

As we can see, in your *app.js* we have required all the packages we are using:

```javascript
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
```
and now we are good to go. Let's open the [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-js) documentation and start our journey!

## Iteration 3 | Search for an Artist

### Step 1 | Create a Homepage

Create a route that renders a simple home page. You'll need a basic index route, that renders a home page. On this page you should have a small search `form` that has an input field receiving artist's name and a button that submits the request.
This form should direct its query to `/artists` (action = "/artists"). 
The end result should be something along these lines but leave styling for the end.

![](https://i.imgur.com/YuTA0vQ.png=400x)


### Step 2 | Display results for artist search

Okay, our search form submitted to `/artists` route. We still don't have this route created so let's do it!
This route will receive the search term from the `query` string, and make a search request using one of the methods of the Spotify npm package. You have the documentation open :wink: but we will help you with your first step.

The method we will use from the npm package is: `spotifyApi.searchArtists()`. In this route, you should have something like this:

```javascript
spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
```
In order to display the found artists information, create `artists.hbs` file inside `views` folder and display name, image, and button (or link) to show the albums for a particular artist on a new view (for now just create the button/link and we will take care of the rest in the next step). Again, styling is not your priority, so let's move to the next step.
![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_9dc721e76158df1836ef07565b5385c2.png)


## Iteration 4 | View Albums

On the `artists.hbs` page we created the `View albums` button/link and the users should be taken to *some other page* after clicking on it and there be able to see all the albums of that particular artist. **Hint**: the URL should include artist's `id` 🤓 and should change dynamically.

```html
<a href="/albums/someArtistIdGoesHere">View Albums</a>
```
So let's create a new page - `albums.hbs` where all the results will be displayed. Make sure you display the name and the cover of each album and add a button/link to see the tracks (next iteration). 

:zap: Check out the `.getArtistAlbums()` method in the [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-node) documentation.

**Hint**

Your route should look like the following:

```javascript
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});
```

![](https://i.imgur.com/oaoqQMj.png)

This is going good so far so let's finish up with our last iteration.

## Iteration 5 | View Tracks

Make the `View tracks` work on the albums page. This page should take you to a page with a list of all of the tracks on a particular album.

**Note**: :zap: Check out the `.getAlbumTracks()` method in the `spotify-web-api-node`  documentation.

A track object comes with a `preview_url`, which is the source for a 30 second preview of a particular song. You can plug this into an HTML [`audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) tag, and it will play the preview.

![](https://i.imgur.com/XVKoeqg.png)

### The summary of requirements

- Total of five pages with artist / album / track information populated from Spotify + layout + home.
- Some styling, it doesn't have to look like the example.


Happy Coding! :heart:
