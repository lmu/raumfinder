'use strict';
angular.module('myApp').controller('mapCtrl2', ['$scope',
                                    '$routeParams',
                                    '$location',
                                    '$log',
                                    'leafletData',
                                    'leafletMapEvents',
                                    'buildingTestDirect',
                                    'roomManager',
                                    'buildingPartManager',
                                                '$q',
    function ($scope,
        $routeParams,
        $location,
        $log,
        leafletData,
        leafletMapEvents,
        buildingTestDirect,
        roomManager,
        buildingPartManager,
        $q) {


        // Set up all variables
        var ctrl = this;
        ctrl.building;
        ctrl.buildingCode;
        ctrl.buildingParts;
        ctrl.rooms;
        ctrl.filteredRooms;

        $scope.naviText = "Gebäudesuche";
        $scope.naviLink = true;
        $scope.roomLimit = 30;

        //        
        var map,
            tileLayer,
            bounds,
            marker,
            initLevelControl,
            levelControl,
            initBPartControl,
            BPartControl;


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


        var init = function () {
            ctrl.buildingCode = $routeParams.id;
            console.log('Building code ', ctrl.buildingCode);

            var loadBuildig = buildingTestDirect.getBuilding(ctrl.buildingCode);
            var loadRooms = roomManager.getAllRooms(ctrl.buildingCode);
            var loadBuildingParts = buildingPartManager.getBuildingPart(ctrl.buildingCode);

            var onechain = loadBuildig.then(function (building) {
                console.log(building);
                ctrl.building = building;
            });
            var twochain = loadRooms.then(function (rooms) {
                console.log(rooms);
                ctrl.rooms = rooms;
                // Show List with rooms by running filter 
                ctrl.filteredRooms = ctrl.rooms.getRooms(undefined, $scope.roomLimit);
            });
            var threechain = loadBuildingParts.then(function (buildingParts) {
                console.log(buildingParts);
                ctrl.buildingParts = buildingParts;
                console.log(buildingParts.getStructure(ctrl.buildingCode));
            });

            $q.all([onechain, twochain, threechain]).then(function () {
                console.log("ALL PROMISES RESOLVED");
                // Watch search input and update visible marker
                mapViaUrl();
            });

        };
        init();


        // Get set room / level / building part from url and update map 
        function mapViaUrl() {

            // The order of the follwing ifs is from specific to less specific location given in uri
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

            // Else init with first building part
            else {
                initMap(ctrl.buildingParts[Object.keys(ctrl.buildingParts)[0]]);
            }
        };



        //--------------------------- Map ----------------------------//
        //------------------------------------------------------------//

        // Set up map
        // Create map object with tile layer, control panels and bounds
        function initMap(buildingPart) {
            $log.log("Init Map");

            leafletData.getMap().then(function (map) {
                // If tile layer, level control panel or building part control level exist -> remove so they can be updated and loaded again
                if (tileLayer) map.removeLayer(tileLayer);
                if (levelControl) map.removeControl(levelControl);
                if (BPartControl) map.removeControl(BPartControl);

                // Set up tile layer
                tileLayer = L.tileLayer.lmuMaps('https://cms-static.uni-muenchen.de/lmu-roomfinder-4b38a548/tiles/v2/' + buildingPart.mapUri.split(".")[0] + '/', {
                    width: buildingPart.mapSizeX,
                    height: buildingPart.mapSizeY,
                    attribution: '© LMU München'
                });
                tileLayer.addTo(map);

                //Set bounds
                calcBounds(map, buildingPart);

                // Create and add level control
                var BPartStructure = ctrl.buildingParts.getStructure();

                levelControl = new initLevelControl(buildingPart.fCode, BPartStructure[buildingPart.buildingPart]);

                map.addControl(levelControl);

                //Check if complex building -> create Building Control
                if (ctrl.buildingParts.isComplex()) {
                    $log.log('This Building has multiple building parts')
                    BPartControl = new initBPartControl(buildingPart.realPart, BPartStructure);
                    map.addControl(BPartControl);
                }
            });
        }



        // --------- Front end functions --------- //

        // Function for front end to select a room
        $scope.mapViaRoom = function (roomId) {
            // var mapURI = ctrl.rooms[roomId].mapUri.split(".")[0];
            console.log(roomId);
            var floorCode = ctrl.rooms.getRoom(roomId).floorCode;
            initMap(ctrl.buildingParts[floorCode]);
            updateMarker(ctrl.rooms.getRoom(roomId).pX, ctrl.rooms.getRoom(roomId).pY);
        }

        // Function for front end to select a level
        $scope.mapViaLevel = function (floorCode) {
            removeMarker(); // Remove old marker as it belongs to another map 
            initMap(ctrl.buildingParts[floorCode]);
        }

        // Function for front end to select a building part
        $scope.mapViaPart = function (part) {
            removeMarker(); // Remove old marker as it belongs to another map 
            var floor = ctrl.buildingParts.getGroundFloor(part);
            console.log(floor);
            initMap(floor);
        }

        // Function for extending list of rooms
        $scope.showMoreRooms = function () {
            $scope.roomLimit += 50;
            ctrl.filteredRooms = ctrl.rooms.getRooms(undefined, $scope.roomLimit);
        }


        // Set up watcher for rooms
        $scope.$watch('searchRoom', function (value) {
            if(ctrl.filteredRooms) ctrl.filteredRooms = ctrl.rooms.getRooms(value, $scope.roomLimit);
        });



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
                activeLevelCode: '',
                activeBPartStructure: '',
            },
            initialize: function (activeFloorCode, activeBPartStructure) {
                this.options.activeLevelCode = activeFloorCode;
                this.options.activeBPartStructure = activeBPartStructure;
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div',
                    'leaflet-bar leaflet-control leaflet-control-custom');
                var levels = this.options.activeBPartStructure.levels;


                for (var l in levels) {
                    var a = L.DomUtil.create('a', '');
                    var fCode = levels[l].fCode;

                    if (this.options.activeLevelCode == levels[l].fCode) {
                        a.setAttribute('class', 'active');
                    }

                    a.setAttribute('fCode', levels[l].fCode);
                    a.setAttribute('href', '#/building/' + ctrl.buildingCode + '/map?level=' + levels[l].fCode)

                    a.innerHTML = levels[l].level;

                    a.onclick = function (e) {
                        $scope.mapViaLevel(e.target.attributes['fCode'].nodeValue);
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
            initialize: function (activePart, buildingStructure) {
                this.options.activePart = activePart;
                this.options.structure = buildingStructure;
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                console.log(this.options.structure);

                for (var part in this.options.structure) {
                    var thisPart = this.options.structure[part];
                    console.log('part');
                    var a = L.DomUtil.create('a', '');

                    if (this.options.activePart == part) {
                        a.setAttribute('class', 'active');
                    }

                    a.setAttribute('buildingPart', part);
                    a.setAttribute('href', '#/building/' + ctrl.buildingCode + '/map?part=' + part)
                    a.innerHTML = thisPart.name;


                    a.onclick = function (e) {
                        $scope.mapViaPart(e.target.attributes['buildingPart'].nodeValue);
                    };
                    container.appendChild(a);
                }


                return container;
            }
        });

    }]);