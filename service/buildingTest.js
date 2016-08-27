angular.module('myApp')
    .factory('buildingTest', ['$http', '$q', function ($http, $q) {
        var buildingTest = {
            
            _poolArray: [], //If all objects are needed (array form is better for angular.js)
            
            _loadAll: function (deferred) {
                var scope = this;
                                
                $http.get('json/buildingsNeu2.json')
                    .success(function (buildingsArray) {
                        var buildings = [];
                    console.log(buildingsArray);

                        scope._poolArray = buildingsArray;

                        deferred.resolve(buildingsArray);
                    })
                    .error(function () {
                        deferred.reject();
                    });

            },

            
            
             /* Use this function in order to get instances of all the books */
            getAllBuildings: function () {
                var deferred = $q.defer();

                if (this._poolArray.length >0) {
                    console.log(this._poolArray);
                    deferred.resolve(this._poolArray);
                    
                } else {
                    this._loadAll(deferred);
                }
                return deferred.promise;
            }, 
            
            /* Use this function in order to get instances of all the books */
            getAllBuildings2: function () {
                var deferred = $q.defer();
                if(buildings){
                    deferred.resolve(buildings)
                }
              
                if (this._poolArray.length >0) {
                    console.log(this._poolArray);
                    deferred.resolve(this._poolArray);
                    
                } else {
                    this._loadAll(deferred);
                }
                return deferred.promise;
            },

            
        };
        return buildingTest;
}]);