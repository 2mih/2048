/**
 * Created by Leo on 2015/5/1.
 */

function Grid(n, id) {

    var _tiles = [];

    for (var i = n - 1; i >= 0; i--) {
        var row = [];
        row[n - 1] = undefined;
        _tiles[i] = row;
    }

    this.tiles = _tiles;
    this.trash = [];
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

    for (i = size - 1; i >= 0; i--) {
        row = this.tiles[i];
        for (j = size - 1; j >= 0; j--) {

            if (!this.tiles[i][j]) {
                locations[locations.length] = i + ',' + j;
            }
        }
    }

    // a new tile born with 2 or 4 randomly
    var newLocation = locations[Math.floor(Math.random() * locations.length)].split(','),
        n = Math.floor(Math.random() * 2 + 1);
    this.tiles[newLocation[0]][newLocation[1]] = new Tile(n, newLocation[0], newLocation[1]);

};

Grid.prototype.merge = function () {

    var process = [],
        size = this.tiles.length,
        avai = true,
        tmp,
        cur,
        line;

    for (var j = 0; j < size; j++) {
        line = this.tiles[j];
        for (var i = 0; i < size; i++) {
            cur = line[i];
            if (cur) {
                if (tmp) {
                    if (tmp.pow === cur.pow) {
                        this.trash.push(tmp);
                        tmp = undefined;

                        cur.pow++;
                        process.push(cur);
                    } else {
                        process.push(tmp);
                        tmp = cur;
                    }
                } else {
                    tmp = cur;
                }
            }
        }

        if (tmp) {
            process.push(tmp);
        }

        // 补足长度
        if (!process[size - 1]) {
            process[size - 1] = undefined;
        }

        // 步骤是否有效
        if (avai) {
            for (var k = 0; k < size; k++) {
                avai = avai && (line[k] === process[k]);
            }
        }

        this.tiles[j] = process;
        tmp = undefined;
        process = [];
    }

    return avai;
};

Grid.prototype.rotateRight90 = function () {
    var process = [],
        size = this.tiles.length - 1;

    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            process[j] = process[j] || [];
            process[j][size - i] = cell;
        }
    }

    this.tiles = process;
};

Grid.prototype.rotateLeft90 = function () {
    var process = [],
        size = this.tiles.length - 1;

    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            process[size - j] = process[size - j] || [];
            process[size - j][i] = cell;
        }
    }

    this.tiles = process;
};

Grid.prototype.rotate180 = function () {
    var process = [],
        size = this.tiles.length - 1;

    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            process[size - i] = process[size - i] || [];
            process[size - i][size - j] = cell;
        }
    }

    this.tiles = process;
};

Grid.prototype.slideUp = function () {
    this.rotateLeft90();
    var avai = this.merge();
    this.rotateRight90();
    return avai;
};

Grid.prototype.slideLeft = function () {
    var avai = this.merge();
    return avai;
};

Grid.prototype.slideRight = function () {
    this.rotate180();
    var avai = this.merge();
    this.rotate180();
    return avai;
};

Grid.prototype.slideDown = function () {
    this.rotateRight90();
    var avai = this.merge();
    this.rotateLeft90();
    return avai;
};

Grid.prototype.log = function () {
    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        console.log('| ' + row.join(' | ') + ' |');
    }
    console.log('\r\n');
};

Grid.prototype.show = function () {

    var grid = document.getElementById(this.id),
        frag = document.createDocumentFragment();

    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        for (var j = 0; j < row.length; j++) {

            if(row[j]){
                var left = j * this.tileSize + (j + 1) * this.separatorSize,
                    top = i * this.tileSize + (i + 1) * this.separatorSize,
                    tile;
                if(row[j].id) {
                    tile = document.getElementById(row[j].id);
                    tile.replaceChild(document.createTextNode(
                        row[j] ? '' + Math.pow(2, row[j].pow) : ''), tile.firstChild);

                } else {

                    tile = document.createElement('div');

                    tile.id = row[j].id = '' + this.seq++;

                    tile.style.width = this.tileSize + 'px';
                    tile.style.height = this.tileSize + 'px';
                    tile.style.lineHeight = this.tileSize + 'px';
                    tile.appendChild(document.createTextNode(row[j] ? '' + Math.pow(2, row[j].pow) : ''));
                    frag.appendChild(tile);
                }

                tile.className = 'tile';
                tile.className += ' tile-' + row[j].pow;
                tile.style.top = top + 'px';
                tile.style.left = left + 'px';
            }
        }
    }

    for (var k = 0; k < this.trash.length; k++) {
        var del = document.getElementById(this.trash[k].id);
        if(del) {
            grid.removeChild(del);
        }
    }
    this.trash = [];

    grid.appendChild(frag);

};

(function () {

    var g = new Grid(4, 'grid');

    g.born();
    g.born();
    g.show();

    window.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
            case 37:
                g.slideLeft();
                g.born();
                g.show();
                break;
            case 38:
                g.slideUp();
                g.born();
                g.show();
                break;
            case 39:
                g.slideRight();
                g.born();
                g.show();
                break;
            case 40:
                g.slideDown();
                g.born();
                g.show();
                break;
            default :
                break;
        }
    });

})();

