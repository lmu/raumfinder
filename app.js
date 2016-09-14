'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'leaflet-directive',
    'filter',
    'pascalprecht.translate'
    ])
    .config(['$routeProvider', function ($routeProvider) {
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
    .config(function ($logProvider) {
        $logProvider.debugEnabled(false);
    })
    .constant("MAP_DEFAULTS", {
        "MAPTILES_URL": "http://api.tiles.mapbox.com/v4/maxmediapictures.o2e7pbh8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF4bWVkaWFwaWN0dXJlcyIsImEiOiJ2NXRBMGlFIn0.K9dbubXdaU77e0PdLGN7iw",
        "MAP_CREDITS": "© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"


        // Alternative Karten Quelle. 
        // Quelle und Infos: https://carto.com/location-data-services/basemaps/ (Kostenlos bis 75.000 Abrufe/Monat)
    
        // 
        // "MAPTILES_URL": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        // "MAP_CREDITS": "<a href='https://www.mapzen.com/rights'>Attribution.</a>. Data &copy;<a href='https://openstreetmap.org/copyright'>OSM</a> contributors."
    })
    .directive('topNavi', ['$translate', function ($translate) {
        return {
            restrict: 'AE',
            replace: 'true',
            controller:'AdvertisementController',
            templateUrl: 'partials/mobileTopMenu.html'
        };
    }]);