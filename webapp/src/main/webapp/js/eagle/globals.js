var width;
var height;
var scale;
var w2;
var h2;
var allThings;
var numberOfThings;
var defaultWidth= 768;
var defaultHeight= 1024;
var frames= 0;

getRandom= function(min, max) {
    if (min > max) {
            return -1;
    }

    if (min == max) {
            return min;
    }

    var r;

    do {
            r = Math.random();
    } while (r == 1.0);

    return min + parseInt(r * (max - min + 1));
};

calcScale= function() { 
		scale = Math.min(width / defaultWidth,
				height / defaultHeight);
};
	
setWidth= function(w) {
		width = w;
		w2= width/2;
		calcScale();
};
	
setHeight= function(h) {
		height = h;
		h2= height/2;
		calcScale();
};
