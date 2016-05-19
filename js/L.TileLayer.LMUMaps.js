/*
 * This is based on the L.TileLayer.Zoomify display Zoomify tiles with Leaflet by Bjørn Sandvik
 */
var w;
L.TileLayer.LMUMaps = L.TileLayer.extend({
    options: {
        continuousWorld: true,

        tolerance: 0.8
    },

    initialize: function (url, options) {
        options = L.setOptions(this, options);
        this._url = url;
        w = options.w;
        var imageSize = L.point(options.width, options.height),
            tileSize = options.tileSize;

        //        this._imageSize = [imageSize];
        //        this._gridSize = [this._getGridSize(imageSize)];
        //
        //
        //        while (parseInt(imageSize.x) > tileSize || parseInt(imageSize.y) > tileSize) {
        //            imageSize = imageSize.divideBy(2).floor();
        //            this._imageSize.push(imageSize);
        //            this._gridSize.push(this._getGridSize(imageSize));
        //            console.log(imageSize);
        //        }

        this._gridSize = [L.point(Math.ceil(options.width * 0.125 / 256), Math.ceil(options.height * 0.125 / 256)),
                        L.point(Math.ceil(options.width * 0.25 / 256), Math.ceil(options.height * 0.25 / 256)),
                        L.point(Math.ceil(options.width * 0.50 / 256), Math.ceil(options.height * 0.50 / 256)),
                        L.point(Math.ceil(options.width / 256), Math.ceil(options.height / 256)),
                       ];
        this._imageSize = [L.point(parseInt(options.width * 0.125), parseInt(options.height * 0.125)),
                        L.point(parseInt(options.width * 0.25), parseInt(options.height * 0.25)),
                        L.point(parseInt(options.width * 0.50), parseInt(options.height * 0.50)),
                        L.point(parseInt(options.width), parseInt(options.height)),
                       ];

        //        console.log('imageSize');
        //        console.log(imageSize);
        //        console.log(this._imageSize);
        //
        //        console.log('Gridsize');
        //        console.log(this._gridSize);

        //this._imageSize.reverse();
        //this._gridSize.reverse();

        this.options.maxZoom = this._gridSize.length - 1;
    },

    onAdd: function (map) {
        L.TileLayer.prototype.onAdd.call(this, map);

        var mapSize = map.getSize(),
            zoom = this._getBestFitZoom(mapSize),
            imageSize = this._imageSize[zoom],
            center = map.options.crs.pointToLatLng(L.point(imageSize.x / 2, imageSize.y / 2), zoom);

        map.setView(center, zoom, true);
    },

    _getGridSize: function (imageSize) {
        var tileSize = this.options.tileSize;
        return L.point(Math.ceil(imageSize.x / tileSize), Math.ceil(imageSize.y / tileSize));
    },

    _getBestFitZoom: function (mapSize) {
        var tolerance = this.options.tolerance,
            zoom = this._imageSize.length - 1,
            imageSize, zoom;

        while (zoom) {
            imageSize = this._imageSize[zoom];
            if (imageSize.x * tolerance < mapSize.x && imageSize.y * tolerance < mapSize.y) {
                return zoom;
            }
            zoom--;
        }

        return zoom;
    },

    _tileShouldBeLoaded: function (tilePoint) {
        var gridSize = this._gridSize[this._map.getZoom()];
        return (tilePoint.x >= 0 && tilePoint.x < gridSize.x && tilePoint.y >= 0 && tilePoint.y < gridSize.y);
    },

    _addTile: function (tilePoint, container) {
        var tilePos = this._getTilePos(tilePoint),
            tile = this._getTile(),
            zoom = this._map.getZoom(),
            imageSize = this._imageSize[zoom],
            gridSize = this._gridSize[zoom],
            tileSize = this.options.tileSize,
            myX = parseInt((imageSize.x / 256)),
            myY = parseInt((imageSize.y / 256));

        if (tilePoint.x >= myX) {
            tile.style.width = imageSize.x - (tileSize * (gridSize.x - 1)) + 'px';
        }

        if (tilePoint.y >= myY) {
            tile.style.height = imageSize.y - (tileSize * (gridSize.y - 1)) + 'px';
        }

        L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome || L.Browser.android23);

        this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
        this._loadTile(tile, tilePoint);

        if (tile.parentNode !== this._tileContainer) {
            container.appendChild(tile);
        }
    },

    getTileUrl: function (tilePoint) {
        var i = 0;
        if (this._map.getZoom() == 0 + i) {
            return this._url + "125" + '/' + tilePoint.x + '/' + tilePoint.y + '.png';
        } else if (this._map.getZoom() == 1 + i) {
            return this._url + "250" + '/' + tilePoint.x + '/' + tilePoint.y + '.png';
        } else if (this._map.getZoom() == 2 + i) {
            return this._url + "500" + '/' + tilePoint.x + '/' + tilePoint.y + '.png';
        } else if (this._map.getZoom() == 3 + i) {
            return this._url + "1000" + '/' + tilePoint.x + '/' + tilePoint.y + '.png';
        }
        return 'error';
    },

    _getTileGroup: function (tilePoint) {
        var zoom = this._map.getZoom(),
            num = 0,
            gridSize;

        for (z = 0; z < zoom; z++) {
            gridSize = this._gridSize[z];
            num += gridSize.x * gridSize.y;
        }

        num += tilePoint.y * this._gridSize[zoom].x + tilePoint.x;
        return Math.floor(num / 256);;
    },

    setUrl: function (url, noRedraw) {
        this._url = url;

        if (!noRedraw) {
            this.redraw();
        }

        return this;
    },

    redraw: function () {
        if (this._map) {
            this._reset({
                hard: true
            });
            this._update();
        }
        return this;
    },

});

L.tileLayer.lmuMaps = function (url, options) {
    return new L.TileLayer.LMUMaps(url, options);
};