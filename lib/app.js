 function getNormalizedCoord(coord, zoom) {
     var y = coord.y;
     var x = coord.x;
     var tileRange = 1 << zoom;
     if (y < 0 || y >= tileRange) {
         return null;
     }
     if (x < 0 || x >= tileRange) {
         x = (x % tileRange + tileRange) % tileRange;
     }
     return {
         x: x,
         y: y
     };
 }

 var app = angular.module("markerCoordsTest", ['uiGmapgoogle-maps']);

 app.config(['uiGmapGoogleMapApiProvider', function(GoogleMapApi) {
     GoogleMapApi.configure({
         v: '3',
         libraries: '',
         key: 'AIzaSyB4iF-sbQ8jILkuFHfvcNSkytxmtkzppYA'
     });
 }]);

 app.factory('_', ['$window',
     function($window) {
         // place lodash include before angular
         return $window._;
     }
 ])


 app.controller('abcd', ["$scope", "uiGmapGoogleMapApi", "_", function($scope, uiGmapGoogleMapApi, _) {
     var _self = this;

     var markerFormat = {
         id: null,
         coords: {
             latitude: null,
             longitude: null
         },
         options: {
             labelContent: null,
             labelAnchor: "0 0",
             labelClass: "marker-labels",
             hideRange: 4,
             opacity: 1
         },
         labelShow: null
     }

     var markerIdCount = 0;
     var oldMarkerData = null;

     _self.currentMarkerData = null;

     _self.addProcess = function() {
         _self.currentMarkerData = angular.copy(markerFormat);
     }

     uiGmapGoogleMapApi.then(function(maps) {

         _self.moonMapType = {
             getTileUrl: function(coord, zoom) {
                 var normalizedCoord = getNormalizedCoord(coord, zoom);
                 if (!normalizedCoord) {
                     return null;
                 }

                 switch (zoom) {
                     case 1:
                         if (normalizedCoord.x == 1) {
                             return null;
                         }
                         break;

                     case 2:
                         if (normalizedCoord.x > 1 || normalizedCoord.y > 2) {
                             return null;
                         }
                         break;

                     case 3:
                         if (normalizedCoord.x > 2 || normalizedCoord.y > 5) {
                             return null;
                         }
                         break;

                     case 4:
                         if (normalizedCoord.x > 5 || normalizedCoord.y > 11) {
                             return null;
                         }
                         break;
                 }

                 var bound = Math.pow(2, zoom);
                 return 'tile' +
                     '/' + zoom + '/' + normalizedCoord.x + '/' +
                     (normalizedCoord.y) + '.png';
             },
             tileSize: new maps.Size(256, 256),
             maxZoom: 4,
             minZoom: 2,
             name: 'moon'
         };

     });

     _self.map = {
         title: "A test map",
         center: {
             latitude: 49.1529,
             longitude: -119.1796
         },
         zoom: 2,
         options: {
             mapTypeId: 'moon',
             mapTypeControlOptions: {
                 mapTypeIds: ['moon']
             },
             disableDefaultUI: true
         },
         events: {
             click: function(mapModel, eventName, originalEventArgs) {
                 if (_self.currentMarkerData) {
                     var e = originalEventArgs[0];
                     _self.currentMarkerData.coords.latitude = e.latLng.lat();
                     _self.currentMarkerData.coords.longitude = e.latLng.lng();
                     $scope.$apply();
                 }
             }
         },
         windowShow: true,
         modiftBtnText: "add"
     };

     _self.ctrl = {
         editMode: false,
         modeBtnTxt: "edit mode",
         changeMode: function() {
             this.editMode = !this.editMode;
             markerEditCancel();
             if (this.editMode) {
                 this.modeBtnTxt = "end edit mode";
             } else {
                 this.modeBtnTxt = "edit mode";
             }
         }
     }

     _self.marker = [];

     _self.addMarker = function() {

         if (!_self.currentMarkerData.coords.latitude || !_self.currentMarkerData.coords.longitude) {
             return;
         }

         markerIdCount++
         _self.currentMarkerData.id = markerIdCount;
         _self.marker.push(angular.copy(_self.currentMarkerData));
         _self.currentMarkerData = null;

         //console.log(_.find(_self.marker,{id:0}));
     }

     _self.modifyMarker = function() {
         _self.currentMarkerData = null;
         oldMarkerData = null;
     }

     _self.cancelMarkerEdit = function() {
         markerEditCancel();
     }

     function markerEditCancel() {
         if (oldMarkerData) {
             _self.currentMarkerData.coords = angular.copy(oldMarkerData.coords);
             _self.currentMarkerData.options.labelContent = angular.copy(oldMarkerData.options.labelContent);
             oldMarkerData = null;
             _.forEach(_self.marker, function(value) {
                 value.options.opacity = 1;
             })
         }

         _self.currentMarkerData = null;
     }

     _self.markerEvent = {
         click: function(marker, eventName, model) {
             var _key = marker.key;
             if (!_self.ctrl.editMode) {
                 _.forEach(_self.marker, function(value) {
                     if (value.id != _key) {
                         value.labelShow = false;
                     } else {
                         value.labelShow = true;
                     }
                 })
             } else {
                 _self.currentMarkerData = _.find(_self.marker, { id: _key });

                 _.forEach(_self.marker, function(value, key) {
                     if (value.id != _key) {
                         value.options.opacity = 0.5;
                     } else {
                         value.options.opacity = 1;
                     }
                 })

                 oldMarkerData = angular.copy(_self.currentMarkerData);
             }
         }
     }

     _self.moveTo = function(_coords) {
         _self.map.center.latitude = _coords.latitude;
         _self.map.center.longitude = _coords.longitude;
     }



 }]);