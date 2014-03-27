// changed at Wed Mar 26 2014 22:59:39 GMT-0700 (PDT) by ohshima  
this.addScript(function doAI() {
    var w = $world.get('editor');
    w.remoteEval('[].slice.call(document.getElementsByClassName("tile"), 0).map(function(f) {return f.className})', function(isError, result) {
        this.boardString = result;
        this.board = this.parseBoardString(this.boardString);
        this.printBoard(this.board);
        var grid = new users.ohshima.ai2048.Grid(4, this.board);
        var ai = new users.ohshima.ai2048.AI(grid);
        var result = ai.getBest();
        console.log(result.move);
        this.sendEvent(result.move);
    }.bind(this));
}).tag([]);


// changed at Wed Mar 26 2014 21:46:31 GMT-0700 (PDT) by ohshima  
this.addScript(function extractTile(aString) {
    var subs = aString.split(' ');
    var num = null;
    var pos = null;
    var result = null;
    var type = null;
    for (var i = 0; i < subs.length; i++) {
        var s = subs[i];
        result = s.match(/^tile-([a-z]+)$/);
        if (result && result[1]) {
            type = result[1];
        }
        result = s.match(/^tile-([0-9]+)$/);
        if (result) {
            num = parseInt(result[1]);
        }
        result = s.match(/tile-position-([1-4])-([1-4])/);
        if (result) {
            pos = {x: parseInt(result[1]), y: parseInt(result[2])};
        }
    }
    if (pos) {
        pos.type = type;
        pos.num = num;
        return pos;
    } else {
        return null;
    }
}).tag([]);


// changed at Wed Mar 26 2014 19:49:11 GMT-0700 (PDT) by ohshima  
this.addScript(function getBoard() {
    var w = $world.get('editor');
    w.remoteEval('[].slice.call(document.getElementsByClassName("tile"), 0).map(function(f) {return f.className})', function(isError, result) {
        this.boardString = result;
        this.board = this.parseBoardString(this.boardString);
        this.printBoard(this.board);
    }.bind(this));
}).tag([]);


// changed at Wed Mar 26 2014 23:05:25 GMT-0700 (PDT) by ohshima  
this.addScript(function onMouseDown(evt) {
    this.doAI();
}).tag([]);


// changed at Wed Mar 26 2014 19:48:09 GMT-0700 (PDT) by ohshima  
this.addScript(function parseBoardString(aCollection) {
    var board = new Array(16);
    var subs = aCollection.split(',');
    for (var i = 0; i < subs.length; i++) {
        var t = subs[i];
        var r = this.extractTile(t);
        if (r) {
            if (!(board[(r.y - 1) * 4 + (r.x - 1)]) || r.type === 'merged') {
                board[(r.y - 1) * 4 + (r.x - 1)] = r.num;
            }
        }
    }
    return board;
}).tag([]);


// changed at Wed Mar 26 2014 19:46:37 GMT-0700 (PDT) by ohshima  
this.addScript(function printBoard(board) {
    result = '\n';
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            var val =  board[y * 4 + x];
            if (val !== undefined) {
                result = result + val;
            } else {
                result = result + ' ';
            }
            if (x < 3) {
                result = result + ', ';
            }
        }
        result = result + '\n';
    }
    console.log(result);
}).tag([]);


// changed at Wed Mar 26 2014 23:00:17 GMT-0700 (PDT) by ohshima  
this.addScript(function sendEvent(move) {
    var m = {0: 0x57, // Up W
    1: 0x44, // Right D
    2: 0x53, // Down S
    3: 0x41} // Left A
    [move];
    if (m === undefined) {return;}

    var k = {0: "'U+0057'", // Up W
    1: "'U+0044'", // Right D
    2: "'U+0053'", // Down S
    3: "'U+0041'"} // Left A
    [move];

    var str = '(function() {var v = document.createEvent("KeyboardEvent"); Object.defineProperty(v, "keyCode", {get: function() {return parseInt(this.keyIdentityfer.slice(2), 16)}}); Object.defineProperty(v, "which", {get: function() {return parseInt(this.keyIdentifier.slice(2), 16)}}); v.initKeyboardEvent("keydown", true, true, window, ' + k + ', 0); document.getElementsByClassName("container")[0].dispatchEvent(v)})()';

    var w = $world.get('editor');
    w.remoteEval(str, function(isError, result) {
        console.log(isError);
    });

}).tag([])
