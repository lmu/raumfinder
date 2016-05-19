angular.module('myApp').service('logicService', function () {

        this.sayHello = function () {
            console.log('hello');
        };

        this.checkComplexBuilding = function (buildParts) {

            // Find out if builiding has complex structure (= multiple real building parts with differnt maps)
            // Query for building part list with unique MapURIs -> list of all maps (done on server)
            // -> If list contains duplicate levels -> complex

            // Check if double levels exist
            var listOfLevels = [];
            for (buildPart in buildParts) {

                if (listOfLevels.indexOf(buildParts[buildPart].level) > 0) {
                    // Double Level found -> complex building
                    console.log("This is a complex building! Found double: " + buildParts.level);
                    return true;
                } else {
                    listOfLevels.push(buildParts[buildPart].level)
                }

            }
            return false;
        };

        this.composeBuildPartList = function (buildParts) {

            //Compose return object
            var composedObject = {};
            var thisPart;

            for (part in buildParts) {
                thisPart = buildParts[part];

                //If Building part does not exist -> create it
                if (!(buildParts[part].realPart in composedObject)) {
                    composedObject[thisPart.realPart] = [];
                }

                composedObject[thisPart.realPart][thisPart.level] = thisPart.mapUri;
            }

            return composedObject;
        };

    })
    .directive('topNavi', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'partials/mobileTopMenu.html'
        };
    });