'use strict';

angular.module('myApp').controller('mapCtrl', ['$scope',
                                    '$routeParams',
                                    '$location',
                                    'leafletData',
                                    'leafletMapEvents',
                                    'dataService',
                                    'logicService',
    function ($scope,
        $routeParams,
        $location,
        leafletData,
        leafletMapEvents,
        dataService,
        logicService) {

        $scope.searchRoom = "";
        $scope.naviText = "";
        $scope.naviLink = true;

        // Set up all variables
        var ctrl = this;
        ctrl.buildingCode;
        ctrl.streetName;
        ctrl.rooms;
        ctrl.uniqueBuildParts;
        ctrl.buildingStructure;

        // Map 
        var map;
        var tileLayer;
        var bounds;
        var marker;
        var initLevelControl;
        var levelControl;
        var initBPartControl;
        var BPartControl;
        var isComplexBuilding;


        angular.extend($scope, {
            center: {
                zoom: 3,
            },
            defaults: {
                minZoom: 0,
                maxZoom: 3,
                crs: L.CRS.Simple,
                continuousWorld: true,
            },
            layers: {},
            events: {
                map: {
                    enable: [],
                    logic: 'emit'
                }
            }
        });

        //--------------------------- Data ---------------------------//
        //------------------------------------------------------------//

        // BUILDING CODE
        // Get the building code from URI
        ctrl.buildingCode = $routeParams.id.split("bw")[1];
        $scope.naviLink = "building/bw" + ctrl.buildingCode;

        console.log("Building code: " + ctrl.buildingCode);

        // ROOMS
        // Get all rooms
        dataService.getRooms(ctrl.buildingCode).then(
            function (answer) { // OnSuccess function
                ctrl.rooms = answer;
                //console.log("Next: rooms");
                //console.log(ctrl.rooms);
                // Set map via url params
                mapViaUrl();
            },
            function (reason) { // OnFailure function
                 $location.path("/404");
                console.error("Could not load rooms: ", reason);
            }
        );

        // Unique Building Parts
        // Get all unique building parts, extract street name and then init map
        dataService.getBuildingParts(ctrl.buildingCode).then(
            // OnSuccess function
            function (answer) {
                // Get all building parts
                ctrl.uniqueBuildParts = answer;
                //console.log("Next: uniqueBuildParts");
                //console.log(ctrl.uniqueBuildParts);

                // Extract street name 
                ctrl.streetName = answer[Object.keys(answer)[0]].address;
                $scope.naviText = answer[Object.keys(answer)[0]].address;

                // Transform building part list into building structure
                ctrl.buildingStructure = logicService.composeBuildPartList(answer);
                //console.log("Next: buildingStructure");
                //console.log(ctrl.buildingStructure);

                // Find out if building is complex
                if (Object.keys(ctrl.buildingStructure)[0] != 0) {
                    isComplexBuilding = true;
                }

                //Initialize Map
                initMap(ctrl.uniqueBuildParts[Object.keys(ctrl.uniqueBuildParts)[0]]);

                // Set map via url params
                mapViaUrl();
            },
            // OnFailure function
            function (reason) {
                 $location.path("/404");
                console.error("Could not load rooms: ", reason);
            }
        );


        // Get set room / level / building part from url and update map 
        function mapViaUrl() {
            //Check if everything is loaded
            // console.log(ctrl.buildingStructure, ctrl.rooms)
            if (ctrl.buildingStructure !== undefined && ctrl.rooms !== undefined) {
                // The order of the follwing ifs is from specific to less specific location
                // If search query contains room -> show it on map
                if ($location.search().room) {
                    // console.log('Show map via url room', $location.search());
                    $scope.mapViaRoom($location.search().room);

                }

                // If search query contains level (aka mapUri) -> show it on map
                else if ($location.search().level) {
                    //console.log('Show map via url mapUri', $location.search().level);
                    $scope.mapViaLevel($location.search().level);
                }

                // If search query contains level (aka mapUri) -> show it on map
                else if ($location.search().part) {
                    //console.log('Show map via url part', $location.search().part);
                    $scope.mapViaPart($location.search().part);
                }
            }
        };


        //--------------------------- Map ----------------------------//
        //------------------------------------------------------------//

        // Set up map
        // Create map object with tile layer, control panels and bounds
        function initMap(buildingPart) {

            leafletData.getMap().then(function (map) {
                // If tile layer, level control panel or building part control level exist -> remove so they can be updated and loaded again
                if (tileLayer) map.removeLayer(tileLayer);
                if (levelControl) map.removeControl(levelControl);
                if (BPartControl) map.removeControl(BPartControl);

                // Set up tile layer
                tileLayer = L.tileLayer.lmuMaps('https://cms-static.uni-muenchen.de/lmu-roomfinder-4b38a548/tiles/v1/' + buildingPart.mapUri + '/', {
                    width: buildingPart.mapSizeX,
                    height: buildingPart.mapSizeY,
                    attribution: '© LMU München'
                });
                tileLayer.addTo(map);

                //Set bounds
                calcBounds(map, buildingPart);

                // Create and add level control
                levelControl = new initLevelControl(buildingPart.mapUri, buildingPart.level, buildingPart.realPart);
                map.addControl(levelControl);

                //Check if complex building -> create Building Control
                if (isComplexBuilding) {
                    BPartControl = new initBPartControl(buildingPart.realPart);
                    map.addControl(BPartControl);
                }
            });
        }



        // --------- Front end functions --------- //

        // Function for front end to select a room
        $scope.mapViaRoom = function (roomId) {
            var mapURI = ctrl.rooms[roomId].mapUri.split(".")[0];
            initMap(ctrl.uniqueBuildParts[mapURI]);
            updateMarker(ctrl.rooms[roomId].pX, ctrl.rooms[roomId].pY);
        }

        // Function for front end to select a level
        $scope.mapViaLevel = function (mapURI) {
            removeMarker(); // Remove old marker as it belongs to another map 
            initMap(ctrl.uniqueBuildParts[mapURI]);
        }

        // Function for front end to select a building part
        $scope.mapViaPart = function (part) {
            removeMarker(); // Remove old marker as it belongs to another map 
            var mapUri = ctrl.buildingStructure[part][Object.keys(ctrl.buildingStructure[part])[0]];
            initMap(ctrl.uniqueBuildParts[mapUri]);
        }


        // --------- Helper functions --------- //

        // Update the position of a marker
        function updateMarker(x, y) {
            leafletData.getMap().then(function (map) {
                if (!marker) {
                    var mapPoint = map.unproject([0, 0], 3);
                    marker = L.marker(mapPoint);
                    map.addLayer(marker);
                }

                var mapPoint = map.unproject([x, y], 3);
                marker.setLatLng(mapPoint);
                map.panTo(mapPoint);
            });
        }

        function removeMarker() {
            leafletData.getMap().then(function (map) {
                if (marker) {
                    map.removeLayer(marker);
                    marker = null;
                }
            });
        }

        function calcBounds(map, buildingPart) {

            //Setup bounds for map image
            var southWest = map.unproject([0, buildingPart.mapSizeY], 3);
            var northEast = map.unproject([buildingPart.mapSizeX, 0], 3);
            bounds = new L.LatLngBounds(southWest, northEast);
            map.setMaxBounds(bounds);
            return bounds;

        }

        // --------- Definiton of control panels --------- //

        var initLevelControl = L.Control.extend({
            options: {
                position: 'topright',
                mapURI: '',
                activeLevel: '',
                buildingPart: ''
            },
            initialize: function (mapUri, activeLevel, buildingPart) {
                // options.mapUri
                this.options.activeLevel = activeLevel;
                this.options.buildingPart = buildingPart;
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                var buildingPart = ctrl.buildingStructure[this.options.buildingPart];
                var buildingPartArray = Object.keys(buildingPart);
                buildingPartArray.sort(function (a, b) {
                    var levels = ["OG 06", "OG 05", "OG 04", "OG 03", "OG 02 Z", "OG 02", "OG 01 Z", "OG 01", "EG Z", "EG", "UG 01", "UG 02"];
                    var aPos = levels.indexOf(a);
                    var bPos = levels.indexOf(b);

                    if (aPos == bPos)
                        return 0;
                    if (aPos < bPos)
                        return -1;

                    return 1;
                });

                for (var level in buildingPartArray) {
                    var a = L.DomUtil.create('a', '');
                    var mapUri = buildingPart[buildingPartArray[level]];

                    if (this.options.activeLevel == buildingPartArray[level]) {
                        a.setAttribute('class', 'active');
                    }

                    a.setAttribute('mapUri', mapUri);
                    a.setAttribute('href', '#/building/bw' + ctrl.buildingCode + '/map?level=' + mapUri)
                    a.innerHTML = (rename[buildingPartArray[level]] ? rename[buildingPartArray[level]] : buildingPartArray[level]);


                    a.onclick = function (e) {
                        $scope.mapViaLevel(e.target.attributes['mapUri'].nodeValue);
                    };
                    container.appendChild(a);
                }


                return container;
            }
        });

        var initBPartControl = L.Control.extend({
            options: {
                position: 'bottomleft',
                activePart: ''
            },
            initialize: function (activePart) {
                // options.mapUri
                this.options.activePart = activePart;
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

                for (var part in ctrl.buildingStructure) {
                    var a = L.DomUtil.create('a', '');

                    if (this.options.activePart == part) {
                        a.setAttribute('class', 'active');
                    }

                    a.setAttribute('buildingPart', part);
                    a.setAttribute('href', '#/building/bw' + ctrl.buildingCode + '/map?part=' + part)
                    a.innerHTML = part;


                    a.onclick = function (e) {
                        $scope.mapViaPart(e.target.attributes['buildingPart'].nodeValue);
                    };
                    container.appendChild(a);
                }


                return container;
            }
        });


}]);