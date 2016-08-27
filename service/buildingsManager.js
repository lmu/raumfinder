angular.module('myApp')
    .factory('buildingsManager', ['$http', '$q', 'Building', function ($http, $q, Building) {
        var buildingsManager = {

            /* Private Methods */
            _pool: {}, // If a specific object is needed
            _poolArray: [], //If all objects are needed (array form is better for angular.js)
            _retrieveInstance: function (buildingId, buildingData) {
                var instance = this._pool[buildingId];

                if (instance) {
                    instance.setData(buildingData);
                } else {
                    instance = new Building(buildingData);
                    this._pool[buildingId] = instance;
                    this._poolArray.push(instance);
                }

                return instance;
            },
            _search: function (buildingId) {
                return this._pool[buildingId];
            },

            _getAll: function () {
                if (this._poolArray.length > 0) {
                    return this._poolArray;
                }
                return false;
            },

            _load: function (deferred, id) {
                var scope = this;

                $http.get('json/buildingsNeu.json')
                    .success(function (buildingsArray) {   

                        buildingsArray.forEach(function (buildingData) {
                            var building = scope._retrieveInstance(buildingData.code, buildingData);
                        });

                        deferred.resolve(scope._pool[id]);
                    })
                    .error(function () {
                        deferred.reject();
                    });

            },


            _loadAll: function (deferred) {
                var scope = this;
                
                var buildings = [];

                $http.get('json/buildingsNeu2.json')
                    .success(function (buildingsArray) {
                        var buildings = [];

                        buildingsArray.forEach(function (buildingData) {
                            var building = scope._retrieveInstance(buildingData.code, buildingData);
                            buildings.push(building);
                        });

                        deferred.resolve(buildings);
                    })
                    .error(function () {
                        deferred.reject();
                    });

            },


            /* Public Methods */
            /* Use this function in order to get a building instance by it's id */
            getBuilding: function (buildingId) {
                var deferred = $q.defer();
                var building = this._search(buildingId);
                if (building) {
                    deferred.resolve(building);
                } else {
                    this._load(deferred, buildingId);
                }
                return deferred.promise;
            },

            /* Use this function in order to get instances of all the books */
            getAllBuildings: function () {
                var deferred = $q.defer();
                var buildings = this._getAll();

                if (buildings) {
                    deferred.resolve(buildings);
                } else {
                    this._loadAll(deferred);
                }
                return deferred.promise;
            },

        };
        return buildingsManager;
}]);