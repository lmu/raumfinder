'use strict';

// Declare app level module which depends on views, and components
angular.module('LMURaumfinder', [
    'ngRoute',
    'leaflet-directive',
    'filter',
    'angulartics',
    'angulartics.piwik',
    ])
    .config(['$logProvider','$routeProvider', function ($logProvider, $routeProvider) {
        $logProvider.debugEnabled(false);
        $routeProvider
            .when('/kontakt', {
                controller: 'impressumCtrl',
                templateUrl: 'partials/kontakt.html'
            })
            .when('/building/:id', {
                controller: 'buildingCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'partials/buildingDetail.html',
                reloadOnSearch: false
            })
            .when('/building/:id/map', {
                controller: 'mapCtrl',
                controllerAs: 'ctrl',
                reloadOnSearch: false,
                templateUrl: 'partials/buildingMap.html',
            })
            .when('/building/:id/map/search', {
                controller: 'roomSearchCtrl',
                controllerAs: 'ctrl',
                reloadOnSearch: false,
                templateUrl: 'partials/roomSearch.html',
            })
            // Weiterleitung für LSF
            .when('/part/:id/:map*', {
                redirectTo: function (params, path, search) {
                    var url = '' + window.location.href.split('#')[1];
                    url = url.replace("part", "building");
                    url = url.replace(params.id, buildingsLookup[params.id]);

                    if (url) return url;
                    else return "/404";
                }
            })
            .when('/', {
                controller: 'MainCtrl',
                controllerAs: 'main',
                templateUrl: 'partials/cityMap.html'
            })
            .when('/404', {
                controller: 'MainCtrl',
                controllerAs: 'main',
                templateUrl: 'partials/404.html'
            })
            .otherwise({
                redirectTo: '/'
            });

    }])
    .constant("MAP_DEFAULTS", {
        "MAPTILES_URL": "http://api.tiles.mapbox.com/v4/maxmediapictures.o2e7pbh8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF4bWVkaWFwaWN0dXJlcyIsImEiOiJ2NXRBMGlFIn0.K9dbubXdaU77e0PdLGN7iw",
        "MAP_CREDITS": "© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"


        // Alternative Karten Quelle. 
        // Quelle und Infos: https://carto.com/location-data-services/basemaps/ (Kostenlos bis 75.000 Abrufe/Monat)

        // 
        // "MAPTILES_URL": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        // "MAP_CREDITS": "<a href='https://www.mapzen.com/rights'>Attribution.</a>. Data &copy;<a href='https://openstreetmap.org/copyright'>OSM</a> contributors."
    })
    .directive('topNavi', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            controller: 'AdvertisementController',
            templateUrl: 'partials/mobileTopMenu.html'
        };
    });