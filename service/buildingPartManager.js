/*global angular */
angular.module('LMURaumfinder').factory('buildingPartManager', ['$http', '$q', 'BuildingPart', function ($http, $q, BuildingPart) {
    'use strict';
    
    var buildingPartManager = {
        _pool: {},
        _retrieveInstance: function (buildingCode, buildingData) {
    
            var instance = this._pool[buildingCode];

            if (instance) {
                instance.setData(buildingData);
            } else {
                instance = new BuildingPart(buildingData);
                this._pool[buildingCode] = instance;
            }

            return instance;
        },
        _search: function (buildingCode) {
            return this._pool[buildingCode];
        },
        _load: function (buildingCode, deferred) {
            var scope = this;

            $http.get('json/uniqueBuildingParts/' + buildingCode + '.json')
                .success(function (buildingPartData) {
                    var buildingPart = scope._retrieveInstance(buildingCode, buildingPartData);
                    deferred.resolve(buildingPart);
                })
                .error(function () {
                    deferred.reject();
                });
        },
        /* Public Methods */
        /* Use this function in order to get a building part instance by it's id */
        getBuildingPart: function (buildingCode) {
            var deferred = $q.defer(),
                buildingPart = this._search(buildingCode);
            if (buildingPart) {
                deferred.resolve(buildingPart);
            } else {
                this._load(buildingCode, deferred);
            }
            return deferred.promise;
        }
        
    };
    return buildingPartManager;
}]);