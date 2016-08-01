'use strict';
angular.module('myApp').controller('MainCtrl', function ($scope, $http, $filter) {

    // Setup data objects
    var main = this;
    main.buildings = [];

    // Setup mobile top menu
    $scope.naviLink = '';
    $scope.naviText = "Raumfinder";

    // Inital bounds, gets updated after buildings have been loaded 
    var bounds = {
        southWest: {
            lat: 100,
            lng: 100
        },
        northEast: {
            lat: 0,
            lng: 0
        }
    };
    var maxBounds = {
        southWest: {
            lat: 100,
            lng: 100
        },
        northEast: {
            lat: 0,
            lng: 0
        }
    };



    //Init map
    angular.extend($scope, {
        cityCenter: {
            lat: 48.14,
            lng: 11.58,
            zoom: 13,
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

    main.buildings = buildings;

    //Load all buildings
    $http({
        method: 'GET',
        responseType: "json",
        url: 'json/buildings.json'
    }).then(function successCallback(response) {

        // Create marker on map
        var tempcityMarkers = {};
        for (var i = 0; i < main.buildings.length; i++) {
            tempcityMarkers[main.buildings[i].code] = {
                lat: parseFloat(main.buildings[i].lat),
                lng: parseFloat(main.buildings[i].lng),
                message: '<p style="text-align: center"><b>' + $filter('capitalize')(main.buildings[i].displayName, true) +
                    '</b></br> <a href="#/building/' + main.buildings[i].code + '/map">Raumplan anzeigen &#62;</a></p>',
            }

            //Set maxbound of map
            if (main.buildings[i].lat < maxBounds.southWest.lat) maxBounds.southWest.lat = (main.buildings[i].lat - 0.1);
            if (main.buildings[i].lng > maxBounds.northEast.lng) maxBounds.northEast.lng = (main.buildings[i].lng + 0.1);
            if (main.buildings[i].lat > maxBounds.northEast.lat) maxBounds.northEast.lat = (main.buildings[i].lat + 0.1);
            if (main.buildings[i].lng < maxBounds.southWest.lng) maxBounds.southWest.lng = (main.buildings[i].lng - 0.1);
        }

        //Set maxbounds and markers to scope
        angular.extend($scope, {
            cityMarkers: tempcityMarkers,
            cityMaxBounds: maxBounds
        });
    }, function errorCallback(response) {
        console.error("Buildings could not be loaded.", response);
    });


    // Watch search input and update visible markers
    $scope.$watch('searchBuilding', function (value) {
        addMarkers();
    });


    // Add markers to map
    function addMarkers() {

        //reset bounds
        bounds = {
            southWest: {
                lat: 100,
                lng: 100
            },
            northEast: {
                lat: 0,
                lng: 0
            }
        };

        var tempcityMarkers = {};

        var tempSearch = ($scope.searchBuilding + "").toLowerCase();
        var tempStreet = "";

        for (var i = 0; i < main.buildings.length; i++) {
            tempStreet = main.buildings[i].displayName.toLowerCase();

            if (tempStreet.indexOf(tempSearch) >= 0) {

                tempcityMarkers[main.buildings[i].code] = {
                    lat: main.buildings[i].lat,
                    lng: main.buildings[i].lng,
                    message: '<p style="text-align: center"><b>' + $filter('capitalize')(main.buildings[i].displayName, true) +
                        '</b></br> <a href="#/building/' + main.buildings[i].code + '/map">Raumplan anzeigen &#62;</a></p>',


                }
                if (main.buildings[i].lat < bounds.southWest.lat) bounds.southWest.lat = main.buildings[i].lat;
                if (main.buildings[i].lng > bounds.northEast.lng) bounds.northEast.lng = main.buildings[i].lng;
                if (main.buildings[i].lat > bounds.northEast.lat) bounds.northEast.lat = main.buildings[i].lat;
                if (main.buildings[i].lng < bounds.southWest.lng) bounds.southWest.lng = main.buildings[i].lng;
            }
        }
        $scope.cityBounds = bounds;
        $scope.cityMarkers = tempcityMarkers;


    }
});