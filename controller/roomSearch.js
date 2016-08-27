'use strict';

angular.module('myApp').controller('roomSearchCtrl', ['$scope',
                                    '$routeParams',
                                    'buildingTestDirect',
                                    '$filter',
                                    'roomManager',
                                                      

    function ($scope,
        $routeParams,
        buildingTestDirect,
        $filter,
        roomManager) {

        $scope.searchRoom = "";
        $scope.naviText = "LMU Roomfinder";
        $scope.naviLink = '';
        $scope.roomLimit = 30;

        // Set up all variables
        var ctrl = this;
        ctrl.building;
        ctrl.buildingCode;
        ctrl.rooms;
        ctrl.filteredRooms;


        var init = function () {
            ctrl.buildingCode = $routeParams.id;
            $scope.naviLink = "building/" + ctrl.buildingCode + '/map';
            

            var loadBuildig = buildingTestDirect.getBuilding(ctrl.buildingCode);
            var loadRooms = roomManager.getAllRooms(ctrl.buildingCode);

            var onechain = loadBuildig.then(function (building) {
                ctrl.building = building;
                $scope.naviText = building.displayName;
            });
            var twochain = loadRooms.then(function (rooms) {
                ctrl.rooms = rooms;
                ctrl.filteredRooms = ctrl.rooms.getRooms(undefined, $scope.roomLimit);
            });
        };
        init();

        // Set up watcher for rooms
        $scope.$watch('searchRoom', function (value) {
            if (ctrl.filteredRooms) ctrl.filteredRooms = ctrl.rooms.getRooms(value, $scope.roomLimit);
        });

        // Function for extending list of rooms
        $scope.showMoreRooms = function () {
            $scope.roomLimit += 50;
            ctrl.filteredRooms = ctrl.rooms.getRooms(undefined, $scope.roomLimit);
        }


}]).controller('impressumCtrl', ['$scope', function ($scope) {

    $scope.naviText = "LMU Roomfinder";
    $scope.naviLink = true;
}]);;