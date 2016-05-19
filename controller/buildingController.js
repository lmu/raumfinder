'use strict';

angular.module('myApp')

.controller('buildingCtrl', ['$scope', '$http', '$routeParams', 'leafletData', '$filter', '$location',
    function ($scope, $http, $routeParams, leafletData, $filter, $location) {

        // Set up data objects
        var ctrl = this;
        $scope.naviLink = ' ';
        $scope.naviText = "Gebäudesuche";

        // BUILDING CODE
        // Get the building code from URI
        function init() {
            // Get current building id from uri
            ctrl.buildingCode = $routeParams.id;

            // Find building with id and get relevant info
            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i].code === ctrl.buildingCode) {
                    ctrl.building = buildings[i];
                    ctrl.streetName = buildings[i].displayName;
                    break;
                }
                if(i == buildings.length - 1){
                    //If building can not be found redirect to 404
                   $location.path("/404");
                }
            }

            // Set map
            angular.extend($scope, {
                cityCenter: {
                    lat: ctrl.building.lat,
                    lng: ctrl.building.lng,
                    zoom: 18,
                },
                cityMarkers: {
                    cityCenter: {
                        lat: ctrl.building.lat,
                        lng: ctrl.building.lng,
                        focus: true,
                        popupOptions: {
                            closeButton: false
                        },
                        message: '<p style="text-align: center"><b>' + $filter('capitalize')(ctrl.building.displayName, true) + 
                        '</b></br> <a href="#/building/' + ctrl.buildingCode + '/map">Raumplan anzeigen &#62;</a></p>',
                    }
                }
            });

        };
        init();

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
            cityLayers: {
                url: 'http://api.tiles.mapbox.com/v4/maxmediapictures.o2e7pbh8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF4bWVkaWFwaWN0dXJlcyIsImEiOiJ2NXRBMGlFIn0.K9dbubXdaU77e0PdLGN7iw',
                type: 'xyz',
                layerOptions: {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                }
            },
            events: {
                map: {
                    enable: [],
                    logic: 'emit'
                }
            }
        });
    }
]);