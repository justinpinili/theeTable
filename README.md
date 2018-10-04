# Thee Table - http://thee-table.herokuapp.com/
## Sharing music irl, but not really.

### Technologies Used
* MEAN Stack + Socket.io
* Bootstrap Material Design
* Snackbar.js
* Soundcloud API
* Soundcloud HTML5 Widget API

### Installation Requirements
* mongodb
* gulp
* npm
* bower

#### run the following commands to set up your local environment
* `mongod` - run mongodb locally
* `npm install` - install server side module dependancies
* `bower install` - install client side module dependancies
* `gulp mocha` - run unit tests for the server side

##### NOTES 

Be sure to save a local copy of the Soundcloud SDK in the `client/library` directory and name the file `sdk.js` so you can run locally.

Before running `gulp mocha` you will need to create a local DB called `theeTable` and create a collection of `rooms`. Be sure to insert the following:

```
var lobby = {
  "name": "lobby",
  "currentDJ": null,
  "currentSong": null,
  "currentTime": 0,
  "users": [],
  "chat": [],
  "queue": []
};
```

into the `rooms` collection. This is easily done from the mongo command line: `db.rooms.insert(lobby)`

Once your local environment is set up successfully run `node bin/www` and navigate to http://localhost:1337