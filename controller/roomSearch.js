'use strict';

angular.module('myApp').controller('roomSearchCtrl', ['$scope',
                                    '$routeParams',
                                    'dataService',
                                    '$filter',

    function ($scope,
        $routeParams,
        dataService,
        $filter) {

        $scope.searchRoom = "";
        $scope.naviText = "LMU Roomfinder";
        $scope.naviLink = '';

        // Set up all variables
        var ctrl = this;
        ctrl.buildingCode;
        ctrl.streetName;
        ctrl.rooms;

        // BUILDING CODE
        // Get the building code from URI
        ctrl.buildingCode = $routeParams.id.split("bw")[1];
        $scope.naviLink = "building/bw" + ctrl.buildingCode + '/map';

        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i].code === "bw" + ctrl.buildingCode) {
                $scope.naviText = $filter('capitalize')(buildings[i].displayName, true);
                break;
            }
        }


        // ROOMS
        // Get all rooms
        dataService.getRooms(ctrl.buildingCode).then(
            function (answer) { // OnSuccess function
                ctrl.rooms = answer;
            },
            function (reason) { // OnFailure function
                console.error("Could not load rooms: ", reason);
            }
        );

}]).controller('impressumCtrl', ['$scope', function ($scope) {

        $scope.naviText = "LMU Roomfinder";
        $scope.naviLink = true;
}]);;