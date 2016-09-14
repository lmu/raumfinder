'use strict';

angular.module('myApp').controller('roomSearchCtrl', ['$scope',
                                    '$routeParams',
                                    'buildingManager',
                                    '$filter',
                                    'roomManager',


    function ($scope,
        $routeParams,
        buildingManager,
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


            var loadBuildig = buildingManager.getBuilding(ctrl.buildingCode);
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
}]).controller('AdvertisementController', ['$scope', function ($scope) {


    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;

    var adDismissed = getCookie("adDismissed");

    if (isAndroid && !adDismissed) {
        $scope.showAd = true;
    } else {
        $scope.showAd = false;
    }

    // Function to remove ad
    $scope.dismiss = function () {
        $scope.showAd = false;
        setCookie("adDismissed", true, 365);
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

}]);