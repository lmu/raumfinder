'use strict';
angular.module('LMURaumfinder').
controller('MainCtrl', ['$scope', 'buildingManager', '$filter', 'MAP_DEFAULTS',
                        function ($scope, buildingManager, $filter, MAP_DEFAULTS) {

        // Setup mobile top menu
        $scope.naviLink = '';
        $scope.naviText = "Raumfinder";


        // Initialize map object
        angular.extend($scope, {
            cityCenter: {
                lat: 48.145,
                lng: 11.58,
                zoom: 14
            },
            cityLayers: {
                url: MAP_DEFAULTS.MAPTILES_URL,
                type: 'xyz',
                options: {
                    attribution: MAP_DEFAULTS.MAP_CREDITS
                }
            },
            cityMarkers: {},
            events: {}
        });

        // Load Buildings     
        buildingManager.getAllBuildings().then(function (buildings) {
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
            
            // In order to show "no builings" instead of list
            $scope.builingsCount = buildings.length;

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
                    message: '<b>' + buildings[i].displayName + '</b></br>' +
                        '<a href="#/building/' + buildings[i].code + '/map">Raumplan anzeigen &#62;</a>' 
                        
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

}]);