angular.module('myApp')
    .factory('buildingTestDirect', ['$http', '$q', 'Building', function ($http, $q, Building) {
        var buildingTest = {
            
            _poolArray: [], // If all objects are needed (array form is better for angular.js)
            _pool:{},       // If a specific object is needed
            
            _retrieveInstance: function (buildingId, buildingData) {
                var instance = this._poolArray[buildingId];

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
                // Use associative array '_pool' to find building and return it
                return this._pool[buildingId];
            },
            
            _loadAll: function (deferred) {
                var scope = this;
  
                // Data is directly referenced (-> index.html), no ajax necessary
                // Create objects for all buildings and return array 
                test.forEach(function (buildingData) {
                   scope._retrieveInstance(buildingData.code, buildingData);
                });
                
                deferred.resolve(scope._poolArray);
            },
            
            _load: function (deferred, id) {
                var scope = this;
                
                // Data is directly referenced (-> index.html), no ajax necessary 
                // Buildings can't be accessed individually
                test.forEach(function (buildingData) {
                   scope._retrieveInstance(buildingData.code, buildingData);
                });
                
                // Check if building with given ID exists and return it, else reject promise
                if(scope._pool[id]){
                     deferred.resolve(scope._pool[id]); 
                } else {
                    deferred.reject();
                }

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
             
                if (this._poolArray.length >0) {
                  //  console.log(this._poolArray);
                    deferred.resolve(this._poolArray);  
                } else {
                    this._loadAll(deferred);
                }
                return deferred.promise;
            },

            
        };
        return buildingTest;
}]);