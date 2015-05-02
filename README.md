# Thee Table
## Sharing music irl, but not really.

### Technologies Used
* MEAN Stack + Socket.io
* Bootstrap Material Design
* Snackbar.js
* Soundcloud API
* Soundcloud HTML5 Widget API

### Installation
* mongodb
* gulp
* npm
* bower

#### run the following commands to set up your local environment
* `mongod`
* `npm install`
* `bower install`
* `gulp mocha`

##### NOTES 

Be sure to save a local copy of the Soundcloud SDK in the `client/library` directory and name the file `sdk.js`

Before running `gulp mocha` you will need to create a local DB called `theeTable` and create a collection of `rooms`. Be sure to insert the following:

```
{
  "name": "lobby",
  "currentDJ": null,
  "currentSong": null,
  "currentTime": 0,
  "users": [],
  "chat": [],
  "queue": []
}
```
Once your local environment is set up successfully run `node bin/www` and navigate to http://localhost:1337