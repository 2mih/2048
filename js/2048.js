/**
 * 方块类
 * @class
 * @param
 *      n   方块数值对应的2的指数
 */
function Tile(n) {
    this.pow = n;
}

/**
 * 格子类
 * @class
 * @param
 *      id   格子对应的元素ID  
 */
function Grid(id) {

    var _tiles = [],
        n = 4;

    for (var i = 0; i < n; i++) {
        var row = [];
        row[n - 1] = undefined;
        _tiles[i] = row;
    }

    this.tiles = _tiles;
    this.size = n;
    this.seq = 1;  // 序列，用于方块的唯一标识
    this.separatorSize = 10;
    this.tileSize = 100;
    this.id = id;
}

/**
 * 生成新的方块
 * @method
 */
Grid.prototype.born = function () {

    var i,
        j,
        row,
        locations = [],
        size = this.size;

    // 找出所有空的格子
    for (i = size - 1; i >= 0; i--) {
        row = this.tiles[i];
        for (j = size - 1; j >= 0; j--) {

            if (!this.tiles[i][j]) {
                locations[locations.length] = i + ',' + j;
            }
        }
    }

    // 生成新的方块，数值为2或4  
    var index = Math.floor(Math.random() * locations.length);
    var newLocation = locations[index].split(','),
        n = Math.floor(Math.random() * 2 + 1);
    var newTile = new Tile(n);

    // 得到新方块位置
    i = parseInt(newLocation[0]);
    j = parseInt(newLocation[1]);
    var left = j * this.tileSize + (j + 1) * this.separatorSize,
        top = i * this.tileSize + (i + 1) * this.separatorSize,
        tile;

    tile = document.createElement('div');
    tile.className = 'tile animated zoomIn tile-' + n;
    tile.id = newTile.id = '' + this.seq++;
    tile.style.top = top + 'px';
    tile.style.left = left + 'px';
    tile.appendChild(document.createTextNode('' + Math.pow(2, n)));

    newTile.top = top;
    newTile.left = left;
    this.tiles[i][j] = newTile;

    var gridId = this.id,
        me = this;

    setTimeout(function () {
        document.getElementById(gridId).appendChild(tile);

        // 格子填满时，判断是否无路可走
        if (locations.length === 1) {
            me.gameover();
        }
    }, 100);

};

/**
 * 方块合并，可合并一个方块队列
 * @method
 * @param
 *      line    方块队列
 *      index    队列的索引
 *      direction    合并的方向
 * @return    是否有方块产生位移
 */ 
Grid.prototype.merge = function (line, index, direction) {

    var pointer = 0,
        size = this.size,
        merge = true,
        moved = false;

    for (var i = 0; i < size; i++) {
        var cur = line[i];
        line[i] = undefined;
        if (cur) {

            // 合并
            if (line[pointer - 1] && merge && line[pointer - 1].pow === cur.pow) {

                this.disappear(line[pointer - 1]);
                cur.pow++;
                line[pointer - 1] = cur;

                merge = false;  // 一次操作中，合并后的格子不能二次合并
                this.render(cur, index, pointer - 1, direction, cur.pow);
            } else {
                line[pointer] = cur;
                merge = true;

                this.render(cur, index, pointer, direction);

                pointer++;
            }
        }

        // 是否有方块产生位移
        moved = moved || (cur !== line[i]);
    }

    for (i = 0; i < size; i++) {
        var t = line[i];
        switch (direction) {
            case 'up':
                this.tiles[i][index] = t;
                break;
            case 'left':
                this.tiles[index][i] = t;
                break;
            case 'down':
                this.tiles[size - 1 - i][index] = t;
                break;
            case 'right':
                this.tiles[index][size - 1 - i] = t;
                break;
            default:
                break;
        }
    }

    return moved;
};

/**
 * 清理被合并的方块
 * @method
 * @param
 *      tile    方块
 */
Grid.prototype.disappear = function (tile) {

    var node = document.getElementById(tile.id);
    if (node) {
        node.parentNode.removeChild(node);
    }

};

/**
 * 检测是否可以继续合并
 * @method
 * @param
 *      array    方块队列
 */
Grid.prototype.existDuplicate = function (array) {

    for (var i = 0; i < array.length - 1; i++) {
        if (array[i].pow === array[i + 1].pow) {
            return true;
        }
    }

    return false;

};

/**
 * 检测游戏是否已经结束
 * @method
 */
Grid.prototype.gameover = function () {

    var size = this.size;

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

    document.getElementById('gameover').style.display = 'block';
}

/**
 * 检测是否可以继续合并
 * @method
 * @param
 *      tile    方块
 *      index    队列索引
 *      index2    方块索引
 *      direction    位移方向
 *      pow    新的指数
 */
Grid.prototype.render = function (tile, index, index2, direction, pow) {

    var top,
        left,
        size = this.size;

    // 得到方块新的位置
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
            top = (size - 1 - index2) * this.tileSize + (size - index2) * this.separatorSize;
            left = index * this.tileSize + (index + 1) * this.separatorSize;
            break;
        case 'right':
            top = index * this.tileSize + (index + 1) * this.separatorSize;
            left = (size - 1 - index2) * this.tileSize + (size - index2) * this.separatorSize;
            break;
        default:
            break;
    }

    var ele = document.getElementById(tile.id);
    if (ele) {
        // 方块位移
        $(ele).animate({
            top: top + 'px',
            left: left + 'px'
        }, {
            duration: 100,
            // 合并时的动画效果
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

/**
 * 向上移动
 * @method
 */
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

/**
 * 向左移动
 * @method
 */
Grid.prototype.slideLeft = function () {

    var moved = false;

    for (var i = 0; i < 4; i++) {
        var result = this.merge(this.tiles[i], i, 'left');
        moved = moved || result;
    }

    return moved;
};

/**
 * 向右移动
 * @method
 */
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

/**
 * 向下移动
 * @method
 */
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
            case 65:
                g.slideLeft() && g.born();
                break;
            case 38:
            case 87:
                g.slideUp() && g.born();
                break;
            case 39:
            case 68:
                g.slideRight() && g.born();
                break;
            case 40:
            case 83:
                g.slideDown() && g.born();
                break;
            default:
                break;
        }
    });

})();
