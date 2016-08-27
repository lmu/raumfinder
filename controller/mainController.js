'use strict';
angular.module('myApp').
controller('MainCtrl', ['$scope', 'buildingTestDirect', '$filter',
                        function ($scope, buildingTestDirect, $filter) {

        // Setup mobile top menu
        $scope.naviLink = '';
        $scope.naviText = "Raumfinder";


        // Initialize map
        angular.extend($scope, {
            cityCenter: {
                lat: 48.145,
                lng: 11.58,
                zoom: 14
            },
            cityLayers: {
                url: 'http://api.tiles.mapbox.com/v4/maxmediapictures.o2e7pbh8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF4bWVkaWFwaWN0dXJlcyIsImEiOiJ2NXRBMGlFIn0.K9dbubXdaU77e0PdLGN7iw',
                type: 'xyz',
                layerOptions: {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                }
            },
            cityMarkers: {},
            events: {
                map: {
                    enable: [],
                    logic: 'emit'
                }
            }
        });

        // Load Buildings     
        buildingTestDirect.getAllBuildings().then(function (buildings) {
            $scope.buildings = buildings;
        });


        // Watch search input and update visible markers
        $scope.$watch('searchText', function (value) {
            if ($scope.buildings) setMarker($filter('filterBuildings')($scope.buildings, $scope.searchText));
        });

                            
        // Create marker on map and zoom map
        function setMarker(buildings) {
            var tempMarkers = {};
            var bounds = {};

            // If no buldings are selected, show this part of map
            if (buildings.length == 0) {
                bounds = {
                    southWest: {
                        lat: 48.0521683,
                        lng: 11.36503
                    },
                    northEast: {
                        lat: 48.2521683,
                        lng: 11.68137
                    }
                }
            } 
            
            // Else expand bounds to maximum and then narrow the area down
            else {
                bounds = {
                    southWest: {
                        lat: 100.0,
                        lng: 100.0
                    },
                    northEast: {
                        lat: 0.0,
                        lng: 0.0
                    }
                }
            };

            // For all selected buildings create marker and shrinks bounds
            for (var i = 0; i < buildings.length; i++) {

                tempMarkers[buildings[i].code] = {
                    lat: parseFloat(buildings[i].lat),
                    lng: parseFloat(buildings[i].lng),
                    message: '<p style="text-align: center">' +
                        '<b>' + buildings[i].displayName + '</b></br>' +
                        '<a href="#/building/' + buildings[i].code + '/map">Raumplan anzeigen &#62;</a>' +
                        '</p>',
                }

                if (buildings[i].lat < bounds.southWest.lat) bounds.southWest.lat = buildings[i].lat - 0.001;
                if (buildings[i].lng > bounds.northEast.lng) bounds.northEast.lng = buildings[i].lng + 0.001;
                if (buildings[i].lat > bounds.northEast.lat) bounds.northEast.lat = buildings[i].lat + 0.001;
                if (buildings[i].lng < bounds.southWest.lng) bounds.southWest.lng = buildings[i].lng - 0.001;

            }

            //Set maxbounds and markers to scope
            angular.extend($scope, {
                cityMarkers: tempMarkers,
                cityBounds: bounds
            });
        };

                            /*
        function setMaxBounds(buildings) {
            console.info('setMaxBounds');
            var temp = {
                southWest: {
                    lat: 100.0,
                    lng: 100.0
                },
                northEast: {
                    lat: 0.0,
                    lng: 0.0
                }
            };

            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i].lat < temp.southWest.lat) temp.southWest.lat = (buildings[i].lat) - 0.1;
                if (buildings[i].lng > temp.northEast.lng) temp.northEast.lng = (buildings[i].lng) + 0.1;
                if (buildings[i].lat > temp.northEast.lat) temp.northEast.lat = (buildings[i].lat) + 0.15;
                if (buildings[i].lng < temp.southWest.lng) temp.southWest.lng = (buildings[i].lng) - 0.1;
            };

            angular.extend($scope, {
                cityMaxBounds: temp
            });
        };
        */

}]);