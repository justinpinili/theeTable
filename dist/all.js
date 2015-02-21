angular.module("theeTable",["ui.router","theeTable.controllers","LocalStorageModule","theeTable.services","theeTable.directives","ui.bootstrap","ui.sortable"]).config(["$stateProvider","$urlRouterProvider","localStorageServiceProvider",function(e,o,t){t.setPrefix("theeTable"),e.state("home",{url:"/home",controller:["$scope",function(e){e.$parent.showApp=!1}],templateUrl:"templates/app.html"}).state("rooms",{url:"/rooms",controller:"roomsController",templateUrl:"templates/controllers/rooms.html"}).state("room",{url:"/rooms/:roomName",controller:"roomController",templateUrl:"templates/controllers/room.html",onEnter:["theeTableSocket",function(e){e.connect()}],onExit:["theeTableSocket",function(e){e.disconnect()}]}).state("logout",{url:"/logout",controller:["localStorageService","$location","$scope",function(e,o,t){e.remove("jwt"),t.$parent.showApp=!1,t.$parent.currentUser=void 0,t.$parent.soundcloudID=void 0,t.$parent.loggedout?($.snackbar({content:"<i class='mdi-alert-error big-icon'></i> You have logged into Thee Table from another source. Good-bye!",timeout:1e4}),delete t.$parent.loggedout):$.snackbar({content:"<i class='mdi-file-file-upload big-icon'></i> You have successfully logged out of Thee Table. Good-bye!",timeout:1e4}),o.path("/")}]}),o.otherwise("/home")}]),angular.module("theeTable.controllers",[]),angular.module("theeTable.services",[]),angular.module("theeTable.directives",[]),angular.module("theeTable.controllers").controller("authController",["$scope","$location","localStorageService","theeTableAuth","theeTableUrl","userInRoom","$modalInstance","getUserInfo","currentSocket","loginSC",function(e,o,t,n,r,s,a,i,l,c){e.current="login",e.url=r.getUrl()+"/user/login",e.prompt={},e.prompt.username="Enter your username.",e.prompt.password="Enter your password.",s=!1,e.switchForm=function(){"login"===e.current?(e.current="new",e.prompt.username="Choose a new username.",e.prompt.password="Choose a new password."):(e.current="login",e.prompt.username="Enter your username.",e.prompt.password="Enter your password."),e.url=""+r.getUrl()+"/user/"+e.current},e.auth=function(r,s){n.siteAccess(e.url,r,s,function(n){return n.message?(e.message=n.message,void(e.login.password="")):(t.set("jwt",n.jwt),void i(function(t){l.emit("userName",{username:t.username}),e.$parent.showApp=!0,a.close(),o.path("/rooms")}))})},e.authSC=function(){var s=function(c,u,m){n.siteAccess(""+r.getUrl()+c,m,"abc",function(n){return n.message?u?void s("/user/new",!1,m):(e.message=n.message,void(e.login.password="")):(t.set("jwt",n.jwt),void i(function(t){l.emit("userName",{username:t.username}),e.$parent.showApp=!0,a.close(),o.path("/rooms")}))})};c(function(e){s("/user/login",!0,e.username)})},e.login={},e.authDisabled=function(){return void 0===e.login.username||void 0===e.login.password||""===e.login.username||""===e.login.password?!0:!1},e.closeModal=function(){a.close()}}]),angular.module("theeTable.controllers").controller("createRoomController",["$scope","$modalInstance","currentSocket","theeTableRooms",function(e,o,t,n){e.closeModal=function(){o.close()},e.room={},e.create=function(r){return r=r||$("#room-name").val(),""===r||void 0===r?void(e.message="Your new room cannot have a blank name."):(n.createRoom(r,function(n){return n.message?void(e.message=n.message):(t.emit("addRoom",{room:n.name}),void o.close())}),e.room.value="",void $("#room-name").val(""))}}]),angular.module("theeTable.controllers").controller("mainController",["$scope","localStorageService","theeTableAuth","$modal","theeTableSocket","theeTableSoundcloud","theeTableUrl","$location",function(e,o,t,n,r,s,a,i){var l=SC.initialize({client_id:a.getID(),redirect_uri:""+a.getUrl()+"/success"});e.sc=s.setSCinstance(l),e.socket=r,e.socket.on("signOn",function(o){e.currentUser&&o.username===e.currentUser.username&&o.loginTime!==e.currentUser.loginTime&&(e.loggedout=!0,i.path("/logout"))}),e.inRoom=function(){return e.userInRoom?!0:!1},e.getUserInfo=function(o){t.getUserInfo(function(t){return t.message?void 0:(e.currentUser=t,void(o&&o(t)))})},e.credits=function(){n.open({templateUrl:"./../templates/modals/credits.html",controller:["$scope","$modalInstance",function(e,o){e.closeModal=function(){o.close()}}],size:"sm"})},e.auth=function(){if(t.verifyJwt(!0))return e.showApp=!0,void i.path("/rooms");n.open({templateUrl:"./../templates/modals/auth.html",controller:"authController",size:"lg",resolve:{userInRoom:function(){return e.userInRoom},getUserInfo:function(){return e.getUserInfo},currentSocket:function(){return e.socket},loginSC:function(){return e.loginSC}}})},e.viewFavorites=function(){n.open({templateUrl:"./../templates/modals/viewFavorites.html",controller:"viewFavoritesController",size:"lg",resolve:{currentSocket:function(){return e.socket}}})},e.viewFavoriteRooms=function(){n.open({templateUrl:"./../templates/modals/viewFavoriteRooms.html",controller:"viewFavoriteRoomsController",size:"lg",resolve:{currentSocket:function(){return e.socket}}})},e.getSoundcloudID=function(){return s.getSoundcloudID()},e.getSCinstance=function(){return s.getSCinstance()},e.loginSC=function(o){s.loginSC(function(){e.$apply(function(){e.soundcloudID=s.getSoundcloudID()}),o&&o(e.soundcloudID)})},e.likeSongOnSC=function(e){s.like(e)}}]),angular.module("theeTable.controllers").controller("managePlaylistController",["$scope","$modalInstance","$modal","theeTableAuth","loginSC","getSoundcloudID","getSCinstance","theeTableTime","theeTableSoundcloud",function(e,o,t,n,r,s,a,i,l){e.playlist=[],n.getUserInfo(function(o){e.playlist=o.playlist});var c=function(e){for(var o=[],t=0;t<e.length;t++)o.push({source:e[t].source||e[t].permalink_url,title:e[t].title,artist:e[t].artist||e[t].user.username,length:e[t].length||e[t].duration,soundcloudID:e[t].soundcloudID||e[t].id});return o};e.searchSC=function(){t.open({templateUrl:"./../templates/modals/search.html",controller:"searchController",size:"lg",resolve:{playlist:function(){return e.playlist},getSCinstance:function(){return a}}})},e.sortableOptions={stop:function(){$.snackbar({content:"<i class='mdi-editor-format-list-numbered big-icon'></i> Your playlist order has beeen updated."}),e.$parent.newPlaylist=c(e.playlist)}},e.remove=function(o){$.snackbar({content:"<span class='glyphicon glyphicon-trash big-icon'></span> "+e.playlist[o].title+" has been removed from your playlist."}),e.playlist.splice(o,1),e.$parent.newPlaylist=c(e.playlist)},e.convertTime=function(e){return i.convertTime(e)},e.connectSC=function(){var o=function(){e.possiblePlaylists="start",l.getPlaylists(function(o,t){e.$apply(function(){e.likes=o,e.possiblePlaylists=t})})};void 0===s().id?r(function(){e.$apply(function(){o()})}):o()},e.importPlaylist=function(o,t){e.$parent.newPlaylist=c("likes"===t?e.likes:o.tracks),e.playlist=e.$parent.newPlaylist,delete e.possiblePlaylists},e.close=function(){o.close()}}]),angular.module("theeTable.controllers").controller("roomController",["$scope","$state","$stateParams","$location","$sce","localStorageService","theeTableAuth","theeTableRooms","theeTableTime","$modal",function(e,o,t,n,r,s,a,i,l,c){e.$parent.socket.on("usersInRoom",function(o){e.room.users=o.users}),e.$parent.socket.on("updatedChat",function(o){e.room.chat=o.chat,$(".chats").animate({scrollTop:$(document).height()+1e3},"slow")}),e.$parent.socket.on("updatedRooms",function(o){e.$parent.currentUser.rooms=o.rooms}),e.$parent.socket.on("rotatedPlaylist",function(o){e.$parent.currentUser&&(e.$parent.currentUser.playlist=o.playlist,e.$parent.socket.emit("newQueue",{queue:e.room.queue}))}),e.$parent.socket.on("updatedPlaylist",function(o){return o.error?void $.snackbar({content:"<i class='mdi-alert-error big-icon'></i> "+o.error}):(e.$parent.currentUser.playlist=o.playlist,void(o.title&&$.snackbar({content:"<i class='mdi-av-playlist-add big-icon'></i> "+o.title+" has been added to your playlist."})))}),e.$parent.socket.on("updatedQueue",function(o){e.room.queue=o.queue,o.currentDJ&&(e.room.currentDJ=o.currentDJ,e.room.currentSong=o.currentSong,e.currentSong=r.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+o.currentSong.source).toString())}),e.$parent.socket.on("updatedCurrentTime",function(o){e.room.currentTime=o.time}),e.$parent.socket.on("rotatedQueue",function(o){e.room.queue=o.queue,e.room.currentDJ=o.currentDJ,e.room.currentSong=o.currentSong,e.room.currentTime=o.currentTime,o.currentDJ===e.$parent.currentUser.username&&(e.socket=e.$parent.socket)}),e.$parent.socket.on("roomUpdate",function(o){e.room=o.room,null===o.room.currentDJ&&(e.currentSong=null)}),e.$parent.socket.on("updatedFavorites",function(o){return o.error?void $.snackbar({content:"<i class='mdi-alert-error big-icon'></i> "+o.error}):(e.$parent.currentUser.favorites=o.favorites,void(o.title&&$.snackbar({content:"<i class='mdi-action-favorite big-icon'></i> "+o.title+" has been added to your liked songs"})))}),e.$parent.socket.on("updatedRooms",function(o){e.$parent.currentUser.rooms=o.rooms}),e.room={},e.socket=e.$parent.socket,e.newURL,e.newPlaylist,e.$parent.userInRoom=!0,e.visitor;var u=function(){c.open({templateUrl:"./../templates/modals/auth.html",controller:"signupController",size:"lg",resolve:{userInRoom:function(){return e.$parent.userInRoom},getUserInfo:function(){return e.$parent.getUserInfo},currentSocket:function(){return e.$parent.socket},loginSC:function(){return e.$parent.loginSC},roomName:function(){return t.roomName}}})};e.managePlaylist=function(){if(e.visitor)return void u();c.open({templateUrl:"./../templates/modals/managePlaylist.html",controller:"managePlaylistController",size:"lg",resolve:{loginSC:function(){return e.loginSC},getSoundcloudID:function(){return e.getSoundcloudID},getSCinstance:function(){return e.getSCinstance}}})},i.getRoomInfo(t.roomName,function(o){$.snackbar({content:"<i class='mdi-file-file-download big-icon'></i> Welcome to "+o.name}),e.room=o,a.verifyJwt(!0)?e.$parent.getUserInfo(function(o){e.$parent.socket.emit("roomEntered",{roomName:t.roomName,user:o.username})}):(e.$parent.socket.emit("roomEntered",{roomName:t.roomName,user:"visitor"}),e.visitor=!0),null!==o.currentDJ&&(e.currentSong=r.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+o.currentSong.source).toString())}),e.$parent.showApp=!0,e.$watch("newSong",function(o){void 0!==o&&e.$parent.socket.emit("newPlaylistItem",{song:{source:o.source,title:o.title,artist:o.artist,length:o.length,soundcloudID:o.soundcloudID}})}),e.$watch("newPlaylist",function(o){void 0!==o&&e.$parent.socket.emit("newPlaylist",{playlist:o})}),e.like=function(o){e.$parent.socket.emit("addToLikes",{song:o}),e.$parent.getSoundcloudID()&&(e.$parent.likeSongOnSC(o.soundcloudID),$.snackbar({content:"<i class='mdi-file-cloud-queue big-icon'></i> "+o.title+" has been added to your soundcloud likes"}))},e.addToQueue=function(){return e.visitor?void u():e.$parent.currentUser.playlist.length>0?void e.$parent.socket.emit("addToQueue",{user:e.$parent.currentUser.username}):void $.snackbar({content:"<i class='mdi-notification-sms-failed big-icon'></i> Sorry, you must have a song on your playlist to enter the queue"})},e.skip=function(){e.$parent.socket.emit("updatePlaylist",{username:e.$parent.currentUser.username})},e.removeFromQueue=function(){e.$parent.socket.emit("removeFromQueue",{user:e.$parent.currentUser.username})},e.storedInUser=function(){return e.room&&e.$parent.currentUser&&-1!==e.$parent.currentUser.rooms.indexOf(e.room.name)?!0:!1},e.addRoom=function(){$.snackbar({content:"<i class='mdi-action-grade big-icon'></i> "+e.room.name+" has been added to your favorite rooms"}),e.$parent.socket.emit("addRoom",{room:e.room.name})},e.storedInLikes=function(){if(e.room&&e.$parent.currentUser)for(var o=0;o<e.$parent.currentUser.favorites.length;o++)if(e.$parent.currentUser.favorites[o].soundcloudID===e.room.currentSong.soundcloudID)return!0;return!1},e.convertTime=function(e){return l.convertTime(e)}}]),angular.module("theeTable.controllers").controller("roomsController",["$scope","$location","localStorageService","theeTableAuth","theeTableRooms","$modal",function(e,o,t,n,r,s){e.rooms=[],e.roomSearch={},e.$parent.userInRoom=!1,e.$parent.showApp=!0,r.getAllRooms(function(o){e.rooms=o.rooms,n.verifyJwt(!0)?(e.$parent.getUserInfo(),e.$parent.showApp=!0,e.favoriteRooms=[],n.getUserInfo(function(o){e.favoriteRooms=o.rooms})):e.visitor=!0}),e.navigate=function(e){o.path("/rooms/"+e)},e.createRoom=function(){s.open({templateUrl:"./../templates/modals/createRoom.html",controller:"createRoomController",size:"lg",resolve:{currentSocket:function(){return e.$parent.socket}}})},e.remove=function(o){$.snackbar({content:"<span class='glyphicon glyphicon-trash big-icon'></span> "+e.favoriteRooms[o]+" has been removed to your favorite rooms list"}),e.favoriteRooms.splice(o,1);for(var t=[],o=0;o<e.favoriteRooms.length;o++)t.push(e.favoriteRooms[o]);e.$parent.socket.emit("newRooms",{rooms:t})}}]),angular.module("theeTable.controllers").controller("searchController",["$scope","$modalInstance","$modal","playlist","getSCinstance","theeTableSoundcloud","theeTableTime",function(e,o,t,n,r,s,a){e.soundcloud={},e.search=function(o){e.soundcloud.results=[],e.searching=!0,o=$("#soundcloudSearch").val(),s.searchTracks(o,function(o){e.searching=!1,e.$apply(function(){e.soundcloud.results=o})}),e.soundcloud.query="",$("#soundcloudSearch").val("")},e.convertTime=function(e){return a.convertTime(e)},e.addSongToPlaylist=function(o,t,r,s,a,i){e.soundcloud.results.splice(i,1),e.$parent.newSong={source:o,title:t,artist:r,length:s,soundcloudID:a},n.push({source:o,title:t,artist:r,length:s,soundcloudID:a})},e.close=function(){o.close()}}]),angular.module("theeTable.controllers").controller("signupController",["$scope","$location","localStorageService","theeTableAuth","theeTableUrl","userInRoom","$modalInstance","getUserInfo","currentSocket","loginSC","roomName",function(e,o,t,n,r,s,a,i,l,c){e.current="new",e.url=r.getUrl()+"/user/new",e.prompt={},e.prompt.username="Choose a new username.",e.prompt.password="Choose a new password.",s=!1,e.signupController=!0,e.auth=function(r,s){n.siteAccess(e.url,r,s,function(n){return n.message?(e.message=n.message,void(e.login.password="")):(t.set("jwt",n.jwt),void i(function(t){l.emit("userName",{username:t.username}),e.$parent.showApp=!0,a.close(),o.path("/rooms")}))})},e.authSC=function(){var s=function(c,u,m){n.siteAccess(""+r.getUrl()+c,m,"abc",function(n){return n.message?u?void s("/user/new",!1,m):(e.message=n.message,void(e.login.password="")):(t.set("jwt",n.jwt),void i(function(t){l.emit("userName",{username:t.username}),e.$parent.showApp=!0,a.close(),o.path("/rooms")}))})};c(function(e){s("/user/login",!0,e.username)})},e.login={},e.authDisabled=function(){return void 0===e.login.username||void 0===e.login.password||""===e.login.username||""===e.login.password?!0:!1},e.closeModal=function(){a.close()}}]),angular.module("theeTable.controllers").controller("viewFavoriteRoomsController",["$scope","$modalInstance","$modal","theeTableAuth","$location","currentSocket",function(e,o,t,n,r,s){e.rooms=[],n.getUserInfo(function(o){e.rooms=o.rooms}),e.remove=function(o){$.snackbar({content:"<span class='glyphicon glyphicon-trash big-icon'></span> "+e.rooms[o]+" has been removed to your favorite rooms list"}),e.rooms.splice(o,1);for(var t=[],o=0;o<e.rooms.length;o++)t.push(e.rooms[o]);s.emit("newRooms",{rooms:t})},e.navigate=function(e){r.path("/rooms/"+e),o.close()},e.close=function(){o.close()}}]),angular.module("theeTable.controllers").controller("viewFavoritesController",["$scope","$modalInstance","$modal","theeTableAuth","currentSocket","theeTableTime",function(e,o,t,n,r,s){e.favorites=[],n.getUserInfo(function(o){e.favorites=o.favorites}),e.sortableOptions={stop:function(){for(var o=[],t=0;t<e.favorites.length;t++)o.push({source:e.favorites[t].source,title:e.favorites[t].title,artist:e.favorites[t].artist,length:e.favorites[t].length,soundcloudID:e.favorites[t].soundcloudID});r.emit("newFavorites",{favorites:o})}},e.remove=function(o){$.snackbar({content:"<span class='glyphicon glyphicon-trash big-icon'></span> "+e.favorites[o].title+" has been removed to your liked songs"}),e.favorites.splice(o,1);for(var t=[],o=0;o<e.favorites.length;o++)t.push({source:e.favorites[o].source,title:e.favorites[o].title,artist:e.favorites[o].artist,length:e.favorites[o].length,soundcloudID:e.favorites[o].soundcloudID});r.emit("newFavorites",{favorites:t})},e.addToPlaylist=function(e){e={source:e.source,title:e.title,artist:e.artist,length:e.length,soundcloudID:e.soundcloudID},r.emit("newPlaylistItem",{song:e})},e.convertTime=function(e){return s.convertTime(e)},e.close=function(){o.close()}}]),angular.module("theeTable.directives").directive("customInputBox",[function(){return{restrict:"E",templateUrl:"./../../templates/directives/inputDirective.html",scope:{socket:"=",input:"@"},controller:["$scope","theeTableRooms",function(e){e.newInput={},e.createDisabled=function(){return void 0===e.newInput.value||""===e.newInput.value?!0:!1},e.create=function(o){e.socket.emit("newChatMessage",{msg:o}),e.newInput.value=""}}],link:function(){$(document).ready(function(){setTimeout(function(){$.material.init()},0)})}}}]),angular.module("theeTable.directives").directive("soundCloudPlayer",[function(){return{restrict:"E",template:'<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe>',scope:{socket:"=",currentSong:"=",room:"=",username:"=",title:"="},controller:["$scope","$sce",function(e,o){var t,n,r=function(){n.unbind(SC.Widget.Events.READY),n.unbind(SC.Widget.Events.PLAY_PROGRESS),n.unbind(SC.Widget.Events.PLAY),n.unbind(SC.Widget.Events.FINISH)};e.thisSong="",e.sce=function(e){return o.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e)},e.updatePlayer=function(o){o&&n.load(o,{show_artwork:!0}),n.bind(SC.Widget.Events.READY,function(){n.bind(SC.Widget.Events.PLAY_PROGRESS,function(o){e.room.currentDJ===e.username&&e.socket.emit("currentTime",{time:o.currentPosition})}),n.bind(SC.Widget.Events.PLAY,function(){return null!==e.room.currentTime&&n.seekTo(e.room.currentTime),e.room.currentSong?void n.getCurrentSound(function(o){e.$apply(function(){e.title=o.title})}):(delete e.title,n.seekTo(e.oldValue.length),void r())}),n.setVolume(100),n.bind(SC.Widget.Events.FINISH,function(){r(),e.room.currentDJ===e.username&&e.socket.emit("updatePlaylist",{username:e.username})}),n.play()})},e.setUpPlayer=function(){setTimeout(function(){t=document.getElementById("sc-widget"),n=SC.Widget(t),e.updatePlayer()},500)}}],link:function(e){var o=!0;e.$watch("currentSong",function(t,n){o||null!==t||(e.oldValue=n,delete e.title,e.updatePlayer("")),void 0!==t&&null!==t&&(o?(e.thisSong=e.sce(t.source),e.setUpPlayer(),o=!1):(delete e.title,e.updatePlayer(t.source)))})}}}]),angular.module("theeTable.services").factory("theeTableAuth",["$http","localStorageService","$location","theeTableUrl",function(e,o,t,n){var r=function(o,t,n,r){e.post(o,{username:t,password:n}).success(function(e){r(e)}).error(function(e){console.log(e)})},s=function(t){var r=o.get("jwt");e.get(""+n.getUrl()+"/user?jwt_token="+r).success(function(e){t(e)}).error(function(e){console.log(e)})},a=function(e){var n=o.get("jwt");return n?!0:(e||(alert("you must be logged in to access Thee Table."),t.path("/main")),!1)};return{siteAccess:r,getUserInfo:s,verifyJwt:a}}]),angular.module("theeTable.services").factory("theeTableRooms",["$http","localStorageService","$location","theeTableUrl",function(e,o,t,n){var r=o.get("jwt"),s=function(o){e.get(""+n.getUrl()+"/rooms").success(function(e){o(e)}).error(function(e){console.log(e)})},a=function(o,s){e.post(""+n.getUrl()+"/rooms?jwt_token="+r,{name:o}).success(function(e){return e.message?void s(e):(s(e),void t.path("/rooms/"+e.name))}).error(function(e){console.log(e)})},i=function(o,r){return""===o?void t.path("/rooms"):void e.get(""+n.getUrl()+"/rooms/"+o).success(function(e){return e.message?(alert(e.message),void t.path("/rooms")):void r(e)}).error(function(e){console.log(e)})};return{getAllRooms:s,createRoom:a,getRoomInfo:i}}]),angular.module("theeTable.services").factory("theeTableSocket",["$rootScope",function(e){var o=io.connect(),t=!1,n=function(t,n){o.on(t,function(){var t=arguments;e.$apply(function(){n.apply(o,t)})})},r=function(t,n,r){o.emit(t,n,function(){var t=arguments;e.$apply(function(){r&&r.apply(o,t)})})},s=function(){t&&(o.connect(),t=!1)},a=function(){o.disconnect(),t=!0};return{on:n,emit:r,connect:s,disconnect:a}}]),angular.module("theeTable.services").factory("theeTableSoundcloud",[function(){var e,o={},t=function(){return o},n=function(o){return e=o},r=function(){return e},s=function(t){e.connect(function(){e.get("/me",function(e){o.id=e.id,o.username=e.permalink,t&&t()})})},a=function(o){e.put("/me/favorites/"+o)},i=function(o,t){e.get("/tracks",{q:o},function(e){t(e)})},l=function(t){var n="/users/"+o.id+"/playlists";e.get(n,function(n){e.get("/users/"+o.id+"/favorites",function(e){t(e,n)})})};return{getSoundcloudID:t,setSCinstance:n,getSCinstance:r,like:a,searchTracks:i,getPlaylists:l,loginSC:s}}]),angular.module("theeTable.services").factory("theeTableTime",[function(){var e=function(e){var o=Math.floor(e/36e5),t=Math.floor(e%36e5/6e4),n=Math.floor(e%36e4%6e4/1e3);return 10>n&&(n="0"+n),10>t&&(t="0"+t),o>0?o+":"+t+":"+n:t+":"+n};return{convertTime:e}}]),angular.module("theeTable.services").factory("theeTableUrl",[function(){var e=function(){return ttURL},o=function(){return scID};return{getUrl:e,getID:o}}]),!function(e){function o(e){return"undefined"!=typeof e&&null!==e?!0:!1}e(document).ready(function(){e("body").append("<div id=snackbar-container/>")}),e(document).on("click","[data-toggle=snackbar]",function(){e(this).snackbar("toggle")}).on("click","#snackbar-container .snackbar",function(){e(this).snackbar("hide")}),e.snackbar=function(t){if(o(t)&&t===Object(t)){var n;n=o(t.id)?e("#"+t.id):e("<div/>").attr("id","snackbar"+Date.now()).attr("class","snackbar");var r=n.hasClass("snackbar-opened");o(t.style)?n.attr("class","snackbar "+t.style):n.attr("class","snackbar"),t.timeout=o(t.timeout)?t.timeout:3e3,o(t.content)&&(n.find(".snackbar-content").length?n.find(".snackbar-content").text(t.content):n.prepend("<span class=snackbar-content>"+t.content+"</span>")),o(t.id)?n.insertAfter("#snackbar-container .snackbar:last-child"):n.appendTo("#snackbar-container"),o(t.action)&&"toggle"==t.action&&(t.action=r?"hide":"show");var s=Date.now();n.data("animationId1",s),setTimeout(function(){n.data("animationId1")===s&&(o(t.action)&&"show"!=t.action?o(t.action)&&"hide"==t.action&&n.removeClass("snackbar-opened"):n.addClass("snackbar-opened"))},50);var a=Date.now();return n.data("animationId2",a),0!==t.timeout&&setTimeout(function(){n.data("animationId2")===a&&n.removeClass("snackbar-opened")},t.timeout),n}return!1},e.fn.snackbar=function(t){var n={};if(this.hasClass("snackbar"))return n.id=this.attr("id"),("show"===t||"hide"===t||"toggle"==t)&&(n.action=t),e.snackbar(n);o(t)&&"show"!==t&&"hide"!==t&&"toggle"!=t||(n={content:e(this).attr("data-content"),style:e(this).attr("data-style"),timeout:e(this).attr("data-timeout")}),o(t)&&(n.id=this.attr("data-snackbar-id"),("show"===t||"hide"===t||"toggle"==t)&&(n.action=t));var r=e.snackbar(n);return this.attr("data-snackbar-id",r.attr("id")),r}}(jQuery);