'use strict';

angular.module('myApp')

.controller('buildingCtrl', ['$scope', 'buildingManager', '$routeParams', 'leafletData', '$filter', '$location', 'MAP_DEFAULTS',
    function ($scope, buildingManager, $routeParams, leafletData, $filter, $location, MAP_DEFAULTS) {

        // Set up data objects
        var ctrl = this;
        $scope.naviLink = ' ';
        $scope.naviText = "Gebäudesuche";


        // Get the building code from URI and load building data
        buildingManager.getBuilding($routeParams.id)
            // If promise is fullfilled
            .then(function (building) {

                ctrl.building = building;
                setMarker(building);
            
            }, function (err) {
                // Building could not be found 
                $location.path("/404");
            });


        function setMarker(building) {
            leafletData.getMap().then(function (map) {
                
                // Disable map zoom on mobile phones
                if (window.screen.width <= 767) {
                    map.dragging.disable();
                    map.removeControl(map.zoomControl);
                }

                // Create marker
                map.panTo([building.lat, building.lng]);
                L.marker([building.lat, building.lng])
                    .addTo(map)
                    .bindPopup('<b>' + building.displayName + '</b>' +
                        '</br> <a href="#/building/' + building.code + '/map">Raumplan anzeigen</a>')
                    .openPopup();
            });
        }


        //Init map
        angular.extend($scope, {
            tiles: {
                url: MAP_DEFAULTS.MAPTILES_URL,
                type: 'xyz',
                options: {
                    attribution: MAP_DEFAULTS.MAP_CREDITS
                }
            },
            center: {
                lat: 48.14,
                lng: 11.58,
                zoom: 18
            }
        });
    }
]);