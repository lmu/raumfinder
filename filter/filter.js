angular.module('filter', [])
    .filter('capitalize', function () {
        return function (input, all) {
            var reg = /([^\W_]+[^\s-]*) */g;
            if (input !== undefined) {
                input = input.replace(/ - /g, "-");
            }

            return (!!input) ? input.replace(reg, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    })
    .filter('filterBuildings', function () {
        return function (input, str) {
            var tmp = [];

            if (str == undefined || str == "") {
                return input;
            }

            str = str.toLowerCase();06

            angular.forEach(input, function (val, key) {
                var street = val.displayName.toLowerCase();
                var city = val.city.toLowerCase();

                if (street.indexOf(str) !== -1 || city.indexOf(str) !== -1) {
                    tmp.push(val)
                }
            });

            return tmp;
        };
    })
    .filter('findInObjects', function () {
        return function (input, str) {
            var tmp = {};

            angular.forEach(input, function (val, key) {

                //console.log(val + " " + key);
                if (val.rName.indexOf(str) !== -1) {
                    tmp[key] = val;
                }
            });
            return tmp;
        };
    })
    //get text in brackets 
    .filter('stringInBrackets', function () {
        return function (input, all) {

            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(input);

            if (matches === null || matches.length < 1) {
                return 0;
            }

            return matches[1];
        }
    })
    //remove text in brackets
    .filter('removeStringInBrackets', function () {
        return function (input) {
            return input.replace(/ *\([^)]*\) */g, "");
        }


    });