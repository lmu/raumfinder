'use strict';

angular.module('myApp')

.controller('buildingCtrl', ['$scope', 'buildingTestDirect', '$routeParams', 'leafletData', '$filter', '$location',
    function ($scope, buildingTestDirect, $routeParams, leafletData, $filter, $location) {

        // Set up data objects
        var ctrl = this;
        $scope.naviLink = ' ';
        $scope.naviText = "Gebäudesuche";
        

        // BUILDING CODE
        // Get the building code from URI
        buildingTestDirect.getBuilding($routeParams.id)
            // If promise is fullfilled
            .then(function (building) {
                ctrl.building = building;

                // Set map
                angular.extend($scope, {
                    center: {
                        lat: ctrl.building.lat,
                        lng: ctrl.building.lng,
                        zoom: 18,
                    },
                    marker: {
                        building: {
                            lat: ctrl.building.lat,
                            lng: ctrl.building.lng,
                            focus: true,
                            popupOptions: {
                                closeButton: false
                            },
                            message: '<p style="text-align: center"><b>' +
                                $filter('capitalize')(ctrl.building.displayName, true) +
                                '</b></br> <a href="#/building/' + building.code + '/map">Raumplan anzeigen &#62;</a></p>',
                        }
                    }
                });

            }, function (err) {
                // Building could not be found 
                $location.path("/404");
            });


        // Disable pannning and zooming of map on smartphones
        if (window.screen.width <= 767) {
            leafletData.getMap().then(function (map) {
                map.dragging.disable();
                map.zoomControl = false;
            });
            angular.extend($scope, {
                default: {
                    zoomControl: false
                }
            });
        }


        //Init map
        angular.extend($scope, {
            tiles: {
                url: 'http://api.tiles.mapbox.com/v4/maxmediapictures.o2e7pbh8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF4bWVkaWFwaWN0dXJlcyIsImEiOiJ2NXRBMGlFIn0.K9dbubXdaU77e0PdLGN7iw',
                type: 'xyz',
                layerOptions: {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                }
            },
            center: {
                lat: 48.14,
                lng: 11.58,
                zoom: 13
            }
        });
    }
]);