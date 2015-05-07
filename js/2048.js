/**
 * Created by Leo on 2015/5/1.
 */

function Grid(n, t) {

    var _tiles = [];

    for (var i = n - 1; i >= 0; i--) {
        var row = [];
        for (var j = n - 1; j >= 0; j--) {
            row[j] = 0;
        }
        _tiles[i] = row;
    }

    this.tiles = _tiles;
    this.table  = t;
}

Grid.prototype.born = function() {

    var i,
        j,
        row,
        locations = [],
        size = this.tiles.length;

    for (i = size - 1; i >= 0; i--){
        row = this.tiles[i];
        for (j = size - 1; j>= 0; j--){

            if(this.tiles[i][j] === 0){
                locations[locations.length] = i + ',' + j;
            }
        }
    }

    // a new tile born with 2 or 4 randomly
    var newLocation = locations[Math.floor(Math.random() * locations.length)].split(',');
    this.tiles[newLocation[0]][newLocation[1]] = Math.floor(Math.random() * 2 + 1);

};

Grid.prototype.merge = function(line) {

    var process = [],
        tmp = true,
        cur,
        length;
    for (var i = 0; i < line.length;i++) {
        cur = line[i];
        length = process.length;
        if(cur !== 0) {
            if(tmp && line[i] === process[length - 1]) {
                process[length - 1]++;
                tmp = false;
            } else {
                process[length] = cur;
                tmp = true;
            }
        }
    }

    // 补0
    for (var j = process.length; j < line.length; j++){
        process[j] = 0;
    }

    return process;
};

Grid.prototype.rotateRight90 = function(){
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

Grid.prototype.rotateLeft90 = function(){
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

Grid.prototype.rotate180 = function(){
    var process = [],
        size = this.tiles.length - 1;

    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            process[size - i] = process[size - i] || [];
            process[size - i][size -j] = cell;
        }
    }

    this.tiles = process;
};

Grid.prototype.slideUp = function(){
    this.rotateLeft90();
    for (var i = 0; i < this.tiles.length; i++) {
        this.tiles[i] = this.merge(this.tiles[i]);
    }
    this.rotateRight90();
};

Grid.prototype.slideLeft = function(){
    for (var i = 0; i < this.tiles.length; i++) {
        this.tiles[i] = this.merge(this.tiles[i]);
    }
};

Grid.prototype.slideRight = function(){
    this.rotate180();
    for (var i = 0; i < this.tiles.length; i++) {
        this.tiles[i] = this.merge(this.tiles[i]);
    }
    this.rotate180();
};

Grid.prototype.slideDown = function(){
    this.rotateRight90();
    for (var i = 0; i < this.tiles.length; i++) {
        this.tiles[i] = this.merge(this.tiles[i]);
    }
    this.rotateLeft90();
};

Grid.prototype.log = function(){
    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i];
        console.log('| ' + row.join(' | ') + ' |');
    }
    console.log('\r\n');
};

Grid.prototype.show = function() {

    var tbody  = document.createElement('tbody');

    for (var i = 0; i < this.tiles.length; i++) {
        var row = this.tiles[i],
            tr = tbody.insertRow(i);
        for (var j = 0; j < row.length; j++) {
            var td = tr.insertCell(j);
            td.appendChild(document.createTextNode(row[j] !== 0 ? '' +  Math.pow(2, row[j]) : ''));
        }
    }

    var table = document.getElementById(this.table);
    table.replaceChild(tbody, table.firstChild);

};

(function(){

    var g = new Grid(4, 'grid');

    g.born();
    g.born();
    g.show();

    window.addEventListener('keyup', function(e){
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

