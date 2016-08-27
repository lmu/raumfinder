angular.module('myApp')
    .service('dataService', ['$http', '$q', '$filter', 'logicService', function ($http, $q, $filter, logicService) {
        var deferObject;
        var buildings = false;

        var myMethods = {

            getRooms: function (buildingCode) {

                var promise = $http({
                    method: 'GET',
                    responseType: "json",
                    url: 'json/rooms/bw' + buildingCode + '.json'
                });

                var deferObject = deferObject || $q.defer();

                promise.then(

                    // OnSuccess function
                    function (answer) {
                        //console.log("Next: Rooms");
                        //console.log(answer);

                        var temp = {};
                        for (room in answer.data) {
                            temp[answer.data[room].rCode] = answer.data[room];
                        }

                        deferObject.resolve(temp);
                    },

                    // OnFailure function
                    function (reason) {
                        //console.error("Could not load rooms.");
                        deferObject.reject(reason);
                    });

                return deferObject.promise;
            },


            getBuildingParts: function (buildingCode) {

                var promise = $http({
                    method: 'GET',
                    responseType: "json",
                    url: 'json/uniqueBuildingParts/bw' + buildingCode + '.json'
                })

                var deferObject = deferObject || $q.defer();

                promise.then(

                    // OnSuccess function
                    function (answer) {
                        var complex = logicService.checkComplexBuilding(answer.data);
                        console.log("Is it complex? " + complex);


                        var temp = {};
                        for (bPart in answer.data) {
                            //console.log(answer.data[bPart]);

                            //Create object with mapUri as key
                            var mapUri = answer.data[bPart].mapUri.split(".")[0];
                            temp[mapUri] = answer.data[bPart];

                            //Remove ".pdf" from mapUri
                            temp[mapUri]["mapUri"] = mapUri;

                            //Add real building part
                            if (complex) {
                                temp[mapUri]["realPart"] = $filter('stringInBrackets')(answer.data[bPart].address);
                            } else {
                                temp[mapUri]["realPart"] = 0;
                            }
                        };

                        deferObject.resolve(temp);
                    },

                    // OnFailure function
                    function (reason) {
                        //console.error("Could not load building part.");
                        deferObject.reject(reason);
                    });

                return deferObject.promise;


            },


            getCorrectedLevelName: function (level) {
                var temp = level;
                //Remove everything in brackets
                level = $filter('removeStringInBrackets')(level);
                //If entry in rename.json exists, use it
                level = (rename[level] ? rename[level] : level);
                return level;

            },

            getAllBuildings: function () {

                if (buildings) {
                    return buildings;
                }

                var promise = $http({
                    method: 'GET',
                    responseType: "json",
                    url: 'json/buildingsNeu.json'
                });

                var deferObject = deferObject || $q.defer();

                promise.then(

                    function (answer) {

                        var temp = {};
                        for (building in answer.data) {
                            temp[answer.data[building].code] = answer.data[building];
                        }

                        buildings = temp;
                        deferObject.resolve(buildings);
                    },

                    // OnFailure function
                    function (reason) {
                        //console.error("Could not load buildings.");
                        deferObject.reject(reason);
                    });

                return deferObject.promise;

            },


            getBuildingByID: function (id) {

                if (buildings) {
                    return buildings[id];
                } else {
                    getAllBuildings().then(
                        function (answer) {
                            return answer[id];
                        },
                        function (reason) {
                            $location.path("/404");
                            console.error("Could not load buildings: ", reason);
                        }
                    );
                }
            }
        };

        return myMethods;
            }])