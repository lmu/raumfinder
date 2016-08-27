angular.module('myApp')
    .factory('Building', ['$http', '$filter', function ($http, $filter) {
        function Building(buildingData) {
            if (buildingData) {
                buildingData.displayName = $filter('capitalize', true)(buildingData.displayName);
                buildingData.lat = parseFloat(buildingData.lat);
                buildingData.lng = parseFloat(buildingData.lng);
                this.setData(buildingData);
            }
            // Some other initializations related to Building
        };
        Building.prototype = {
            setData: function (buildingData) {
                angular.extend(this, buildingData);
            },
            getImageUrl: function (width) {

                //List-Icon
                if (width <= 40) {
                    if (this.hasImage == 1) {
                        return 'https://cms-static.uni-muenchen.de/lmu-roomfinder-4b38a548/photos/thumbnails/' + this.code + '.jpg';
                    } else {
                        return 'img/houseIcon.png';
                    }
                    //Medium Sized
                } else if (width <= 400) {
                    if (this.hasImage == 1) {
                        return 'https://cms-static.uni-muenchen.de/lmu-roomfinder-4b38a548/photos/medium/' + this.code + '.jpg';
                    } else {
                        return 'img/pattern.jpg';
                    }
                }

            }
        };
        return Building;
}]);

