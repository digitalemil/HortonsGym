function Line(x1, y1, x2, y2, w, pr, color) {
	this.partinit();
	this.setRoot(0, 0, 0, pr);
	this.setColor(color);
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.w= w;
}

Line.prototype = new Part();

Line.prototype.offscreen= function() {
	this.x1= -100000;
	this.y1= -100000;
	this.x2= -100000;
	this.y2= -100000;
	this.invalidateData();
};

Line.prototype.setPoints= function(xa, ya, xb, yb) {
	this.x1= xa;
	this.y1= ya;
	this.x2= xb;
	this.y2= yb;
	this.invalidateData();
};

Line.prototype.reset = function() {
	this.partreset();
};

Line.prototype.lineBeginTX = function() {
	this.partBeginTX();
	this.tx_x1 = this.x1;
	this.tx_y1 = this.y1;
	this.tx_x2 = this.x2;
	this.tx_y2 = this.y2;
	this.tx_w = this.w;
};

Line.prototype.commitTX = function() {
	this.lineCommitTX();
};

Line.prototype.beginTX = function() {
	this.lineBeginTX();
};

Line.prototype.rollbackTX = function() {
	this.lineRollbackTX();
};

Line.prototype.lineCommitTX = function() {
	this.partCommitTX();
};

Line.prototype.lineRollbackTX = function() {
	this.partRollbackTX();
	this.x1 = this.tx_x1;
	this.y1 = this.tx_y1;
	this.x2 = this.tx_x2;
	this.y2 = this.tx_y2;
	this.w= this.tx_w;
};

Line.prototype.getNumberOfData = function() {
	return 9;
};

Line.prototype.getData = function(d, startD, xn, yn, zn, a11, a21, a12, a22) {
	var n = startD;
	d[n++] = this.getType();
	d[n++] = 3;
	d[n++] = (this.a << 24) + (this.r << 16) + (this.g << 8) + this.b;
	d[n++] = 1;
	var phi = (this.rot + this.rrot);
	phi = Math.round(phi);
	while (phi < 0) {
		phi += 360;
	}
	phi %= 360;
	var sinbeta = mysin[phi];
	var cosbeta = mycos[phi];
	var dummy;
	var dummy2;
	dummy = this.x1 * cosbeta - this.y1 * sinbeta + this.rx + this.x;
	dummy2 = this.x1 * sinbeta + this.y1 * cosbeta + this.ry + this.y;
	d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
	d[n + 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	dummy = this.x2 * cosbeta - this.y2 * sinbeta + this.rx + this.x;
	dummy2 = this.x2 * sinbeta + this.y2 * cosbeta + this.ry + this.y;
	d[n + 2] = Math.round(dummy * a11 + dummy2 * a12 + xn);
	d[n + 3] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	d[n + 4] = this.sx * this.w;
	if (this.coordtap != null) {
		this.coordtap.save(0, 0, 0, d[n], d[n+1], d[n+2], d[n+3]);
	}
	return this.getNumberOfData();
};

Line.prototype.getType = function() {
	return LINE;
};
