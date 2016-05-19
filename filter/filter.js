angular.module('filter', [])
    .filter('capitalize', function () {
        return function (input, all) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            if(input !== undefined){
                input = input.replace(/ - /g, "-");
            }
            
            return (!!input) ? input.replace(reg, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
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
    .filter('stringInBrackets', function () {
        return function (input, all) {

            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(input);

            if (matches === null || matches.length < 1) {
                return 0;
            }

            return matches[1];
        }
    }).filter('roomFilter', function () {
        return function (input, query) {
            if(query === "" || query === " ") return input;
            
            var filtered = {};
            var query_l = query.replace(/ /g,'').toLowerCase();
            var myKey = "";
            
            angular.forEach(input, function (val, key) {
               // myKey = val.rName.replace(/ /g,'').toLowerCase();
                if (val.rName.replace(/ /g,'').toLowerCase().indexOf(query_l) > -1) {
                    filtered[key] = val;
                }
            });
        console.log(filtered);
            return filtered;
        
        };
    });