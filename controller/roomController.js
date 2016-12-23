angular.module('LMURaumfinder').controller('roomCtrl', ['$scope',
                                    '$routeParams', 'buildingManager',


    function ($scope, $routeParams, buildingManager) {

        $scope.naviText = "Gebäudeplan";
        $scope.naviLink = 'building/' + $routeParams.buildingID + '/map';

        var ctrl = this;
        ctrl.buildingCode = {};


        function init() {
            console.log($routeParams);
            ctrl.buildingCode = $routeParams.buildingID;
            console.log('Building code ', ctrl.buildingCode);

            var loadBuildig = buildingManager.getBuilding(ctrl.buildingCode);
            loadBuildig.then(function (building) {
                console.log(building);
                ctrl.building = building;
            }, function (err) {
                console.log("Building not found")
            });
        }
        init();
}]);