function Tile(n) {
    this.pow = n;
}

function Grid(id) {

    var _tiles = [],
        n = 4;

    for (var i = 0; i < n; i++) {
        var row = [];
        row[n - 1] = undefined;
        _tiles[i] = row;
    }

    this.tiles = _tiles;
    this.seq = 1;
    this.separatorSize = 10;
    this.tileSize = 100;
    this.id = id;
}

Grid.prototype.born = function () {

    var i,
        j,
        row,
        locations = [],
        size = this.tiles.length;

    //  找出空白位置
    for (i = size - 1; i >= 0; i--) {
        row = this.tiles[i];
        for (j = size - 1; j >= 0; j--) {

            if (!this.tiles[i][j]) {
                locations[locations.length] = i + ',' + j;
            }
        }
    }

    /* To Do

     */


    var index = Math.floor(Math.random() * locations.length);
    var newLocation = locations[index].split(','),
        n = Math.floor(Math.random() * 2 + 1);
    var newTile = new Tile(n);
    i = parseInt(newLocation[0]);
    j = parseInt(newLocation[1]);

    var left = j * this.tileSize + (j + 1) * this.separatorSize,
        top = i * this.tileSize + (i + 1) * this.separatorSize,
        tile;

    newTile.top = top;
    newTile.left = left;
    this.tiles[i][j] = newTile;

    tile = document.createElement('div');
    tile.className = 'tile animated zoomIn tile-' + n;
    tile.id = newTile.id = '' + this.seq++;
    tile.style.top = top + 'px';
    tile.style.left = left + 'px';
    tile.appendChild(document.createTextNode('' + Math.pow(2, n)));

    var gridId = this.id;
    setTimeout(function () {
        document.getElementById(gridId).appendChild(tile);
    }, 100);


};

Grid.prototype.existDuplicate = function (array) {

    for (var i = 0; i < array.length - 1; i++) {
        if (array[i] === array[i + 1]) {
            return true;
        }
    }

    return false;

}

Grid.prototype.merge = function (line, index, direction) {

    var pointer = 0,
        size = 4,
        merge = true,
        moved = false;

    for (var i = 0; i < size; i++) {
        var cur = line[i];
        line[i] = undefined;
        if (cur) {

            if (line[pointer - 1] && merge && line[pointer - 1].pow === cur.pow) {

                this.disappear(line[pointer - 1]);
                cur.pow++;
                line[pointer - 1] = cur;

                merge = false;
                this.render(cur, index, pointer - 1, direction, cur.pow);
            } else {
                line[pointer] = cur;
                merge = true;

                this.render(cur, index, pointer, direction);

                pointer++;
            }
        }

        moved = moved || (cur !== line[i]);
    }

    for (i = 0; i < 4; i++) {
        var t = line[i];
        switch (direction) {
            case 'up':
                this.tiles[i][index] = t;
                break;
            case 'left':
                this.tiles[index][i] = t;
                break;
            case 'down':
                this.tiles[3 - i][index] = t;
                break;
            case 'right':
                this.tiles[index][3 - i] = t;
                break;
            default:
                break;
        }
    }

    return moved;
};

Grid.prototype.disappear = function (tile) {

    document.getElementById(this.id).removeChild(document.getElementById(tile.id));

};

Grid.prototype.gameover = function () {

    if (document.getElementById(this.id).childNodes.length === Math.pow(this.tiles.length, 2)) {
        for (var k = 0; k < size; k++) {
            if (this.existDuplicate(this.tiles[k])) {
                return false;
            }

            var col = [];
            for (var l = 0; l < size; l++) {
                col.push(this.tiles[l][k]);
            }

            if (this.existDuplicate(col)) {
                return false;
            }
        }
    }

    alert('Game Over!');
}

Grid.prototype.render = function (tile, index, index2, direction, pow) {

    var top,
        left;

    switch (direction) {
        case 'up':
            top = index2 * this.tileSize + (index2 + 1) * this.separatorSize;
            left = index * this.tileSize + (index + 1) * this.separatorSize;
            break;
        case 'left':
            top = index * this.tileSize + (index + 1) * this.separatorSize;
            left = index2 * this.tileSize + (index2 + 1) * this.separatorSize;
            break;
        case 'down':
            top = (3 - index2) * this.tileSize + (3 - index2 + 1) * this.separatorSize;
            left = index * this.tileSize + (index + 1) * this.separatorSize;
            break;
        case 'right':
            top = index * this.tileSize + (index + 1) * this.separatorSize;
            left = (3 - index2) * this.tileSize + (3 - index2 + 1) * this.separatorSize;
            break;
        default:
            break;
    }

    var ele = document.getElementById(tile.id);
    if (ele) {
        $(ele).animate({
            top: top + 'px',
            left: left + 'px'
        }, {
            duration: 100,
            complete: function () {
                if (pow) {

                    ele.className = 'tile';
                    setTimeout(function () {
                        ele.className = 'tile animated pulse tile-' + pow;
                        ele.replaceChild(document.createTextNode(Math.pow(2, pow) + ''), ele.firstChild);
                    }, 50);
                }
            }
        });
    }
};

Grid.prototype.slideUp = function () {

    var moved = false;

    for (var i = 0; i < 4; i++) {
        var line = [];
        for (var j = 0; j < 4; j++) {
            line[j] = this.tiles[j][i];
        }

        var result = this.merge(line, i, 'up');
        moved = moved || result;
    }

    return moved;
};

Grid.prototype.slideLeft = function () {

    var moved = false;

    for (var i = 0; i < 4; i++) {
        var result = this.merge(this.tiles[i], i, 'left');
        moved = moved || result;
    }

    return moved;
};

Grid.prototype.slideRight = function () {

    var moved = false;

    for (var i = 0; i < 4; i++) {
        var line = [];
        for (var j = 0; j < 4; j++) {
            line[j] = this.tiles[i][3 - j];
        }
        var result = this.merge(line, i, 'right');
        moved = moved || result;
    }

    return moved;
};

Grid.prototype.slideDown = function () {

    var moved = false;

    for (var i = 0; i < 4; i++) {
        var line = [];
        for (var j = 0; j < 4; j++) {
            line[j] = this.tiles[3 - j][i];
        }
        var result = this.merge(line, i, 'down');
        moved = moved || result;
    }

    return moved;
};

(function () {

    var g = new Grid('grid');

    g.born();
    g.born();

    window.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
            case 37:
                g.slideLeft() && g.born() && g.gameover();
                break;
            case 38:
                g.slideUp() && g.born() && g.gameover();
                break;
            case 39:
                g.slideRight() && g.born() && g.gameover();
                break;
            case 40:
                g.slideDown() && g.born() && g.gameover();
                break;
            default:
                break;
        }
    });

})();
