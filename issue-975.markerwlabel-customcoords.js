angular.module("markerCoordsTest", ['uiGmapgoogle-maps'])

  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
      v: '3',
      libraries: '',
      key:'AIzaSyB4iF-sbQ8jILkuFHfvcNSkytxmtkzppYA'
    });
  }])

  .controller("TestController", function($scope, $interval) {

    icon = undefined;

    $scope.map = {
      title: "A test map",
      center: {latitude: 45.0,longitude: 11.0},
      zoom: 1
    };

    //Markers with label updating OK with default 'coords' property
    $scope.markersLabelOK = [
      {
        id: "myMarker",
        //"default" coords
        coords: {
          latitude: 45.0,
          longitude: 11.0
        },
        options:{
          labelContent: "markerLabel with default 'coords'",
          labelAnchor: "5 0",
          labelClass: "marker-labels"
        }
      }
    ];

    //Markers with label NOT updating OK with custom 'coords' property, check console for error
    $scope.markersLabelNotOK = [
      {
        id: "myMarker2",
        //"custom" coords
        xcoords: {
          latitude: 45.005,
          longitude: 11.005
        },
        options:{
          labelContent: "markerLabel with custom 'coords'",
          labelAnchor: "5 0",
          labelClass: "marker-labels"
        }
      }
    ];

    //Markers without label updating OK with custom 'coords' property
    $scope.markersOK = [
      {
        id: "myMarker3",
        //"custom" coords
        xcoords: {
          latitude: 45.005,
          longitude: 11.0
        }
      }
    ];

    $interval(function() {
      $scope.markersLabelOK[0].coords.latitude = $scope.markersLabelOK[0].coords.latitude + 0.0001;
      $scope.markersLabelOK[0].coords.longitude = $scope.markersLabelOK[0].coords.longitude + 0.0001;
     //   $scope.map.zoom+=1;
    }, 1500);
    $interval(function() {
      $scope.markersLabelNotOK[0].xcoords.latitude = $scope.markersLabelNotOK[0].xcoords.latitude + 0.0001;
      $scope.markersLabelNotOK[0].xcoords.longitude = $scope.markersLabelNotOK[0].xcoords.longitude + 0.0001;
    }, 1500);
    $interval(function() {
      $scope.markersOK[0].xcoords.latitude = $scope.markersOK[0].xcoords.latitude + 0.0001;
      $scope.markersOK[0].xcoords.longitude = $scope.markersOK[0].xcoords.longitude + 0.0001;
    }, 1500);
  });
