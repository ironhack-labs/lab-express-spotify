![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Express Spotify Searcher

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_eb6313ef8c1bd11e3732034ebd4edafa.png)

## Introduction

[Spotify](https://www.spotify.com/us/) is a super cool music streaming service that provides you access to tons of music without ever having to buy an album.

Today, we're going to build an Express app to search Spotify for artists, albums, and tracks. Also, we'll be able to play a preview of some of these songs.

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

For the purpose of this exercise, we will be using the [`spotify-web-api-node` npm package](https://www.npmjs.com/package/spotify-web-api-node) (this is the link that will take you to the documentation so go ahead and open it). As we can find in the docs, this package gives us simple methods to make requests to Spotify, and give us back artists, albums, tracks, and more.

**In this lab, we have two main goals**:

- We are going to apply our knowledge of GET method and when and why to use `req.query` and `req.params`.
- We are going to practice how to **read the documentation** (of this npm package particularly) and how to use the examples provided by the docs to successfully finish all the iterations.

### Registering the app and getting the credentials

The **Spotify** API will need a `clientId` and `clientSecret` in order to give us permission to make requests and get some data back. To get `clientId` and `clientSecret`, we have to register our app on the official Spotify Developers web site (you won't be charged for this, and no credit card information will be required). Let's follow these steps:

1. Navigate to [Spotify Developers](https://developer.spotify.com/my-applications/#!/).
2. Click on the "Log In" button. If you do not have an account, you will be asked to create one, it´s free :wink:.
3. After logging in, click on the **Create an App** button.

The following screens might be out of date, since Spotify is constantly iterating on their interface, but that shouldn't stop you from completing these steps. You got this!

<!-- ![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_a3a19d215083c5526df1f53f3c1fdf6f.png) -->

4. Fill the fields and submit the form.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_db933b4f08d71ceff0b0d5d4ca124594.png)

5. We are ready to go! We have all the info we need :muscle: Let´s start!

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_8859d022ca1d53adc9f9ec829ec3d17b.png)

## Iteration 1 | Spotify API Setup

In the next few steps, you'll create all of the files that you need. So far, you have some basic setup in `app.js`, but that's not quite enough. As you remember, to get some packages (including `express`) in our app, we have to have them in the `package.json` file. So let's start listing the steps:

1. Let's install all the dependencies we need to successfully run this app:
   `npm install express hbs spotify-web-api-node dotenv`.
2. `nodemon` is installed as a dev dependency (our app doesn't depend on it but it helps us in the development process), which means we can use nodemon to run the app with: **`npm run dev`**.

3. Inside of the `app.js` file, require `spotify-web-api-node`.

```js
const SpotifyWebApi = require('spotify-web-api-node');
```

4. Inside of the `app.js` file, you'll find the place where you should paste the following code:

```javascript
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
```

5. See this above?

```js
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
```

To avoid making our API keys public, we don't want to add and commit them. We'll use a package named `dotenv` for that.

This package is imported at the very beginning of `app.js`. All that is left to do is to add your keys in the `.env` file.
So go ahead and create a `.env` file and paste the following lines there, replacing the text with your credentials.

```
CLIENT_ID=your clientId goes here
CLIENT_SECRET=your clientSecret goes here
```

:zap: The `.env` is referred to in the `.gitignore` file so you're safe!

:fire: _Styling should be the last thing you focus on. Functionality first!_ 🙏🏻

## Iteration 2 | Express Setup

Now let's create a `views` folder and let's add the `layout.hbs` file in it.
At this moment we should have the following structure of folders and files:

```
lab-express-spotify
      ├── app.js
      ├── package.json
      ├── package-lock.json
      ├── public
      │    ├── images
      │    └── stylesheets
      │         └── style.css
      └── views
            └── layout.hbs
```

As we can see, in your _app.js_ we have required all the packages we need for now:

```javascript
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
```

We are good to go. Let's open the [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-node) documentation and start our journey!

## Iteration 3 | Search for an Artist

**You can keep all your routes in the `app.js` after where it states: _// Our routes go here:_.**

### Step 1 | Create a Homepage

Create a route that renders a simple home page. You'll need a basic index route, that renders a home page. On this page, you should have a small search `form` that has an input field receiving an artist's name and a button that submits the request.

This form should direct its query to `/artist-search` (`action="/artist-search", method="GET"`).
The result should be something along these lines but leave styling for the end.

![](https://i.imgur.com/YuTA0vQ.png=400x)

### Step 2 | Display results for artist search

Okay, our search form submitted to `/artist-search` route. We still don't have this route created so let's do it!
This route will receive the search term from the `query` string, and make a search request using one of the methods of the Spotify npm package. You have the documentation open :wink: but we will help you with your first step.

The method we will use from the npm package is: `spotifyApi.searchArtists()`. In this route, you should have something like this:

```javascript
spotifyApi
  .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
```

In order to display the found artists' information, create `artist-search-results.hbs` file inside `views` folder and display name, image, and button (or link) to show the albums for a particular artist on a new view (for now just create the button/link and we will take care of the rest in the next step). Again, styling is not your priority, so let's move to the next step.
<br><br>
![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_9dc721e76158df1836ef07565b5385c2.png)

## Iteration 4 | View Albums

On the `artist-search-results.hbs` page we created the `View albums` button/link. Users should be taken to _some other page_ after clicking on it and there be able to see all the albums of that particular artist. **Hint**: the URL should include artist's `id` 🤓 and should change dynamically.

```html
<a href="/albums/someArtistIdGoesHere">View Albums</a>
```

So let's create a new page - `albums.hbs` where all the results will be displayed. Make sure you show the _name_ and the _cover_ of each album and add a button/link to see the tracks (next iteration).

:zap: Check out the `.getArtistAlbums()` method in the [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-node) documentation.

**Hint**:

Your route should look like the following:

```javascript
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});
```

![](https://i.imgur.com/oaoqQMj.png)

This is going good so far, so let's finish up with our last iteration.

## Iteration 5 | View Tracks

Create the `View tracks` link on the albums page. This link should take you to a page with a list of all of the tracks on a particular album.

**Hint**: The link to the tracks page should have each album's _id_ in it. <br>
**Note**: :zap: Check out the `.getAlbumTracks()` method in the `spotify-web-api-node` documentation.

A track object comes with a `preview_url`, which is the source for a 30-second preview of a particular song. You can plug this into an HTML [`audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) tag, and it will play the preview.

![](https://i.imgur.com/XVKoeqg.png)

### The summary of requirements

- Total of five pages with (1)artist / (2)album / (3)track information (all populated from Spotify) + (4)layout + (5)home.
- Some styling, it doesn't have to look like the example.

Happy Coding! 💙
