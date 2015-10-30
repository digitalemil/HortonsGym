function copyPrototype(descendant, parent) {
    var sConstructor = parent.toString();
    var aMatch = sConstructor.match( /\s*function (.*)\(/ );
    if ( aMatch != null ) { 
        descendant.prototype[aMatch[1]] = parent;
    }
    for (var m in parent.prototype) {
        descendant.prototype[m] = parent.prototype[m];
    }
};

var createOffScreenImage = function (width, height) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer;
};