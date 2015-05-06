angular.module("theeTable",["ui.router","theeTable.controllers","LocalStorageModule","theeTable.services","theeTable.directives","ui.bootstrap","ui.sortable"]).config(["$stateProvider","$urlRouterProvider","localStorageServiceProvider",function(e,t,o){o.setPrefix("theeTable"),e.state("home",{url:"/home",controller:["$scope",function(e){e.$parent.showApp=!1}],templateUrl:"templates/app.html"}).state("rooms",{url:"/rooms",controller:"roomsController",templateUrl:"templates/controllers/rooms.html"}).state("room",{url:"/rooms/:roomName",controller:"roomController",templateUrl:"templates/controllers/room.html",onEnter:["theeTableSocket",function(e){e.connect()}],onExit:["theeTableSocket",function(e){e.disconnect()}]}).state("logout",{url:"/logout",controller:["localStorageService","$location","$scope",function(e,t,o){e.remove("jwt"),o.$parent.showApp=!1,o.$parent.currentUser=void 0,o.$parent.soundcloudID=void 0,o.$parent.loggedout?($.snackbar({content:"<i class='mdi-alert-error big-icon'></i> You have logged into Thee Table from another source. Good-bye!",timeout:1e4}),delete o.$parent.loggedout):$.snackbar({content:"<i class='mdi-file-file-upload big-icon'></i> You have successfully logged out of Thee Table. Good-bye!",timeout:1e4}),t.path("/")}]}),t.otherwise("/home")}]),angular.module("theeTable.controllers",[]),angular.module("theeTable.services",[]),angular.module("theeTable.directives",[]),angular.module("theeTable.controllers").controller("createRoomController",["$scope","$modalInstance","currentSocket","theeTableRooms",function(e,t,o,n){e.closeModal=function(){t.close()},e.room={},e.create=function(r){return r=r||$("#room-name").val(),""===r||void 0===r?void(e.message="Your new room cannot have a blank name."):(n.createRoom(r,function(n){return n.message?void(e.message=n.message):(o.emit("addRoom",{room:n.name}),void t.close())}),e.room.value="",void $("#room-name").val(""))}}]),angular.module("theeTable.controllers").controller("mainController",["$scope","localStorageService","theeTableAuth","$modal","theeTableSocket","theeTableSoundcloud","theeTableUrl","$location","theeTableAuth",function(e,t,o,n,r,a,s,l,o){e.socket=r,e.socket.on("signOn",function(t){e.currentUser&&t.username===e.currentUser.username&&t.loginTime!==e.currentUser.loginTime&&(e.loggedout=!0,l.path("/logout"))}),e.showApp;e.inRoom=function(){return e.userInRoom?!0:!1},e.getUserInfo=function(t){o.getUserInfo(function(o){return o.message?void 0:(e.currentUser=o,void(t&&t(o)))})},e.credits=function(){n.open({templateUrl:"./../templates/modals/credits.html",controller:["$scope","$modalInstance",function(e,t){e.closeModal=function(){t.close()}}],size:"sm"})},e.auth=function(n){if(null===t.get("jwt")){var r=SC.initialize({client_id:s.getID(),redirect_uri:""+s.getUrl()+"/success"});e.sc=a.setSCinstance(r),a.loginSC(function(){e.getUserInfo(function(t){e.socket.emit("userName",{username:t.username}),l.path("/rooms")})})}else o.getUserInfo(function(t){var o=SC.initialize({client_id:s.getID(),access_token:t.accessToken,redirect_uri:""+s.getUrl()+"/success"});return e.sc=a.setSCinstance(o,t.username,t.scID),e.sc.isConnected()?(a.setSoundcloudID(t.scID,t.username),void(n||l.path("/rooms"))):void a.loginSC(function(){e.getUserInfo(function(t){e.socket.emit("userName",{username:t.username}),n||l.path("/rooms")})})})},e.getSoundcloudID=function(){return a.getSoundcloudID()},e.getSCinstance=function(){return a.getSCinstance()},e.loginSC=function(t){a.loginSC(function(){e.$apply(function(){e.soundcloudID=a.getSoundcloudID()}),t&&t(e.soundcloudID)})},e.likeSongOnSC=function(e){a.like(e)}}]),angular.module("theeTable.controllers").controller("managePlaylistController",["$scope","$modalInstance","$modal","theeTableAuth","loginSC","getSoundcloudID","getSCinstance","theeTableTime","theeTableSoundcloud","currentDJ","username","$sce","lower",function(e,t,o,n,r,a,s,l,i,c,u,d,m){e.playlist=[],n.getUserInfo(function(t){e.playlist=t.playlist});var p=function(e){for(var t=[],o=0;o<e.length;o++)t.push({source:e[o].source||e[o].permalink_url,title:e[o].title,artist:e[o].artist||e[o].user.username,length:e[o].length||e[o].duration,soundcloudID:e[o].soundcloudID||e[o].id});return t};e.searchSC=function(){var t=o.open({templateUrl:"./../templates/modals/search.html",controller:"searchController",size:"lg",resolve:{playlist:function(){return e.playlist},getSCinstance:function(){return s},lower:function(){return m}}});t.result.then(function(){},function(){m(!0)})},e.sortableOptions={stop:function(){if($.snackbar({content:"<i class='mdi-editor-format-list-numbered big-icon'></i> Your playlist order has beeen updated."}),c===u&&e.oldPlaylist[0].title!==e.playlist[0].title){for(var t,o=0;o<e.playlist.length;o++)e.playlist[o].title===e.oldPlaylist[0].title&&(t=o);var n=e.playlist.splice(t,1)[0];e.playlist.unshift(n)}e.$parent.newPlaylist=p(e.playlist)},activate:function(){e.oldPlaylist=angular.copy(e.playlist)}},e.bump=function(t){var o=e.playlist.splice(t,1)[0];if(c===u){var n=e.playlist.shift();e.playlist.unshift(o),e.playlist.unshift(n)}else e.playlist.unshift(o);e.$parent.newPlaylist=p(e.playlist),$.snackbar({content:"<span class='mdi-editor-publish big-icon'></span>"+o.title+" has been moved to the top of your playlist."})},e.remove=function(t){$.snackbar({content:"<span class='glyphicon glyphicon-trash big-icon'></span> "+e.playlist[t].title+" has been removed from your playlist."}),e.playlist.splice(t,1),e.$parent.newPlaylist=p(e.playlist)},e.convertTime=function(e){return l.convertTime(e)},e.connectSC=function(){var t=function(){e.possiblePlaylists="start",i.getPlaylists(function(t,o){e.$apply(function(){e.likes=t,e.possiblePlaylists=o})})};void 0===a().id?r(function(){e.$apply(function(){t()})}):t()},e.importPlaylist=function(t,o){var n=[];if("likes"===o){for(var r=0;r<e.likes.length;r++){for(var a=!1,s=0;s<e.playlist.length;s++)e.likes[r].id===e.playlist[s].soundcloudID&&(a=!0);a||n.push(e.likes[r])}e.$parent.newPlaylist=p(e.playlist.concat(n)),$.snackbar({content:"<i class='mdi-av-playlist-add big-icon'></i> You have added "+n.length+" songs to your playlist."})}else e.$parent.newPlaylist=p(t.tracks);e.playlist=e.$parent.newPlaylist,delete e.possiblePlaylists},e.showPreview=!1,e.previewSource="";var f,g=function(e){return d.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e+"&auto_play=true")};e.preview=function(t){m(),e.showPreview=!0,e.previewSource=g(e.playlist[t].source),e.previewIndex=t,setTimeout(function(){var e="sc-widget"+t,o=document.getElementById(e);void 0!==f&&f.unbind(SC.Widget.Events.READY),f=SC.Widget(o),f.bind(SC.Widget.Events.READY,function(){f.play()})},500)},e.close=function(){t.close()}}]),angular.module("theeTable.controllers").controller("roomController",["$scope","$state","$stateParams","$location","$sce","localStorageService","theeTableAuth","theeTableRooms","theeTableTime","$modal",function(e,t,o,n,r,a,s,l,i,c){var u=new Audio("assets/enter.mp3"),d=new Audio("assets/exit.mp3");e.$parent.socket.on("usersInRoom",function(t){e.room.users=t.users}),e.$parent.socket.on("updatedChat",function(t){if(e.room.chat=t.chat,$(".chats").animate({scrollTop:$(document).height()+1e3},"slow"),""===e.room.chat[e.room.chat.length-1].user){var o=e.room.chat[e.room.chat.length-1].msg.split(" ");if(o=o[o.length-3],"entered"===o)return void u.play();d.play()}}),e.$parent.socket.on("updatedRooms",function(t){e.$parent.currentUser.rooms=t.rooms}),e.$parent.socket.on("rotatedPlaylist",function(t){e.$parent.currentUser&&(e.$parent.currentUser.playlist=t.playlist,e.$parent.socket.emit("newQueue",{queue:e.room.queue}))}),e.$parent.socket.on("updatedPlaylist",function(t){return t.error?void $.snackbar({content:"<i class='mdi-alert-error big-icon'></i> "+t.error}):(e.$parent.currentUser.playlist=t.playlist,void(t.title&&$.snackbar({content:"<i class='mdi-av-playlist-add big-icon'></i> "+t.title+" has been added to your playlist."})))}),e.$parent.socket.on("updatedQueue",function(t){e.room.queue=t.queue,t.currentDJ&&(e.room.currentDJ=t.currentDJ,e.room.currentSong=t.currentSong,e.currentSong=r.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+t.currentSong.source).toString())}),e.$parent.socket.on("updatedCurrentTime",function(t){e.room.currentTime=t.time}),e.$parent.socket.on("rotatedQueue",function(t){e.room.queue=t.queue,e.room.currentDJ=t.currentDJ,e.room.currentSong=t.currentSong,e.room.currentTime=t.currentTime,e.liked=!1,t.currentDJ===e.$parent.currentUser.username&&(e.socket=e.$parent.socket)}),e.$parent.socket.on("roomUpdate",function(t){e.room=t.room,null===t.room.currentDJ&&(e.currentSong=null)}),e.$parent.socket.on("updatedRooms",function(t){e.$parent.currentUser.rooms=t.rooms}),e.room={},e.socket=e.$parent.socket,e.newURL,e.newPlaylist,e.$parent.userInRoom=!0,e.sound=!0,e.lower=!1,e.setLower=function(t){return t?void(e.lower=!1):void(e.lower=!0)},e.managePlaylist=function(){var t=c.open({templateUrl:"./../templates/modals/managePlaylist.html",controller:"managePlaylistController",size:"lg",resolve:{loginSC:function(){return e.$parent.loginSC},getSoundcloudID:function(){return e.getSoundcloudID},getSCinstance:function(){return e.getSCinstance},currentDJ:function(){return e.room.currentDJ},username:function(){return e.$parent.currentUser.username},lower:function(){return e.setLower}}});t.result.then(function(){e.lower=!1},function(){e.lower=!1})},l.getRoomInfo(o.roomName,function(t){e.room=t,s.verifyJwt(!0)?($.snackbar({content:"<i class='mdi-file-file-download big-icon'></i> Welcome to "+t.name}),e.$parent.auth(!0),e.$parent.getUserInfo(function(t){e.$parent.socket.emit("roomEntered",{roomName:o.roomName,user:t.username})})):($.snackbar({content:"You must be logged in to access Thee Table."}),n.path("/home")),null!==t.currentDJ&&(e.currentSong=r.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+t.currentSong.source).toString())}),e.$parent.showApp=!0,e.$watch("newSong",function(t){void 0!==t&&e.$parent.socket.emit("newPlaylistItem",{song:{source:t.source,title:t.title,artist:t.artist,length:t.length,soundcloudID:t.soundcloudID}})}),e.$watch("newPlaylist",function(t){void 0!==t&&e.$parent.socket.emit("newPlaylist",{playlist:t})}),e.liked=!1,e.like=function(t){e.liked=!0,e.$parent.likeSongOnSC(t.soundcloudID),$.snackbar({content:"<i class='mdi-file-cloud-queue big-icon'></i> "+t.title+" has been added to your soundcloud likes"})},e.addToQueue=function(){return e.$parent.currentUser.playlist.length>0?void e.$parent.socket.emit("addToQueue",{user:e.$parent.currentUser.username}):void $.snackbar({content:"<i class='mdi-notification-sms-failed big-icon'></i> Sorry, you must have a song on your playlist to enter the queue"})},e.skip=function(){e.$parent.socket.emit("updatePlaylist",{username:e.$parent.currentUser.username})},e.removeFromQueue=function(){e.$parent.socket.emit("removeFromQueue",{user:e.$parent.currentUser.username})},e.storedInUser=function(){return e.room&&e.$parent.currentUser&&-1!==e.$parent.currentUser.rooms.indexOf(e.room.name)?!0:!1},e.convertTime=function(e){return i.convertTime(e)},e.mute=function(){e.sound=!e.sound}}]),angular.module("theeTable.controllers").controller("roomsController",["$scope","$location","localStorageService","theeTableAuth","theeTableRooms","$modal",function(e,t,o,n,r,a){e.rooms=[],e.roomSearch={},e.$parent.userInRoom=!1,e.$parent.showApp=!0,r.getAllRooms(function(o){e.rooms=o.rooms,n.verifyJwt(!0)?(e.$parent.getUserInfo(),e.$parent.showApp=!0,e.favoriteRooms=[],n.getUserInfo(function(t){e.favoriteRooms=t.rooms})):($.snackbar({content:"You must be logged in to access Thee Table."}),t.path("/home"))}),e.navigate=function(e){t.path("/rooms/"+e)},e.createRoom=function(){a.open({templateUrl:"./../templates/modals/createRoom.html",controller:"createRoomController",size:"lg",resolve:{currentSocket:function(){return e.$parent.socket}}})}}]),angular.module("theeTable.controllers").controller("searchController",["$scope","$modalInstance","$modal","playlist","getSCinstance","theeTableSoundcloud","theeTableTime","lower","$sce",function(e,t,o,n,r,a,s,l,i){e.soundcloud={},e.search=function(t){e.soundcloud.results=[],e.searching=!0,t=$("#soundcloudSearch").val(),a.searchTracks(t,function(t){e.searching=!1,e.$apply(function(){e.soundcloud.results=t})}),e.soundcloud.query="",$("#soundcloudSearch").val("")},e.convertTime=function(e){return s.convertTime(e)},e.addSongToPlaylist=function(t,o,r,a,s,l){e.soundcloud.results.splice(l,1),e.$parent.newSong={source:t,title:o,artist:r,length:a,soundcloudID:s},n.push({source:t,title:o,artist:r,length:a,soundcloudID:s})},e.showPreview=!1,e.previewSource="";var c,u=function(e){return i.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e+"&auto_play=true")};e.preview=function(t){l(),e.showPreview=!0,console.log(t),console.log(e.soundcloud),e.previewSource=u(e.soundcloud.results[t].permalink_url),console.log(e.previewSource.toString()),e.previewIndex=t,setTimeout(function(){var e="sc-widget"+t,o=document.getElementById(e);void 0!==c&&c.unbind(SC.Widget.Events.READY),c=SC.Widget(o),c.bind(SC.Widget.Events.READY,function(){c.play()})},500)},e.close=function(){t.close()}}]),angular.module("theeTable.directives").directive("customInputBox",[function(){return{restrict:"E",templateUrl:"./../../templates/directives/inputDirective.html",scope:{socket:"=",input:"@"},controller:["$scope","theeTableRooms",function(e){e.newInput={},e.createDisabled=function(){return void 0===e.newInput.value||""===e.newInput.value?!0:!1},e.create=function(t){e.socket.emit("newChatMessage",{msg:t}),e.newInput.value=""}}],link:function(){$(document).ready(function(){setTimeout(function(){$.material.init()},0)})}}}]),angular.module("theeTable.directives").directive("soundCloudPlayer",[function(){return{restrict:"E",template:'<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe>',scope:{socket:"=",currentSong:"=",room:"=",username:"=",title:"=",sound:"=",lower:"="},controller:["$scope","$sce",function(e,t){var o,n,r=function(){n.unbind(SC.Widget.Events.READY),n.unbind(SC.Widget.Events.PLAY_PROGRESS),n.unbind(SC.Widget.Events.PLAY),n.unbind(SC.Widget.Events.FINISH)};e.thisSong="",e.sce=function(e){return t.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e)},e.updatePlayer=function(t){t&&n.load(t+"?single_active=false",{show_artwork:!0}),n.bind(SC.Widget.Events.READY,function(){n.bind(SC.Widget.Events.PLAY_PROGRESS,function(t){e.room.currentDJ===e.username&&e.socket.emit("currentTime",{time:t.currentPosition})}),n.bind(SC.Widget.Events.PLAY,function(){return e.room.currentDJ!==e.username&&n.seekTo(e.room.currentTime),e.room.currentSong?void n.getCurrentSound(function(t){e.$apply(function(){e.title=t.title})}):(delete e.title,e.oldValue&&n.seekTo(e.oldValue.length),delete e.oldValue,void r())}),n.setVolume(e.sound?100:0),n.bind(SC.Widget.Events.FINISH,function(){r(),e.room.currentDJ===e.username&&e.socket.emit("updatePlaylist",{username:e.username})}),n.play()})},e.setUpPlayer=function(){setTimeout(function(){o=document.getElementById("sc-widget"),n=SC.Widget(o),e.updatePlayer()},500)},e.setVolume=function(){if(n){if(e.sound)return void n.setVolume(100);n.setVolume(0)}},e.full=function(){n&&n.setVolume(100)},e.empty=function(){n&&n.setVolume(0)}}],link:function(e){var t=!0;e.$watch("currentSong",function(o,n){t||null!==o||(e.oldValue=n,delete e.title,e.updatePlayer("")),void 0!==o&&null!==o&&(t?(e.thisSong=e.sce(o.source+"?single_active=false"),e.setUpPlayer(),t=!1):(delete e.title,e.updatePlayer(o.source+"?single_active=false")))}),e.$watch("sound",function(t){void 0!==t&&e.setVolume()}),e.$watch("lower",function(t){return t?void e.empty():void e.full()})}}}]),angular.module("theeTable.services").factory("theeTableAuth",["$http","localStorageService","$location","theeTableUrl",function(e,t,o,n){var r=function(t,o,n,r,a,s){e.post(t,{username:o,password:n,accessToken:r,scID:a}).success(function(e){s(e)}).error(function(e){console.log(e)})},a=function(o){var r=t.get("jwt");e.get(""+n.getUrl()+"/user?jwt_token="+r).success(function(e){o(e)}).error(function(e){console.log(e)})},s=function(e){var n=t.get("jwt");return n?!0:(e||(alert("you must be logged in to access Thee Table."),o.path("/main")),!1)};return{siteAccess:r,getUserInfo:a,verifyJwt:s}}]),angular.module("theeTable.services").factory("theeTableRooms",["$http","localStorageService","$location","theeTableUrl",function(e,t,o,n){var r=t.get("jwt"),a=function(t){e.get(""+n.getUrl()+"/rooms").success(function(e){t(e)}).error(function(e){console.log(e)})},s=function(t,a){e.post(""+n.getUrl()+"/rooms?jwt_token="+r,{name:t}).success(function(e){return e.message?void a(e):(a(e),void o.path("/rooms/"+e.name))}).error(function(e){console.log(e)})},l=function(t,r){return""===t?void o.path("/rooms"):void e.get(""+n.getUrl()+"/rooms/"+t).success(function(e){return e.message?(alert(e.message),void o.path("/rooms")):void r(e)}).error(function(e){console.log(e)})};return{getAllRooms:a,createRoom:s,getRoomInfo:l}}]),angular.module("theeTable.services").factory("theeTableSocket",["$rootScope",function(e){var t=io.connect(),o=!1,n=function(o,n){t.on(o,function(){var o=arguments;e.$apply(function(){n.apply(t,o)})})},r=function(o,n,r){t.emit(o,n,function(){var o=arguments;e.$apply(function(){r&&r.apply(t,o)})})},a=function(){o&&(t.connect(),o=!1)},s=function(){t.disconnect(),o=!0};return{on:n,emit:r,connect:a,disconnect:s}}]),angular.module("theeTable.services").factory("theeTableSoundcloud",["theeTableAuth","theeTableUrl","localStorageService",function(e,t,o){var n,r={},a=function(){return r},s=function(e){return n=e},l=function(e,t){r.id=e,r.username=t},i=function(){return n},c=function(n,r,a,s,l,i){e.siteAccess(""+t.getUrl()+n,a,"abc",s,l,function(e){return e.message?r?void c("/user/new",!1,a,s,l,i):void($scope.message=e.message):(o.set("jwt",e.jwt),void i())})},u=function(e){n.connect(function(){n.get("/me",function(t){r.id=t.id,r.username=t.username,c("/user/login",!0,t.username,n.accessToken(),t.id,e)})})},d=function(e){n.put("/me/favorites/"+e)},m=function(e,t){n.get("/tracks",{q:e},function(e){t(e)})},p=function(e){var t="/users/"+r.id+"/playlists";n.get(t,function(t){n.get("/users/"+r.id+"/favorites",function(o){e(o,t)})})};return{getSoundcloudID:a,setSoundcloudID:l,setSCinstance:s,getSCinstance:i,like:d,searchTracks:m,getPlaylists:p,loginSC:u}}]),angular.module("theeTable.services").factory("theeTableTime",[function(){var e=function(e){var t=Math.floor(e/36e5),o=Math.floor(e%36e5/6e4),n=Math.floor(e%36e4%6e4/1e3);return 10>n&&(n="0"+n),10>o&&(o="0"+o),t>0?t+":"+o+":"+n:o+":"+n};return{convertTime:e}}]),angular.module("theeTable.services").factory("theeTableUrl",[function(){var e=function(){return ttURL},t=function(){return scID};return{getUrl:e,getID:t}}]),!function(e){function t(e){return"undefined"!=typeof e&&null!==e?!0:!1}e(document).ready(function(){e("body").append("<div id=snackbar-container/>")}),e(document).on("click","[data-toggle=snackbar]",function(){e(this).snackbar("toggle")}).on("click","#snackbar-container .snackbar",function(){e(this).snackbar("hide")}),e.snackbar=function(o){if(t(o)&&o===Object(o)){var n;n=t(o.id)?e("#"+o.id):e("<div/>").attr("id","snackbar"+Date.now()).attr("class","snackbar");var r=n.hasClass("snackbar-opened");t(o.style)?n.attr("class","snackbar "+o.style):n.attr("class","snackbar"),o.timeout=t(o.timeout)?o.timeout:3e3,t(o.content)&&(n.find(".snackbar-content").length?n.find(".snackbar-content").text(o.content):n.prepend("<span class=snackbar-content>"+o.content+"</span>")),t(o.id)?n.insertAfter("#snackbar-container .snackbar:last-child"):n.appendTo("#snackbar-container"),t(o.action)&&"toggle"==o.action&&(o.action=r?"hide":"show");var a=Date.now();n.data("animationId1",a),setTimeout(function(){n.data("animationId1")===a&&(t(o.action)&&"show"!=o.action?t(o.action)&&"hide"==o.action&&n.removeClass("snackbar-opened"):n.addClass("snackbar-opened"))},50);var s=Date.now();return n.data("animationId2",s),0!==o.timeout&&setTimeout(function(){n.data("animationId2")===s&&n.removeClass("snackbar-opened")},o.timeout),n}return!1},e.fn.snackbar=function(o){var n={};if(this.hasClass("snackbar"))return n.id=this.attr("id"),("show"===o||"hide"===o||"toggle"==o)&&(n.action=o),e.snackbar(n);t(o)&&"show"!==o&&"hide"!==o&&"toggle"!=o||(n={content:e(this).attr("data-content"),style:e(this).attr("data-style"),timeout:e(this).attr("data-timeout")}),t(o)&&(n.id=this.attr("data-snackbar-id"),("show"===o||"hide"===o||"toggle"==o)&&(n.action=o));var r=e.snackbar(n);return this.attr("data-snackbar-id",r.attr("id")),r}}(jQuery);