function Goodie() {
}

Goodie.prototype = new Quad();

Goodie.prototype.create = function(type) {
	this.quadinit(128 * scale, 128 * scale, 0);
	this.rotate(90);
	this.setTexName((type == 0) ? "arrows.png" : "eaglefeather.png");
	this.bc = new Thing(1);
	var obj = new BoundingCircle();
	obj.initBoundingCircle(10, 0, -2, 0);
	this.bc.add(obj);
	var obj = new BoundingCircle();
	obj.initBoundingCircle(10, -10, 30, 0);
	this.bc.add(obj);

	var obj = new BoundingCircle();
	obj.initBoundingCircle(10, 10, -30, 0);
	this.bc.add(obj);

	this.bc.setupDone();
	this.move(-this.x)
};

Goodie.prototype.move = function(x, y) {
	this.translate(x, y);
	this.bc.translate(x, y);
}

