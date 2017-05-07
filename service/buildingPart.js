/*global angular, rename */
angular.module('LMURaumfinder')
    .factory('BuildingPart', ['$http', '$filter', function ($http, $filter) {
        'use strict';
        
        function BuildingPart(buildingPartData) {
            if (buildingPartData) {
                this.setData(buildingPartData);

                // Object to return with building structure
                var structure = {},
                    thisFloor = {};
              
                // For all floors provided in json
                for (var floor in buildingPartData) {
          
                    //Correct the floor name
                    buildingPartData[floor].level = renameFloorNames(buildingPartData[floor].level);

                    thisFloor = buildingPartData[floor];
                    thisFloor.fCode = floor; //So we have the floor code in the object

                    // Check if building part already exists in structure object
                    // If not create it and add name and sorted array of levels
                    if (!structure[thisFloor.buildingPart]) {
                        structure[thisFloor.buildingPart] = {};
                        structure[thisFloor.buildingPart].levels = [];
                        structure[thisFloor.buildingPart].name = $filter('stringInBrackets')(thisFloor.address) || 'Y';
                    }

                    // Add this floor to level
                    structure[thisFloor.buildingPart].levels.push(thisFloor);
                }

                // Sort levels (descending: OG1, EG, UG)
                for (var part in structure) {
                    structure[part].levels.sort(sortLevels);
                }


                this.setData({
                    "structure": structure
                });

            }
        }
 
        // Level sorting function
        function sortLevels(a, b) {
            var levels = ["OG8", "OG7", "OG6", "OG5", "OG4", "ZG3", "OG3", "ZG2", "OG2", "ZG1", "OG1", "ZG", "EG", "UG1", "UG2", "UG3"];
            var aPos = levels.indexOf(a.level);
            var bPos = levels.indexOf(b.level);

            if (aPos == bPos)
                return 0;
            if (aPos < bPos)
                return -1;

            return 1;
        }

        function renameFloorNames(level) {
            var temp = level;
            //Remove everything in brackets
            level = $filter('removeStringInBrackets')(level);
            //If entry in rename.json exists, use it
            level = (rename[level] ? rename[level] : level);
            return level;

        }


        BuildingPart.prototype = {
            setData: function (buildingPartData) {
                angular.extend(this, buildingPartData);
            },

            // Find out if builiding has complex structure (= multiple building parts)
            isComplex: function () {
                if (Object.keys(this.structure).length > 1) return true;

                return false;
            },

            getStructure: function () {
                return this.structure;
            },

            getFirstPart: function () {
                return this[Object.keys(this)[0]];
            },

            getGroundFloor: function (buildingPartCode) {
                var thisPart = this.structure[buildingPartCode];
                for (var floor in thisPart.levels) {
                    if (thisPart.levels[floor].level == 'EG') {
                        return thisPart.levels[floor];
                    }
                }
                return thisPart.levels[0];
            },

            getPart: function (code) {
                return this[code];
            }

        };
        return BuildingPart;
}]);