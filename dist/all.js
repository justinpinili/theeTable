angular.module("theeTable",["ui.router","theeTable.controllers","LocalStorageModule","theeTable.services","theeTable.directives","ui.bootstrap","ui.sortable","dbaq.emoji","ngSanitize","rzModule"]).config(["$stateProvider","$urlRouterProvider","localStorageServiceProvider",function(e,t,n){n.setPrefix("theeTable"),e.state("home",{url:"/home",controller:["$scope",function(e){e.$parent.showApp=!1}],templateUrl:"templates/app.html"}).state("rooms",{url:"/rooms",controller:"roomsController",templateUrl:"templates/controllers/rooms.html"}).state("room",{url:"/rooms/:roomName",controller:"roomController",templateUrl:"templates/controllers/room.html",onEnter:["theeTableSocket",function(e){e.connect()}],onExit:["theeTableSocket",function(e){e.disconnect()}]}).state("logout",{url:"/logout",controller:["localStorageService","$location","$scope",function(e,t,n){e.remove("jwt"),n.$parent.showApp=!1,n.$parent.currentUser=void 0,n.$parent.soundcloudID=void 0,n.$parent.loggedout?($.snackbar({content:"<i class='mdi-alert-error big-icon'></i> You have logged into Thee Table from another source. Good-bye!",timeout:1e4}),delete n.$parent.loggedout):$.snackbar({content:"<i class='mdi-file-file-upload big-icon'></i> You have successfully logged out of Thee Table. Good-bye!",timeout:1e4}),t.path("/")}]}),t.otherwise("/home")}]),angular.module("theeTable.controllers",[]),angular.module("theeTable.services",[]),angular.module("theeTable.directives",[]),angular.module("theeTable.controllers").controller("createRoomController",["$scope","$modalInstance","currentSocket","theeTableRooms",function(e,t,n,i){e.closeModal=function(){t.close()},e.room={},e.create=function(s){return s=s||$("#room-name").val(),""===s||void 0===s?void(e.message="Your new room cannot have a blank name."):(i.createRoom(s,function(i){return i.message?void(e.message=i.message):(n.emit("addRoom",{room:i.name}),void t.close())}),e.room.value="",void $("#room-name").val(""))}}]),angular.module("theeTable.controllers").controller("mainController",["$scope","localStorageService","theeTableAuth","$modal","theeTableSocket","theeTableSoundcloud","theeTableUrl","$location","theeTableAuth",function(e,t,n,i,s,o,r,a,n){e.socket=s,e.socket.on("signOn",function(t){e.currentUser&&t.username===e.currentUser.username&&t.loginTime!==e.currentUser.loginTime&&(e.loggedout=!0,a.path("/logout"))}),e.showApp;e.inRoom=function(){return e.userInRoom?!0:!1},e.getUserInfo=function(t){n.getUserInfo(function(n){return n.message?void 0:(e.currentUser=n,void(t&&t(n)))})},e.credits=function(){i.open({templateUrl:"./../templates/modals/credits.html",controller:["$scope","$modalInstance",function(e,t){e.closeModal=function(){t.close()}}],size:"sm"})},e.auth=function(i){if(null===t.get("jwt")){var s=SC.initialize({client_id:r.getID(),redirect_uri:""+r.getUrl()+"/success"});e.sc=o.setSCinstance(s),o.loginSC(function(){e.getUserInfo(function(t){e.socket.emit("userName",{username:t.username}),a.path("/rooms")})})}else n.getUserInfo(function(t){var n=SC.initialize({client_id:r.getID(),access_token:t.accessToken,redirect_uri:""+r.getUrl()+"/success"});return e.sc=o.setSCinstance(n,t.username,t.scID),e.sc.isConnected()?(o.setSoundcloudID(t.scID,t.username),void(i||a.path("/rooms"))):void o.loginSC(function(){e.getUserInfo(function(t){e.socket.emit("userName",{username:t.username}),i||a.path("/rooms")})})})},e.getSoundcloudID=function(){return o.getSoundcloudID()},e.getSCinstance=function(){return o.getSCinstance()},e.loginSC=function(t){o.loginSC(function(){e.$apply(function(){e.soundcloudID=o.getSoundcloudID()}),t&&t(e.soundcloudID)})},e.likeSongOnSC=function(e){o.like(e)}}]),angular.module("theeTable.controllers").controller("managePlaylistController",["$scope","$modalInstance","$modal","theeTableAuth","loginSC","getSoundcloudID","getSCinstance","theeTableTime","theeTableSoundcloud","currentDJ","username","$sce","lower",function(e,t,n,i,s,o,r,a,l,c,u,h,d){e.playlist=[],i.getUserInfo(function(t){e.playlist=t.playlist});var m=function(e){for(var t=[],n=0;n<e.length;n++)t.push({source:e[n].source||e[n].permalink_url,title:e[n].title,artist:e[n].artist||e[n].user.username,length:e[n].length||e[n].duration,soundcloudID:e[n].soundcloudID||e[n].id});return t};e.searchSC=function(){var t=n.open({templateUrl:"./../templates/modals/search.html",controller:"searchController",size:"lg",resolve:{playlist:function(){return e.playlist},getSCinstance:function(){return r},lower:function(){return d}}});t.result.then(function(){},function(){d(!0)})},e.sortableOptions={stop:function(){if($.snackbar({content:"<i class='mdi-editor-format-list-numbered big-icon'></i> Your playlist order has beeen updated."}),c===u&&e.oldPlaylist[0].title!==e.playlist[0].title){for(var t,n=0;n<e.playlist.length;n++)e.playlist[n].title===e.oldPlaylist[0].title&&(t=n);var i=e.playlist.splice(t,1)[0];e.playlist.unshift(i)}e.$parent.newPlaylist=m(e.playlist)},activate:function(){e.oldPlaylist=angular.copy(e.playlist)}},e.bump=function(t){var n=e.playlist.splice(t,1)[0];if(c===u){var i=e.playlist.shift();e.playlist.unshift(n),e.playlist.unshift(i)}else e.playlist.unshift(n);e.$parent.newPlaylist=m(e.playlist),$.snackbar({content:"<span class='mdi-editor-publish big-icon'></span>"+n.title+" has been moved to the top of your playlist."})},e.remove=function(t){$.snackbar({content:"<span class='glyphicon glyphicon-trash big-icon'></span> "+e.playlist[t].title+" has been removed from your playlist."}),e.playlist.splice(t,1),e.$parent.newPlaylist=m(e.playlist)},e.convertTime=function(e){return a.convertTime(e)},e.connectSC=function(){var t=function(){e.possiblePlaylists="start",l.getPlaylists(function(t,n){e.$apply(function(){e.likes=t,e.possiblePlaylists=n})})};void 0===o().id?s(function(){e.$apply(function(){t()})}):t()},e.importPlaylist=function(t,n){var i=[];if("likes"===n){for(var s=0;s<e.likes.length;s++){for(var o=!1,r=0;r<e.playlist.length;r++)e.likes[s].id===e.playlist[r].soundcloudID&&(o=!0);o||i.push(e.likes[s])}e.$parent.newPlaylist=m(e.playlist.concat(i)),$.snackbar({content:"<i class='mdi-av-playlist-add big-icon'></i> You have added "+i.length+" songs to your playlist."})}else e.$parent.newPlaylist=m(t.tracks);e.playlist=e.$parent.newPlaylist,delete e.possiblePlaylists},e.showPreview=!1,e.previewSource="";var p,f=function(e){return h.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e+"&auto_play=true")};e.preview=function(t){d(),e.showPreview=!0,e.previewSource=f(e.playlist[t].source),e.previewIndex=t,setTimeout(function(){var e="sc-widget"+t,n=document.getElementById(e);void 0!==p&&p.unbind(SC.Widget.Events.READY),p=SC.Widget(n),p.bind(SC.Widget.Events.READY,function(){p.play()})},500)},e.close=function(){t.close()}}]),angular.module("theeTable.controllers").controller("roomController",["$scope","$state","$stateParams","$location","$sce","localStorageService","theeTableAuth","theeTableRooms","theeTableTime","$modal",function(e,t,n,i,s,o,r,a,l,c){var u=new Audio("assets/enter.mp3"),h=new Audio("assets/exit.mp3");e.$parent.socket.on("usersInRoom",function(t){e.room.users=t.users}),e.$parent.socket.on("updatedChat",function(t){if(e.room.chat=t.chat,$(".chats").animate({scrollTop:$(document).height()+1e3},"slow"),""===e.room.chat[e.room.chat.length-1].user){var n=e.room.chat[e.room.chat.length-1].msg.split(" ");if(n=n[n.length-3],"entered"===n)return void u.play();h.play()}}),e.$parent.socket.on("updatedRooms",function(t){e.$parent.currentUser.rooms=t.rooms}),e.$parent.socket.on("rotatedPlaylist",function(t){e.$parent.currentUser&&(e.$parent.currentUser.playlist=t.playlist,e.$parent.socket.emit("newQueue",{queue:e.room.queue}))}),e.$parent.socket.on("updatedPlaylist",function(t){return t.error?void $.snackbar({content:"<i class='mdi-alert-error big-icon'></i> "+t.error}):(e.$parent.currentUser.playlist=t.playlist,void(t.title&&$.snackbar({content:"<i class='mdi-av-playlist-add big-icon'></i> "+t.title+" has been added to your playlist."})))}),e.$parent.socket.on("updatedQueue",function(t){e.room.queue=t.queue,t.currentDJ&&(e.room.currentDJ=t.currentDJ,e.room.currentSong=t.currentSong,e.currentSong=s.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+t.currentSong.source).toString())}),e.$parent.socket.on("updatedCurrentTime",function(t){e.room.currentTime=t.time}),e.$parent.socket.on("rotatedQueue",function(t){e.room.queue=t.queue,e.room.currentDJ=t.currentDJ,e.room.currentSong=t.currentSong,e.room.currentTime=t.currentTime,e.liked=!1,t.currentDJ===e.$parent.currentUser.username&&(e.socket=e.$parent.socket)}),e.$parent.socket.on("roomUpdate",function(t){e.room=t.room,null===t.room.currentDJ&&(e.currentSong=null)}),e.$parent.socket.on("updatedRooms",function(t){e.$parent.currentUser.rooms=t.rooms}),e.room={},e.socket=e.$parent.socket,e.newURL,e.newPlaylist,e.$parent.userInRoom=!0,e.sound=100,e.refresh=!1;var d=1,m=!1;e.setLower=function(t){return t?(e.sound=d,void(m=!1)):(d=e.sound,e.sound=0,void(m=!0))},e.managePlaylist=function(){var t=c.open({templateUrl:"./../templates/modals/managePlaylist.html",controller:"managePlaylistController",size:"lg",resolve:{loginSC:function(){return e.$parent.loginSC},getSoundcloudID:function(){return e.getSoundcloudID},getSCinstance:function(){return e.getSCinstance},currentDJ:function(){return e.room.currentDJ},username:function(){return e.$parent.currentUser.username},lower:function(){return e.setLower}}});t.result.then(function(){},function(){e.setLower(!0)})},a.getRoomInfo(n.roomName,function(t){e.room=t,r.verifyJwt(!0)?($.snackbar({content:"<i class='mdi-file-file-download big-icon'></i> Welcome to "+t.name}),e.$parent.auth(!0),e.$parent.getUserInfo(function(t){e.$parent.socket.emit("roomEntered",{roomName:n.roomName,user:t.username})})):($.snackbar({content:"You must be logged in to access Thee Table."}),i.path("/home")),null!==t.currentDJ&&(e.currentSong=s.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+t.currentSong.source).toString())}),e.$parent.showApp=!0,e.$watch("newSong",function(t){void 0!==t&&e.$parent.socket.emit("newPlaylistItem",{song:{source:t.source,title:t.title,artist:t.artist,length:t.length,soundcloudID:t.soundcloudID}})}),e.$watch("newPlaylist",function(t){void 0!==t&&e.$parent.socket.emit("newPlaylist",{playlist:t})}),e.liked=!1,e.like=function(t){e.liked=!0,e.$parent.likeSongOnSC(t.soundcloudID),$.snackbar({content:"<i class='mdi-file-cloud-queue big-icon'></i> "+t.title+" has been added to your soundcloud likes"})},e.addToQueue=function(){return e.$parent.currentUser.playlist.length>0?void e.$parent.socket.emit("addToQueue",{user:e.$parent.currentUser.username}):void $.snackbar({content:"<i class='mdi-notification-sms-failed big-icon'></i> Sorry, you must have a song on your playlist to enter the queue"})},e.skip=function(){e.$parent.socket.emit("updatePlaylist",{username:e.$parent.currentUser.username})},e.removeFromQueue=function(){e.$parent.socket.emit("removeFromQueue",{user:e.$parent.currentUser.username})},e.storedInUser=function(){return e.room&&e.$parent.currentUser&&-1!==e.$parent.currentUser.rooms.indexOf(e.room.name)?!0:!1},e.refreshPlayer=function(){e.refresh=!0,setTimeout(function(){e.refresh=!1},1e3)},e.convertTime=function(e){return l.convertTime(e)}}]),angular.module("theeTable.controllers").controller("roomsController",["$scope","$location","localStorageService","theeTableAuth","theeTableRooms","$modal",function(e,t,n,i,s,o){e.rooms=[],e.roomSearch={},e.$parent.userInRoom=!1,e.$parent.showApp=!0,s.getAllRooms(function(n){e.rooms=n.rooms,i.verifyJwt(!0)?(e.$parent.getUserInfo(),e.$parent.showApp=!0,e.favoriteRooms=[],i.getUserInfo(function(t){e.favoriteRooms=t.rooms})):($.snackbar({content:"You must be logged in to access Thee Table."}),t.path("/home"))}),e.navigate=function(e){t.path("/rooms/"+e)},e.createRoom=function(){o.open({templateUrl:"./../templates/modals/createRoom.html",controller:"createRoomController",size:"lg",resolve:{currentSocket:function(){return e.$parent.socket}}})}}]),angular.module("theeTable.controllers").controller("searchController",["$scope","$modalInstance","$modal","playlist","getSCinstance","theeTableSoundcloud","theeTableTime","lower","$sce",function(e,t,n,i,s,o,r,a,l){e.soundcloud={},e.search=function(t){e.soundcloud.results=[],e.searching=!0,t=$("#soundcloudSearch").val(),o.searchTracks(t,function(t){e.searching=!1,e.$apply(function(){e.soundcloud.results=t})}),e.soundcloud.query="",$("#soundcloudSearch").val("")},e.convertTime=function(e){return r.convertTime(e)},e.addSongToPlaylist=function(t,n,s,o,r,a){e.soundcloud.results.splice(a,1),e.$parent.newSong={source:t,title:n,artist:s,length:o,soundcloudID:r},i.push({source:t,title:n,artist:s,length:o,soundcloudID:r})},e.showPreview=!1,e.previewSource="";var c,u=function(e){return l.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e+"&auto_play=true")};e.preview=function(t){a(),e.showPreview=!0,console.log(t),console.log(e.soundcloud),e.previewSource=u(e.soundcloud.results[t].permalink_url),console.log(e.previewSource.toString()),e.previewIndex=t,setTimeout(function(){var e="sc-widget"+t,n=document.getElementById(e);void 0!==c&&c.unbind(SC.Widget.Events.READY),c=SC.Widget(n),c.bind(SC.Widget.Events.READY,function(){c.play()})},500)},e.close=function(){t.close()}}]),angular.module("theeTable.directives").directive("customInputBox",[function(){return{restrict:"E",templateUrl:"./../../templates/directives/inputDirective.html",scope:{socket:"=",input:"@"},controller:["$scope","theeTableRooms",function(e){e.newInput={},e.createDisabled=function(){return void 0===e.newInput.value||""===e.newInput.value?!0:!1},e.create=function(t){e.socket.emit("newChatMessage",{msg:t}),e.newInput.value=""}}],link:function(){$(document).ready(function(){setTimeout(function(){$.material.init()},0)})}}}]),angular.module("rzModule",[]).run(["$templateCache",function(e){"use strict";var t='<span class="rz-bar-wrapper"><span class="rz-bar"></span></span><span class="rz-bar rz-selection"></span><span class="rz-pointer"></span><span class="rz-pointer"></span><span class="rz-bubble rz-limit"></span><span class="rz-bubble rz-limit"></span><span class="rz-bubble"></span><span class="rz-bubble"></span><span class="rz-bubble"></span>';e.put("rzSliderTpl.html",t)}]).value("throttle",function(e,t,n){"use strict";var i,s,o,r=Date.now||function(){return(new Date).getTime()},a=null,l=0;n=n||{};var c=function(){l=n.leading===!1?0:r(),a=null,o=e.apply(i,s),i=s=null};return function(){var u=r();l||n.leading!==!1||(l=u);var h=t-(u-l);return i=this,s=arguments,0>=h?(clearTimeout(a),a=null,l=u,o=e.apply(i,s),i=s=null):a||n.trailing===!1||(a=setTimeout(c,h)),o}}).factory("RzSlider",["$timeout","$document","$window","throttle",function(e,t,n,i){"use strict";var s=function(e,t,n){this.scope=e,this.attributes=n,this.sliderElem=t,this.range=void 0!==n.rzSliderHigh&&void 0!==n.rzSliderModel,this.handleHalfWidth=0,this.alwaysShowBar=!!n.rzSliderAlwaysShowBar,this.maxLeft=0,this.precision=0,this.step=0,this.tracking="",this.minValue=0,this.maxValue=0,this.hideLimitLabels=!!n.rzSliderHideLimitLabels,this.presentOnly="true"===n.rzSliderPresentOnly,this.valueRange=0,this.initHasRun=!1,this.customTrFn=this.scope.rzSliderTranslate()||function(e){return String(e)},this.deRegFuncs=[],this.fullBar=null,this.selBar=null,this.minH=null,this.maxH=null,this.flrLab=null,this.ceilLab=null,this.minLab=null,this.maxLab=null,this.cmbLab=null,this.init()};return s.prototype={init:function(){var t,s,o,r=angular.bind(this,this.calcViewDimensions),a=this;this.initElemHandles(),this.calcViewDimensions(),this.setMinAndMax(),this.precision=void 0===this.scope.rzSliderPrecision?0:+this.scope.rzSliderPrecision,this.step=void 0===this.scope.rzSliderStep?1:+this.scope.rzSliderStep,e(function(){a.updateCeilLab(),a.updateFloorLab(),a.initHandles(),a.presentOnly||a.bindEvents()}),o=this.scope.$on("reCalcViewDimensions",r),this.deRegFuncs.push(o),angular.element(n).on("resize",r),this.initHasRun=!0,t=i(function(){a.setMinAndMax(),a.updateLowHandle(a.valueToOffset(a.scope.rzSliderModel)),a.updateSelectionBar(),a.range&&a.updateCmbLabel()},350,{leading:!1}),s=i(function(){a.setMinAndMax(),a.updateHighHandle(a.valueToOffset(a.scope.rzSliderHigh)),a.updateSelectionBar(),a.updateCmbLabel()},350,{leading:!1}),this.scope.$on("rzSliderForceRender",function(){a.resetLabelsValue(),t(),a.range&&s(),a.resetSlider()}),o=this.scope.$watch("rzSliderModel",function(e,n){e!==n&&t()}),this.deRegFuncs.push(o),o=this.scope.$watch("rzSliderHigh",function(e,t){e!==t&&s()}),this.deRegFuncs.push(o),this.scope.$watch("rzSliderFloor",function(e,t){e!==t&&a.resetSlider()}),this.deRegFuncs.push(o),o=this.scope.$watch("rzSliderCeil",function(e,t){e!==t&&a.resetSlider()}),this.deRegFuncs.push(o),this.scope.$on("$destroy",function(){a.minH.off(),a.maxH.off(),angular.element(n).off("resize",r),a.deRegFuncs.map(function(e){e()})})},resetSlider:function(){this.setMinAndMax(),this.calcViewDimensions(),this.updateCeilLab(),this.updateFloorLab()},resetLabelsValue:function(){this.minLab.rzsv=void 0,this.maxLab.rzsv=void 0},initHandles:function(){this.updateLowHandle(this.valueToOffset(this.scope.rzSliderModel)),this.range&&(this.updateHighHandle(this.valueToOffset(this.scope.rzSliderHigh)),this.updateCmbLabel()),this.updateSelectionBar()},translateFn:function(e,t,n){n=void 0===n?!0:n;var i=String(n?this.customTrFn(e):e),s=!1;(void 0===t.rzsv||t.rzsv.length!==i.length||t.rzsv.length>0&&0===t.rzsw)&&(s=!0,t.rzsv=i),t.text(i),s&&this.getWidth(t)},setMinAndMax:function(){this.minValue=this.scope.rzSliderFloor?+this.scope.rzSliderFloor:this.scope.rzSliderFloor=0,this.scope.rzSliderCeil?this.maxValue=+this.scope.rzSliderCeil:this.scope.rzSliderCeil=this.maxValue=this.range?this.scope.rzSliderHigh:this.scope.rzSliderModel,this.scope.rzSliderStep&&(this.step=+this.scope.rzSliderStep),this.valueRange=this.maxValue-this.minValue},initElemHandles:function(){angular.forEach(this.sliderElem.children(),function(e,t){var n=angular.element(e);switch(t){case 0:this.fullBar=n;break;case 1:this.selBar=n;break;case 2:this.minH=n;break;case 3:this.maxH=n;break;case 4:this.flrLab=n;break;case 5:this.ceilLab=n;break;case 6:this.minLab=n;break;case 7:this.maxLab=n;break;case 8:this.cmbLab=n}},this),this.selBar.rzsl=0,this.minH.rzsl=0,this.maxH.rzsl=0,this.flrLab.rzsl=0,this.ceilLab.rzsl=0,this.minLab.rzsl=0,this.maxLab.rzsl=0,this.cmbLab.rzsl=0,this.hideLimitLabels&&(this.flrLab.rzAlwaysHide=!0,this.ceilLab.rzAlwaysHide=!0,this.hideEl(this.flrLab),this.hideEl(this.ceilLab)),this.range===!1&&(this.cmbLab.remove(),this.maxLab.remove(),this.maxH.rzAlwaysHide=!0,this.maxH[0].style.zIndex="-1000",this.hideEl(this.maxH)),this.range===!1&&this.alwaysShowBar===!1&&(this.maxH.remove(),this.selBar.remove())},calcViewDimensions:function(){var e=this.getWidth(this.minH);this.handleHalfWidth=e/2,this.barWidth=this.getWidth(this.fullBar),this.maxLeft=this.barWidth-e,this.getWidth(this.sliderElem),this.sliderElem.rzsl=this.sliderElem[0].getBoundingClientRect().left,this.initHasRun&&(this.updateCeilLab(),this.initHandles())},updateCeilLab:function(){this.translateFn(this.scope.rzSliderCeil,this.ceilLab),this.setLeft(this.ceilLab,this.barWidth-this.ceilLab.rzsw),this.getWidth(this.ceilLab)},updateFloorLab:function(){this.translateFn(this.scope.rzSliderFloor,this.flrLab),this.getWidth(this.flrLab)},callOnChange:function(){this.scope.rzSliderOnChange&&this.scope.rzSliderOnChange()},updateHandles:function(e,t){return this.callOnChange(),"rzSliderModel"===e?(this.updateLowHandle(t),this.updateSelectionBar(),void(this.range&&this.updateCmbLabel())):"rzSliderHigh"===e?(this.updateHighHandle(t),this.updateSelectionBar(),void(this.range&&this.updateCmbLabel())):(this.updateLowHandle(t),this.updateHighHandle(t),this.updateSelectionBar(),void this.updateCmbLabel())},updateLowHandle:function(e){var t=Math.abs(this.minH.rzsl-e);this.minLab.rzsv&&1>t||(this.setLeft(this.minH,e),this.translateFn(this.scope.rzSliderModel,this.minLab),this.setLeft(this.minLab,e-this.minLab.rzsw/2+this.handleHalfWidth),this.shFloorCeil())},updateHighHandle:function(e){this.setLeft(this.maxH,e),this.translateFn(this.scope.rzSliderHigh,this.maxLab),this.setLeft(this.maxLab,e-this.maxLab.rzsw/2+this.handleHalfWidth),this.shFloorCeil()},shFloorCeil:function(){var e=!1,t=!1;this.minLab.rzsl<=this.flrLab.rzsl+this.flrLab.rzsw+5?(e=!0,this.hideEl(this.flrLab)):(e=!1,this.showEl(this.flrLab)),this.minLab.rzsl+this.minLab.rzsw>=this.ceilLab.rzsl-this.handleHalfWidth-10?(t=!0,this.hideEl(this.ceilLab)):(t=!1,this.showEl(this.ceilLab)),this.range&&(this.maxLab.rzsl+this.maxLab.rzsw>=this.ceilLab.rzsl-10?this.hideEl(this.ceilLab):t||this.showEl(this.ceilLab),this.maxLab.rzsl<=this.flrLab.rzsl+this.flrLab.rzsw+this.handleHalfWidth?this.hideEl(this.flrLab):e||this.showEl(this.flrLab))},updateSelectionBar:function(){this.setWidth(this.selBar,Math.abs(this.maxH.rzsl-this.minH.rzsl)),this.setLeft(this.selBar,this.range?this.minH.rzsl+this.handleHalfWidth:0)},updateCmbLabel:function(){var e,t;this.minLab.rzsl+this.minLab.rzsw+10>=this.maxLab.rzsl?(this.customTrFn?(e=this.customTrFn(this.scope.rzSliderModel),t=this.customTrFn(this.scope.rzSliderHigh)):(e=this.scope.rzSliderModel,t=this.scope.rzSliderHigh),this.translateFn(e+" - "+t,this.cmbLab,!1),this.setLeft(this.cmbLab,this.selBar.rzsl+this.selBar.rzsw/2-this.cmbLab.rzsw/2),this.hideEl(this.minLab),this.hideEl(this.maxLab),this.showEl(this.cmbLab)):(this.showEl(this.maxLab),this.showEl(this.minLab),this.hideEl(this.cmbLab))},roundStep:function(e){var t=this.step,n=+((e-this.minValue)%t).toFixed(3),i=n>t/2?e+t-n:e-n;return i=i.toFixed(this.precision),+i},hideEl:function(e){return e.css({opacity:0})},showEl:function(e){return e.rzAlwaysHide?e:e.css({opacity:1})},setLeft:function(e,t){return e.rzsl=t,e.css({left:t+"px"}),t},getWidth:function(e){var t=e[0].getBoundingClientRect();return e.rzsw=t.right-t.left,e.rzsw},setWidth:function(e,t){return e.rzsw=t,e.css({width:t+"px"}),t},valueToOffset:function(e){return(e-this.minValue)*this.maxLeft/this.valueRange},offsetToValue:function(e){return e/this.maxLeft*this.valueRange+this.minValue},bindEvents:function(){this.minH.on("mousedown",angular.bind(this,this.onStart,this.minH,"rzSliderModel")),this.range&&this.maxH.on("mousedown",angular.bind(this,this.onStart,this.maxH,"rzSliderHigh")),this.fullBar.on("mousedown",angular.bind(this,this.onStart,this.minH,"rzSliderModel")),this.fullBar.on("mousedown",angular.bind(this,this.onMove,this.fullBar)),this.selBar.on("mousedown",angular.bind(this,this.onStart,this.minH,"rzSliderModel")),this.selBar.on("mousedown",angular.bind(this,this.onMove,this.selBar)),this.minH.on("touchstart",angular.bind(this,this.onStart,this.minH,"rzSliderModel")),this.range&&this.maxH.on("touchstart",angular.bind(this,this.onStart,this.maxH,"rzSliderHigh")),this.fullBar.on("touchstart",angular.bind(this,this.onStart,this.minH,"rzSliderModel")),this.fullBar.on("touchstart",angular.bind(this,this.onMove,this.fullBar)),this.selBar.on("touchstart",angular.bind(this,this.onStart,this.minH,"rzSliderModel")),this.selBar.on("touchstart",angular.bind(this,this.onMove,this.selBar))},onStart:function(e,n,i){var s,o,r=this.getEventNames(i);i.stopPropagation(),i.preventDefault(),""===this.tracking&&(this.calcViewDimensions(),this.tracking=n,e.addClass("rz-active"),s=angular.bind(this,this.onMove,e),o=angular.bind(this,this.onEnd,s),t.on(r.moveEvent,s),t.one(r.endEvent,o))},onMove:function(e,t){var n,i,s,o;if(n="clientX"in t?t.clientX:void 0===t.originalEvent?t.touches[0].clientX:t.originalEvent.touches[0].clientX,i=this.sliderElem.rzsl,s=n-i-this.handleHalfWidth,0>=s){if(0===e.rzsl)return;o=this.minValue,s=0}else if(s>=this.maxLeft){if(e.rzsl===this.maxLeft)return;o=this.maxValue,s=this.maxLeft}else o=this.offsetToValue(s),o=this.roundStep(o),s=this.valueToOffset(o);this.positionTrackingHandle(o,s)},positionTrackingHandle:function(e,t){this.range&&("rzSliderModel"===this.tracking&&e>=this.scope.rzSliderHigh?(this.scope[this.tracking]=this.scope.rzSliderHigh,this.updateHandles(this.tracking,this.maxH.rzsl),this.tracking="rzSliderHigh",this.minH.removeClass("rz-active"),this.maxH.addClass("rz-active"),this.scope.$apply()):"rzSliderHigh"===this.tracking&&e<=this.scope.rzSliderModel&&(this.scope[this.tracking]=this.scope.rzSliderModel,this.updateHandles(this.tracking,this.minH.rzsl),this.tracking="rzSliderModel",this.maxH.removeClass("rz-active"),this.minH.addClass("rz-active"),this.scope.$apply())),this.scope[this.tracking]!==e&&(this.scope[this.tracking]=e,this.updateHandles(this.tracking,t),this.scope.$apply())},onEnd:function(e,n){var i=this.getEventNames(n).moveEvent;this.minH.removeClass("rz-active"),this.maxH.removeClass("rz-active"),t.off(i,e),this.scope.$emit("slideEnded"),this.tracking=""},getEventNames:function(e){var t={moveEvent:"",endEvent:""};return e.touches||void 0!==e.originalEvent&&e.originalEvent.touches?(t.moveEvent="touchmove",t.endEvent="touchend"):(t.moveEvent="mousemove",t.endEvent="mouseup"),t}},s}]).directive("rzslider",["RzSlider",function(e){"use strict";return{restrict:"E",scope:{rzSliderFloor:"=?",rzSliderCeil:"=?",rzSliderStep:"@",rzSliderPrecision:"@",rzSliderModel:"=?",rzSliderHigh:"=?",rzSliderTranslate:"&",rzSliderHideLimitLabels:"=?",rzSliderAlwaysShowBar:"=?",rzSliderPresentOnly:"@",rzSliderOnChange:"&"},templateUrl:function(e,t){return t.rzSliderTplUrl||"rzSliderTpl.html"},link:function(t,n,i){return new e(t,n,i)}}}]),angular.module("theeTable.directives").directive("soundCloudPlayer",[function(){return{restrict:"E",template:'<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe>',scope:{socket:"=",currentSong:"=",room:"=",username:"=",title:"=",sound:"=",refresh:"="},controller:["$scope","$sce",function(e,t){var n,i,s=function(){i.unbind(SC.Widget.Events.READY),i.unbind(SC.Widget.Events.PLAY_PROGRESS),i.unbind(SC.Widget.Events.PLAY),i.unbind(SC.Widget.Events.FINISH)};e.thisSong="",e.sce=function(e){return t.trustAsResourceUrl("https://w.soundcloud.com/player/?url="+e)},e.updatePlayer=function(t,n){t&&i.load(t+"?single_active=false",{show_artwork:!0}),i.bind(SC.Widget.Events.READY,function(){i.bind(SC.Widget.Events.PLAY_PROGRESS,function(t){e.room.currentDJ===e.username&&e.socket.emit("currentTime",{time:t.currentPosition})}),i.bind(SC.Widget.Events.PLAY,function(){return(e.room.currentDJ!==e.username||n===!0)&&i.seekTo(e.room.currentTime),e.room.currentSong?void i.getCurrentSound(function(t){e.$apply(function(){e.title=t.title})}):(delete e.title,e.oldValue&&i.seekTo(e.oldValue.length),delete e.oldValue,void s())}),setTimeout(function(){i.setVolume(e.sound/100)},500),i.bind(SC.Widget.Events.FINISH,function(){s(),e.room.currentDJ===e.username&&e.socket.emit("updatePlaylist",{username:e.username})}),i.play()})},e.setUpPlayer=function(){setTimeout(function(){n=document.getElementById("sc-widget"),i=SC.Widget(n),e.updatePlayer()},500)},e.setVolume=function(e){i&&i.setVolume(e)},e.reloadWidget=function(){s();var t=e.currentSong.source+"?single_active=false";e.updatePlayer(t,!0)}}],link:function(e){var t=!0;e.$watch("currentSong",function(n,i){t||null!==n||(e.oldValue=i,delete e.title,e.updatePlayer("")),void 0!==n&&null!==n&&(t?(e.thisSong=e.sce(n.source+"?single_active=false"),e.setUpPlayer(),t=!1):(delete e.title,e.updatePlayer(n.source+"?single_active=false")))}),e.$watch("sound",function(t){void 0!==t&&e.setVolume(t/100)}),e.$watch("refresh",function(t){t&&e.reloadWidget()})}}}]),angular.module("theeTable.services").factory("theeTableAuth",["$http","localStorageService","$location","theeTableUrl",function(e,t,n,i){var s=function(t,n,i,s,o,r){e.post(t,{username:n,password:i,accessToken:s,scID:o}).success(function(e){r(e)}).error(function(e){console.log(e)})},o=function(n){var s=t.get("jwt");e.get(""+i.getUrl()+"/user?jwt_token="+s).success(function(e){n(e)}).error(function(e){console.log(e)})},r=function(e){var i=t.get("jwt");return i?!0:(e||(alert("you must be logged in to access Thee Table."),n.path("/main")),!1)};return{siteAccess:s,getUserInfo:o,verifyJwt:r}}]),angular.module("theeTable.services").factory("theeTableRooms",["$http","localStorageService","$location","theeTableUrl",function(e,t,n,i){var s=t.get("jwt"),o=function(t){e.get(""+i.getUrl()+"/rooms").success(function(e){t(e)}).error(function(e){console.log(e)})},r=function(t,o){e.post(""+i.getUrl()+"/rooms?jwt_token="+s,{name:t}).success(function(e){return e.message?void o(e):(o(e),void n.path("/rooms/"+e.name))}).error(function(e){console.log(e)})},a=function(t,s){return""===t?void n.path("/rooms"):void e.get(""+i.getUrl()+"/rooms/"+t).success(function(e){return e.message?(alert(e.message),void n.path("/rooms")):void s(e)}).error(function(e){console.log(e)})};return{getAllRooms:o,createRoom:r,getRoomInfo:a}}]),angular.module("theeTable.services").factory("theeTableSocket",["$rootScope",function(e){var t=io.connect(),n=!1,i=function(n,i){t.on(n,function(){var n=arguments;e.$apply(function(){i.apply(t,n)})})},s=function(n,i,s){t.emit(n,i,function(){var n=arguments;e.$apply(function(){s&&s.apply(t,n)})})},o=function(){n&&(t.connect(),n=!1)},r=function(){t.disconnect(),n=!0};return{on:i,emit:s,connect:o,disconnect:r}}]),angular.module("theeTable.services").factory("theeTableSoundcloud",["theeTableAuth","theeTableUrl","localStorageService",function(e,t,n){var i,s={},o=function(){return s},r=function(e){return i=e},a=function(e,t){s.id=e,s.username=t},l=function(){return i},c=function(i,s,o,r,a,l){e.siteAccess(""+t.getUrl()+i,o,"abc",r,a,function(e){return e.message?s?void c("/user/new",!1,o,r,a,l):void($scope.message=e.message):(n.set("jwt",e.jwt),void l())})},u=function(e){i.connect(function(){i.get("/me",function(t){s.id=t.id,s.username=t.username,c("/user/login",!0,t.username,i.accessToken(),t.id,e)})})},h=function(e){i.put("/me/favorites/"+e)},d=function(e,t){i.get("/tracks",{q:e},function(e){t(e)})},m=function(e){var t="/users/"+s.id+"/playlists";i.get(t,function(t){i.get("/users/"+s.id+"/favorites",function(n){e(n,t)})})};return{getSoundcloudID:o,setSoundcloudID:a,setSCinstance:r,getSCinstance:l,like:h,searchTracks:d,getPlaylists:m,loginSC:u}}]),angular.module("theeTable.services").factory("theeTableTime",[function(){var e=function(e){var t=Math.floor(e/36e5),n=Math.floor(e%36e5/6e4),i=Math.floor(e%36e4%6e4/1e3);return 10>i&&(i="0"+i),10>n&&(n="0"+n),t>0?t+":"+n+":"+i:n+":"+i};return{convertTime:e}}]),angular.module("theeTable.services").factory("theeTableUrl",[function(){var e=function(){return ttURL},t=function(){return scID};return{getUrl:e,getID:t}}]),!function(e){function t(e){return"undefined"!=typeof e&&null!==e?!0:!1}e(document).ready(function(){e("body").append("<div id=snackbar-container/>")}),e(document).on("click","[data-toggle=snackbar]",function(){e(this).snackbar("toggle")}).on("click","#snackbar-container .snackbar",function(){e(this).snackbar("hide")}),e.snackbar=function(n){if(t(n)&&n===Object(n)){var i;i=t(n.id)?e("#"+n.id):e("<div/>").attr("id","snackbar"+Date.now()).attr("class","snackbar");var s=i.hasClass("snackbar-opened");t(n.style)?i.attr("class","snackbar "+n.style):i.attr("class","snackbar"),n.timeout=t(n.timeout)?n.timeout:3e3,t(n.content)&&(i.find(".snackbar-content").length?i.find(".snackbar-content").text(n.content):i.prepend("<span class=snackbar-content>"+n.content+"</span>")),t(n.id)?i.insertAfter("#snackbar-container .snackbar:last-child"):i.appendTo("#snackbar-container"),t(n.action)&&"toggle"==n.action&&(n.action=s?"hide":"show");var o=Date.now();i.data("animationId1",o),setTimeout(function(){i.data("animationId1")===o&&(t(n.action)&&"show"!=n.action?t(n.action)&&"hide"==n.action&&i.removeClass("snackbar-opened"):i.addClass("snackbar-opened"))},50);var r=Date.now();return i.data("animationId2",r),0!==n.timeout&&setTimeout(function(){i.data("animationId2")===r&&i.removeClass("snackbar-opened")},n.timeout),i}return!1},e.fn.snackbar=function(n){var i={};
if(this.hasClass("snackbar"))return i.id=this.attr("id"),("show"===n||"hide"===n||"toggle"==n)&&(i.action=n),e.snackbar(i);t(n)&&"show"!==n&&"hide"!==n&&"toggle"!=n||(i={content:e(this).attr("data-content"),style:e(this).attr("data-style"),timeout:e(this).attr("data-timeout")}),t(n)&&(i.id=this.attr("data-snackbar-id"),("show"===n||"hide"===n||"toggle"==n)&&(i.action=n));var s=e.snackbar(i);return this.attr("data-snackbar-id",s.attr("id")),s}}(jQuery);