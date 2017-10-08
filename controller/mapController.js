/*global angular, L */
angular.module('LMURaumfinder').controller('mapCtrl', ['$scope',
                                    '$routeParams',
                                    '$location',
                                    '$log',
                                    'leafletData',
                                    'leafletMapEvents',
                                    'buildingManager',
                                    'roomManager',
                                    'buildingPartManager',
                                    '$q',
                                    '$analytics',
    function ($scope,
        $routeParams,
        $location,
        $log,
        leafletData,
        leafletMapEvents,
        buildingManager,
        roomManager,
        buildingPartManager,
        $q,
        $analytics) {

        'use strict';

        // Set up all variables
        var ctrl = this;
        ctrl.building = null;
        ctrl.buildingCode = null;
        ctrl.buildingParts = null;
        ctrl.rooms = null;
        ctrl.filteredRooms = null;

        $scope.naviText = "Gebäudedetails";
        $scope.naviLink = 'building/' + $routeParams.id + '/';
        $scope.roomLimit = 30;

      
        // Map variables
        var map,
            tileLayer,
            bounds,
            marker,
            initLevelControl,
            levelControl,
            initBPartControl,
            BPartControl,
            showImageBtn;


        angular.extend($scope, {
            center: {
                zoom: 3
            },
            defaults: {
                minZoom: 0,
                maxZoom: 3,
                crs: L.CRS.Simple,
                continuousWorld: true
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
            $log.debug('Building code ', ctrl.buildingCode);

            var loadBuildig = buildingManager.getBuilding(ctrl.buildingCode),
                loadRooms = roomManager.getAllRooms(ctrl.buildingCode),
                loadBuildingParts = buildingPartManager.getBuildingPart(ctrl.buildingCode);

            var onechain = loadBuildig.then(function (building) {
                $log.debug(building);
                ctrl.building = building;
            });
            var twochain = loadRooms.then(function (rooms) {
                $log.debug(rooms);
                ctrl.rooms = rooms;
                // Show List with rooms by running filter 
                ctrl.filteredRooms = ctrl.rooms.getRooms(undefined, $scope.roomLimit);
            });
            var threechain = loadBuildingParts.then(function (buildingParts) {
                $log.debug(buildingParts);
                ctrl.buildingParts = buildingParts;
                $log.debug(buildingParts.getStructure(ctrl.buildingCode));
            });

            $q.all([onechain, twochain, threechain]).then(function () {
                $log.debug("ALL PROMISES RESOLVED");
                // Watch search input and update visible marker
                mapViaUrl();
            }, function (err) {
                // Building could not be found 
                $analytics.eventTrack('Roomfinder Error!', {  category: 'ERROR', label: "Can't find building " + ctrl.buildingCode });
                $location.path("/404");
            });

        };
        init();


        // Get set room / level / building part from url and update map 
        function mapViaUrl() {

            // The order of the follwing ifs is from specific to less specific location given in uri
            // If search query contains room -> show it on map
            if ($location.search().room) {
                // $log.debug('Show map via url room', $location.search());
                $scope.mapViaRoom($location.search().room);

            // If search query contains level (aka mapUri) -> show it on map
            } else if ($location.search().level) {
                //$log.debug('Show map via url mapUri', $location.search().level);
                $scope.mapViaLevel($location.search().level);
            
            // If search query contains level (aka mapUri) -> show it on map
            } else if ($location.search().part) {
                //$log.debug('Show map via url part', $location.search().part);
                $scope.mapViaPart($location.search().part);
            
            // Else init with first building part
            } else {
                var thisBuildingPart = ctrl.buildingParts[Object.keys(ctrl.buildingParts)[0]];

                if (thisBuildingPart) {
                    initMap(thisBuildingPart);
                } else {
                    $analytics.eventTrack('Roomfinder Error!', {  category: 'ERROR', label: "Can't find building " + thisBuildingPart});
                    $location.path("/404");
                }
            }
        }


        //--------------------------- Map ----------------------------//
        //------------------------------------------------------------//

        // Set up map
        // Create map object with tile layer, control panels and bounds
        function initMap(buildingPart) {
            $log.debug("Init Map");
          
            if (!buildingPart) {
                // Building could not be found 

                $location.path("/404");
            }

            leafletData.getMap().then(function (map) {
                // If tile layer, level control panel or building part control level exist -> remove so they can be updated and loaded again
                if (tileLayer) { map.removeLayer(tileLayer); }
                if (levelControl) { map.removeControl(levelControl); }
                if (BPartControl) { map.removeControl(BPartControl); }

                // Set up tile layer
                tileLayer = L.tileLayer.lmuMaps('https://cms-static.uni-muenchen.de/lmu-roomfinder-4b38a548/tiles/v3/' + buildingPart.mapUri.split(".")[0] + '/', {
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
                    $log.debug('This Building has multiple building parts');
                    BPartControl = new initBPartControl(buildingPart.buildingPart, BPartStructure);
                    map.addControl(BPartControl);
                }
            });
        }



        // --------- Front end functions --------- //

        // Function for front end to select a room
        $scope.mapViaRoom = function (roomId) {

            try {
                var floorCode = ctrl.rooms.getRoom(roomId).floorCode;
                initMap(ctrl.buildingParts[floorCode]);
                updateMarker(ctrl.rooms.getRoom(roomId).pX, ctrl.rooms.getRoom(roomId).pY);
                // Track user interaction
                $analytics.pageTrack('/building/' + ctrl.buildingCode + '/map?room=' + roomId);
            } catch (err) {
                $analytics.eventTrack('Roomfinder Error!', {  category: 'ERROR', label: "Can't find room " + roomId + " in building " + ctrl.buildingCode });
                $location.path("/404");
            }
        };

        // Function for front end to select a level
        $scope.mapViaLevel = function (floorCode) {
            removeMarker(); // Remove old marker as it belongs to another map 
            var buildingPart = ctrl.buildingParts[floorCode];
            
            if (buildingPart) {
                initMap(buildingPart);
                // Track user interaction
                $analytics.pageTrack('/building/' + ctrl.buildingCode + '/map?level=' + floorCode);
            } else {
                $analytics.eventTrack('Roomfinder Error!', {  category: 'ERROR', label: "Can't find level " + floorCode + " of building " + ctrl.buildingCode });
                $location.path("/404");
            }
        };

        // Function for front end to select a building part
        $scope.mapViaPart = function (part) {
            removeMarker(); // Remove old marker as it belongs to another map 
            try {
                var floor = ctrl.buildingParts.getGroundFloor(part);
                initMap(floor);
                // Track user interaction
                $analytics.pageTrack('/building/' + ctrl.buildingCode + '/map?part=' + part);
            } catch (err) {
                $analytics.eventTrack('Roomfinder Error!', {  category: 'ERROR', label: "Can't find building part " + part + " of building " + ctrl.buildingCode });
                $location.path("/404");
            }
        };

        // Function for extending list of rooms
        $scope.showMoreRooms = function () {
            $scope.roomLimit += 50;
            ctrl.filteredRooms = ctrl.rooms.getRooms(undefined, $scope.roomLimit);
        };


        // Set up watcher for rooms
        $scope.$watch('searchRoom', function (value) {
            if (ctrl.filteredRooms) {ctrl.filteredRooms = ctrl.rooms.getRooms(value, $scope.roomLimit); }
        });



        // --------- Helper functions --------- //

        // Update the position of a marker
        function updateMarker(x, y) {
            leafletData.getMap().then(function (map) {
                var mapPoint = null;
                if (!marker) {
                    mapPoint = map.unproject([0, 0], 3);
                    marker = L.marker(mapPoint);
                    map.addLayer(marker);
                }

                mapPoint = map.unproject([x, y], 3);
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
            var southWest = map.unproject([0, buildingPart.mapSizeY], 3),
                northEast = map.unproject([buildingPart.mapSizeX, 0], 3);
            bounds = new L.LatLngBounds(southWest, northEast);
            map.setMaxBounds(bounds);
            return bounds;

        }


        // --------- Definiton of control panels --------- //

        initLevelControl = L.Control.extend({
            options: {
                position: 'topright',
                activeLevelCode: '',
                activeBPartStructure: ''
            },
            initialize: function (activeFloorCode, activeBPartStructure) {
                this.options.activeLevelCode = activeFloorCode;
                this.options.activeBPartStructure = activeBPartStructure;
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div',
                    'leaflet-bar leaflet-control leaflet-control-custom'),
                    levels = this.options.activeBPartStructure.levels;


                for (var l in levels) {
                    var a = L.DomUtil.create('a', '');
                    var fCode = levels[l].fCode;

                    if (this.options.activeLevelCode == levels[l].fCode) {
                        a.setAttribute('class', 'active');
                    }

                    a.setAttribute('fCode', levels[l].fCode);
                    a.setAttribute('href', '#/building/' + ctrl.buildingCode + '/map?level=' + levels[l].fCode);

                    a.innerHTML = levels[l].level;

                    a.onclick = function (e) {
                        $scope.mapViaLevel(e.target.attributes.fCode.nodeValue);
                    };
                    container.appendChild(a);
                }


                return container;
            }
        });

        initBPartControl = L.Control.extend({
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
                $log.debug(this.options.structure);

                for (var part in this.options.structure) {
                    var thisPart = this.options.structure[part];
                    var a = L.DomUtil.create('a', '');

                    if (this.options.activePart == part) {
                        a.setAttribute('class', 'active');
                    }

                    a.setAttribute('buildingPart', part);
                    a.setAttribute('href', '#/building/' + ctrl.buildingCode + '/map?part=' + part);
                    a.innerHTML = thisPart.name;


                    a.onclick = function (e) {
                        $scope.mapViaPart(e.target.attributes.buildingPart.nodeValue);
                    };
                    container.appendChild(a);
                }


                return container;
            }
        }); 
    }]);