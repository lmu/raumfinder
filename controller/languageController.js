'use strict';
angular.module('myApp').controller('languageCtrl', function ($scope, $translate) {
    $scope.bla = $translate.use();

    $scope.changeLang = function (key) {
        if($translate.use() == 'de_DE'){
            $translate.use('en_US');
        }else{
            $translate.use('de_DE');
        }
    };
});