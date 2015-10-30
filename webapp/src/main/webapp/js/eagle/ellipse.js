var TRIANGLES8 = 12;
var TRIANGLES10 = 20;
var TRIANGLES12 = 20;
var TRIANGLES20 = 20;
var TRIANGLES24 = 24;
var TRIANGLES0 = 0;
var ellipseMysin = new Array(0.0, 0.70710677, 1.0, 0.70710677, -8.742278E-8,
		-0.7071069, -1.0, -0.70710653, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.58778524, 0.95105654,
		0.9510565, 0.5877852, -8.742278E-8, -0.58778536, -0.9510565,
		-0.9510565, -0.58778495, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.86602545, 1.0, 0.8660254,
		0.50000006, -8.742278E-8, -0.5000002, -0.86602545, -1.0, -0.86602545,
		-0.49999976, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.309017, 0.58778524, 0.809017, 0.95105654, 1.0, 0.9510565,
		0.809017, 0.5877852, 0.3090168, -8.742278E-8, -0.30901697, -0.58778536,
		-0.8090171, -0.9510565, -1.0, -0.9510565, -0.8090168, -0.58778495,
		-0.30901694, 0.0, 0.0, 0.0, 0.0, 0.0, 0.25881904, 0.5, 0.70710677,
		0.86602545, 0.9659258, 1.0, 0.9659258, 0.8660254, 0.70710677,
		0.50000006, 0.25881892, -8.742278E-8, -0.25881907, -0.5000002,
		-0.7071069, -0.86602545, -0.9659259, -1.0, -0.9659258, -0.86602545,
		-0.70710653, -0.49999976, -0.25881884);
var ellipseMycos = new Array(1.0, 0.70710677, -4.371139E-8, -0.70710677, -1.0,
		-0.70710665, 1.1924881E-8, 0.707107, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.809017, 0.30901697,
		-0.30901703, -0.80901706, -1.0, -0.80901694, -0.3090171, 0.30901712,
		0.80901724, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.8660254, 0.49999997, -4.371139E-8, -0.50000006,
		-0.8660254, -1.0, -0.86602527, -0.4999999, 1.1924881E-8, 0.4999999,
		0.86602557, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		1.0, 0.95105654, 0.809017, 0.58778524, 0.30901697, -4.371139E-8,
		-0.30901703, -0.5877852, -0.80901706, -0.9510566, -1.0, -0.95105654,
		-0.80901694, -0.58778507, -0.3090171, 1.1924881E-8, 0.30901712,
		0.5877855, 0.80901724, 0.95105654, 0.0, 0.0, 0.0, 0.0, 1.0, 0.9659258,
		0.8660254, 0.70710677, 0.49999997, 0.25881907, -4.371139E-8,
		-0.25881916, -0.50000006, -0.70710677, -0.8660254, -0.9659259, -1.0,
		-0.9659258, -0.86602527, -0.70710665, -0.4999999, -0.25881898,
		1.1924881E-8, 0.258819, 0.4999999, 0.707107, 0.86602557, 0.9659259);
var ellipseMycs = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3,
		3, 3, 3, 3, 4, 4, 4, 4);

function Loop(ir1, ir2, iir1, iir2, irx, iry, irz, irotation, itriangles, icolor) {
	this.init(ir1, ir2, iir1, iir2, irx, iry, irz, irotation, itriangles, icolor);
	this.setRoot(irx, iry, irz, irotation);
}

Loop.prototype = new Part();

Loop.prototype.init = function(ir1, ir2, iir1, iir2, irx, iry, irz, irotation,
		itriangles, icolor) {
	this.partinit();
	this.triangles = itriangles;
	this.setRadius(ir1, ir2, iir1, iir2);
	this.sr1 = ir1;
	this.sr2 = ir2;
	this.setColor(icolor);
	this.tx_sr1= 0;
	this.tx_sr2= 0;
	this.tx_r1= 0;
	this.tx_r2= 0;
};

Loop.prototype.setRadius = function(ir1, ir2, iir1, iir2) {
	this.invalidateData();

	this.r1 = ir1;
	this.r2 = ir2;
	this.ri1 = iir1;
	this.ri2 = iir2;
};


Loop.prototype.getXScale = function() {
	return r1 / sr1;
};

Loop.prototype.getYScale = function() {
	return r2 / sr2;
};

Loop.prototype.clearScale = function() {
	this.invalidateData();

	this.r1 = this.sr1;
	this.r2 = this.sr2;
	this.ri1 = this.sr1;
	this.ri2 = this.sr2;
};

Loop.prototype.getNumberOfData = function() {
	return 4+ 2+ 2  * (this.triangles+1); // type, n, color, correction + root
	// data triangles*(x
	// & y)
};

Loop.prototype.getData = function(d, startD, xn, yn, zn, a11, a21, a12, a22) {
	if (!this.invaliddata)
		return this.getNumberOfData();
	this.invaliddata = false;
	var n = startD;
	d[n++] = this.getType();
	d[n++] = 2* this.triangles +2;
	d[n++] = (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
	d[n++] = 1;

	var phi = (this.rot + this.rrot);
	phi = Math.round(phi);
	while (phi < 0)
		phi += 360;
	phi %= 360;

	// console.log("phi: "+phi);
	var sinbeta = mysin[phi];
	var cosbeta = mycos[phi];
	var dummy;
	var dummy2;
	var rx1 = this.rx + this.x;
	var ry1 = this.ry + this.y;
	dummy = rx1;
	dummy2 = ry1;
	d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
	d[n+ 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	n+= 2;
	var sn= n;
	for ( var i = 0; i < this.triangles; i++, n+= 2) {
		var sinalpha = ellipseMysin[ellipseMycs[this.triangles] * 24 + i];
		var cosalpha = ellipseMycos[ellipseMycs[this.triangles] * 24 + i];

		dummy = rx1
				+ (this.r1 * cosalpha * cosbeta - this.r2 * sinalpha * sinbeta);
		dummy2 = ry1
				+ (this.r1 * cosalpha * sinbeta + this.r2 * sinalpha * cosbeta);
		d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
		d[n+ 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	}
	d[n] = d[sn];
	d[n+ 1] = d[sn+1];
	n+= 2;
	sn =n;
	for ( var i = this.triangles-1; i >= 0 ; i--, n+= 2) {
		var sinalpha = ellipseMysin[ellipseMycs[this.triangles] * 24 + i];
		var cosalpha = ellipseMycos[ellipseMycs[this.triangles] * 24 + i];

		dummy = rx1
				+ (this.ri1 * cosalpha * cosbeta - this.ri2 * sinalpha * sinbeta);
		dummy2 = ry1
				+ (this.ri1 * cosalpha * sinbeta + this.ri2 * sinalpha * cosbeta);
		d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
		d[n+ 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	}
	d[n] = d[sn];
	d[n+ 1] = d[sn+1];
	return this.getNumberOfData();
};

Loop.prototype.scale = function(sx, sy) {
	this.invalidateData();
	this.setRadius(this.r1 * sx, this.r2 * sy, this.ri1 * sx, this.ri2 * sy);
};

Loop.prototype.scaleRoot = function(sx, sy) {
	this.invalidateData();

	this.rsx *= sx;
	this.rsy *= sy;
	this.setRadius(this.r1 * sx, this.r2 * sy, this.ri1 * sx, this.ri2 * sy);
};

Loop.prototype.getType = function() {
	return LOOP;
};

Loop.prototype.reset = function() {
	this.setRadius(this.rsx * this.sr1, this.rsy * this.sr2, this.rsx * this.sr1, this.rsy * this.sr2);
	this.partreset();
};


/* Ellipse */


function Ellipse(ir1, ir2, irx, iry, irz, irotation, itriangles, icolor) {
	this.init(ir1, ir2, irx, iry, irz, irotation, itriangles, icolor);
	this.setRoot(irx, iry, irz, irotation);
}

Ellipse.prototype = new Part();

Ellipse.prototype.init = function(ir1, ir2, irx, iry, irz, irotation,
		itriangles, icolor) {
	this.partinit();
	this.triangles = itriangles;
	this.maxeff = itriangles;
	this.setRadius(ir1, ir2);
	this.sr1 = ir1;
	this.sr2 = ir2;
	this.setColor(icolor);
	this.tx_sr1= 0;
	this.tx_sr2= 0;
	this.tx_r1= 0;
	this.tx_r2= 0;
};

Ellipse.prototype.ellipseBeginTX = function() {
	this.partBeginTX();
	this.tx_sr1= this.sr1;
	this.tx_sr2= this.sr2;	
	this.tx_r1= this.r1;
	this.tx_r2= this.r2;
};

Ellipse.prototype.commitTX = function() {
	this.ellipseCommitTX();
};

Ellipse.prototype.beginTX = function() {
	this.ellipseBeginTX();
};

Ellipse.prototype.rollbackTX = function() {
	this.ellipseRollbackTX();
};

Ellipse.prototype.ellipseCommitTX = function() {
	this.partCommitTX();
};

Ellipse.prototype.ellipseRollbackTX = function() {
	this.partRollbackTX();
	this.r1 = this.tx_r1;
	this.r2 = this.tx_r2;
	this.sr1 = this.tx_sr1;
	this.sr2 = this.tx_sr2;
};

Ellipse.prototype.setRadius = function(ir1, ir2) {
	this.invalidateData();

	this.r1 = ir1;
	this.r2 = ir2;
};

Ellipse.prototype.getXScale = function() {
	return r1 / sr1;
};

Ellipse.prototype.getYScale = function() {
	return r2 / sr2;
};

Ellipse.prototype.clearScale = function() {
	this.invalidateData();

	this.r1 = this.sr1;
	this.r2 = this.sr2;
};

Ellipse.prototype.getNumberOfData = function() {
	return 4+ 2 * (this.maxeff+1); // type, n, color, correction
	// data triangles*(x
	// & y)
};

Ellipse.prototype.getData = function(d, startD, xn, yn, zn, a11, a21, a12, a22) {
	if (!this.invaliddata) {
		return this.getNumberOfData();
	}
	this.invaliddata = false;
	var n = startD;
	d[n++] = this.getType();
	d[n++] = this.maxeff;
	d[n++] = (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
	d[n++] = (this.maxeff== this.triangles)?1:0;
	//if(this.maxeff)
	var phi = (this.rot + this.rrot);
	phi = Math.round(phi);
	while (phi < 0)
		phi += 360;
	phi %= 360;

	// console.log("phi: "+phi);
	var sinbeta = mysin[phi];
	var cosbeta = mycos[phi];
	var dummy;
	var dummy2;
	var rx1 = this.rx + this.x;
	var ry1 = this.ry + this.y;
	dummy = rx1;
	dummy2 = ry1;
	d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
	d[n+ 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	if(this.coordtap!= null) 
		this.coordtap.save(d[n], d[n+1], phi);
	n+= 2;
	for ( var i = 0; i < this.maxeff; i++, n+= 2) {
		var sinalpha = ellipseMysin[ellipseMycs[this.triangles] * 24 + i];
		var cosalpha = ellipseMycos[ellipseMycs[this.triangles] * 24 + i];

		dummy = rx1
				+ (this.r1 * cosalpha * cosbeta - this.r2 * sinalpha * sinbeta);
		dummy2 = ry1
				+ (this.r1 * cosalpha * sinbeta + this.r2 * sinalpha * cosbeta);
		d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
		d[n+ 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	}

	return this.getNumberOfData();
};

Ellipse.prototype.scale = function(sx, sy) {
	this.invalidateData();
	this.setRadius(this.r1 * sx, this.r2 * sy);
};

Ellipse.prototype.scaleRoot = function(sx, sy) {
	this.invalidateData();

	this.rsx *= sx;
	this.rsy *= sy;
	this.setRadius(this.r1 * sx, this.r2 * sy);
};

Ellipse.prototype.getType = function() {
	return ELLIPSE;
};

Ellipse.prototype.reset = function() {
	this.setRadius(this.rsx * this.sr1, this.rsy * this.sr2);
	this.partreset();
};

Ellipse.prototype.setMaxEff = function(m) {
	this.invalidateData();
	this.maxeff = m + 1;
};