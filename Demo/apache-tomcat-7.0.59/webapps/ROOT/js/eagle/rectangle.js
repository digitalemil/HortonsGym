Rectangle.prototype = new Part();

function Rectangle() {
}

Rectangle.prototype.init = function(w, h, irx, iry, irz, ir, ic) {
	this.setRoot(irx, iry, irz, ir);
	this.tex = new Array(8);
	this.width = w / 2;
	this.height = h / 2;
	this.sx = 1;
	this.sy = 1;
	this.setColor(ic);
	this.fillTex();

	this.tx_width = 0;
	this.tx_height = 0;
	this.tx_sx = 1;
	this.tx_sy = 1;
};

Rectangle.prototype.rectangleBeginTX = function() {
	this.partBeginTX();
	this.tx_sx = this.sx;
	this.tx_sy = this.sy;
	this.tx_width = this.width;
	this.tx_height = this.height;
};

Rectangle.prototype.commitTX = function() {
	this.rectangleCommitTX();
};

Rectangle.prototype.beginTX = function() {
	this.rectangleBeginTX();
};

Rectangle.prototype.rollbackTX = function() {
	this.rectangleRollbackTX();
};

Rectangle.prototype.rectangleCommitTX = function() {
	this.partCommitTX();
};

Rectangle.prototype.rectangleRollbackTX = function() {
	this.partRollbackTX();
	this.sx = this.tx_sx;
	this.sy = this.tx_sy;
	this.width = this.tx_width;
	this.height = this.tx_height;
};

Rectangle.prototype.reset = function() {
	this.partreset();
};

Rectangle.prototype.fillTex = function() {
	this.tex[0] = 0.0;
	this.tex[1] = 1.0;
	this.tex[2] = 1.0;
	this.tex[3] = 1.0;
	this.tex[4] = 1.0;
	this.tex[5] = 0.0;
	this.tex[6] = 0.0;
	this.tex[7] = 0.0;
};

Rectangle.prototype.getNumberOfData = function() {
	return 4 + 2 * 5; // type, n, color, data 4*(x & y)
};

Rectangle.prototype.getData = function(d, startD, xn, yn, zn, a11, a21, a12,
		a22) {
	if(this.parent.getType()== "THING")
	 console.log("rectangle getData: "+startD+ " "+this.width+" "+this.height);
	var n = startD;
	d[n++] = this.getType();
	d[n++] = 4;
	d[n++] = (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
	d[n++] = 1;
	n += 2;
	var phi = calcPhi(this.rot + this.rrot);
	var sinbeta = mysin[phi];
	var cosbeta = mycos[phi];
	var dummy;
	var dummy2;
	var rx1 = 0;
	var ry1 = 0;
	var xmin = 1000000;
	var xmax = -1000000;
	var ymin = 1000000;
	var ymax = -1000000;

	for ( var i = 0; i < 4; i++) {
		switch (i) {
		case 0:
			rx1 = -this.width * this.sx;
			ry1 = this.height * this.sy;
			break;
		case 1:
			ry1 = -this.height * this.sy;
			break;
		case 2:
			rx1 = this.width * this.sx;
			break;
		case 3:
			ry1 = this.height * this.sy;
			break;
		}
		dummy = rx1 * cosbeta - ry1 * sinbeta + this.rx + this.x;
		dummy2 = rx1 * sinbeta + ry1 * cosbeta + this.ry + this.y;
		d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
		d[n + 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
		if (d[n] < xmin)
			xmin = d[n];
		if (d[n] > xmax)
			xmax = d[n];
		if (d[n+1] < ymin)
			ymin = d[n+1];
		if (d[n+1] > ymax)
			ymax = d[n+1];
		n += 2;
	}
	if (this.coordtap != null) {
		this.coordtap.save(0, 0, 0, xmin, xmax, ymin, ymax);
	}


	return this.getNumberOfData();
};

Rectangle.prototype.scale = function(isx, isy) {
	this.width *= isx;
	this.height *= isy;
};

Rectangle.prototype.setDimension = function(w, h) {
	this.width = w / 2;
	this.height = h / 2;
};

Rectangle.prototype.getType = function() {
	return RECTANGLE;
};