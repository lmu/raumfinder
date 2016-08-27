'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'leaflet-directive',
    'filter',
    'pascalprecht.translate'
    ]).config(['$routeProvider',
    function ($routeProvider) {
            $routeProvider
                .when('/kontakt', {
                    controller: 'impressumCtrl',
                    templateUrl: 'partials/impressum.html'
                })
                .when('/building/:id', {
                    controller: 'buildingCtrl',
                    controllerAs: 'ctrl',
                    templateUrl: 'partials/buildingDetail.html',
                    reloadOnSearch: false
                })
                .when('/building/:id/map', {
                    controller: 'mapCtrl2',
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
    }
]);