angular.module('LMURaumfinder').factory('roomManager', ['$http', '$q', 'Room', function ($http, $q, Room) {
    var roomManager = {
        _pool: {},
        _search: function (buildingCode) {
            return this._pool[buildingCode];
        },
        _loadAll: function (buildingCode, roomCode, deferred) {
            var scope = this;
            $http.get('json/rooms/' + buildingCode + '.json')
                .success(function (roomData) {
                    var newRoom = new Room(roomData);
                    scope._pool[buildingCode] = newRoom;

                    if (roomCode) deferred.resolve(newRoom.getRoom(roomCode));
                    else deferred.resolve(newRoom);
                })
                .error(function () {
                    deferred.reject();
                });
        },

        /* Public Methods */
        /* Use this function in order to get all rooms of a building */
        getAllRooms: function (buildingCode) {
            var deferred = $q.defer();
            var rooms = this._search(buildingCode);
            if (rooms) {
                deferred.resolve(rooms);
            } else {
                this._loadAll(buildingCode, false, deferred);
            }

            return deferred.promise;
        },

        getRoom: function (buildingCode, roomCode) {
            var deferred = $q.defer();
            var room = this._search(buildingCode, roomCode);
            if (room) {
                deferred.resolve(room);
            } else {
                this._loadAll(buildingCode, roomCode, deferred);
            }

            return deferred.promise;
        }

    };
    return roomManager;
}]);


angular.module('LMURaumfinder')
    .factory('Room', ['$http', function ($http) {
        function Room(RoomList) {
            if (RoomList) {
                this.setData({
                    data: RoomList
                });

                //this.data.setData(RoomList);
            }
            // Some other initializations related to Building
        };
        Room.prototype = {
            setData: function (buildingData) {
                angular.extend(this, buildingData);
            },
            getRoomsCount: function () {
                return Object.keys(this.data).length;
            },
            getRoom: function (code) {
                return this.data[code];
            },
            getRooms: function (query, limit) {
                var filtered = [];

                var showAll = false;
                var query_l = " ";

                if (query === undefined) showAll = true;
                else query_l = query.replace(/ /g, '').toLowerCase();

                for (var room in this.data) {
                    if (showAll ||
                        this.data[room].rName.replace(/ /g, '').toLowerCase().indexOf(query_l) > -1) {

                        this.data[room].rCode = room;
                        filtered.push(this.data[room]);
                    }
                    if (filtered.length > limit) break;
                }

                //console.log('Filter Räume');
                return filtered;
            }
        };
        return Room;
}]);