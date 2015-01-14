function Bone(x, y, z, r, n) {
	this.init(x, y, z, r, n);
}

Bone.prototype = new Part();

Bone.prototype.init = function(ix, iy, iz, ir, n) {
	this.partinit();
	this.parts = new Array(n);
	this.pn = 0;
	this.nd = 0;
	this.rx = ix;
	this.ry = iy;
	this.rz = iz;
	this.rrot = ir;
	this.visible = true;
	this.nbcs = 0;
};

Bone.prototype.beginTX = function() {
	this.boneBeginTX();
};

Bone.prototype.commitTX = function() {
	this.boneCommitTX();
};

Bone.prototype.rollbackTX = function() {
	this.boneRollbackTX();
};

Bone.prototype.boneBeginTX = function() {
	if (!this.supportsTX())
		return;
	this.partBeginTX();
	for ( var i = 0; i < this.pn; i++) {
		if (this.parts[i].supportsTX())
			this.parts[i].beginTX();
	}
};

Bone.prototype.boneCommitTX = function() {
	if (!this.supportsTX())
		return;
	this.partCommitTX();
	for ( var i = 0; i < this.pn; i++) {
		if (this.parts[i].supportsTX())
			this.parts[i].commitTX();
	}
};

Bone.prototype.boneRollbackTX = function() {
	if (!this.supportsTX())
		return;
	this.partRollbackTX();
	for ( var i = 0; i < this.pn; i++) {
		if (this.parts[i].supportsTX())
			this.parts[i].rollbackTX();
	}
};

Bone.prototype.getByName = function(n) {
	var result = null;
	if (this.name != null && this.name == n) {
		return this;
	}
	for ( var i = 0; i < this.pn; i++) {
		var pn = this.parts[i].getName();
		if (pn != null) {
			if (this.parts[i].getName() == n) {
				result = this.parts[i];
				break;
			}
		}
		if (this.parts[i].getType() == BONE) {
			result = this.parts[i].getByName(n);
		}
		if (result != null) {
			return result;
		}
	}
	return result;
};

Bone.prototype.add = function(p, ix, iy, iz, ir) {
	if (ix == undefined)
		ix = 0;
	if (iy == undefined)
		iy = 0;
	if (iz == undefined)
		iz = 0;
	if (ir == undefined)
		ir = 0;

	p.translateRoot(ix, iy, iz);
	p.rotate(ir);
	p.setParent(this);
	this.parts[this.pn++] = p;
	this.a = p.a;
};

Bone.prototype.printParents = function() {
	if (this.parent != null && this.parent != undefined) {
		this.parent.printParents();
	}
	console.log(this.name);
};

Bone.prototype.addPart = function(p) {
	this.add(p, 0, 0, 0, 0);
};

Bone.prototype.getNumberOfData = function() {
	return this.nd;
};

Bone.prototype.canHaveChilds = function() {
	return true;
};

Bone.prototype.getNumberOfBCs = function() {
	return this.nbcs;
};

Bone.prototype.getNumberOfTextAndFont = function() {
	return this.nt;
};

Bone.prototype.getBCs = function() {
	if (this.bcs == null) {
		this.bcs = new Array(this.nbcs);
		this.addBCs(this.bcs, 0);
	}
	return this.bcs;
};

Bone.prototype.addBCs = function(bcarray, start) {
	for ( var i = 0; i < this.pn; i++) {
		if (this.parts[i].getType() == BOUNDINGCIRCLE) {
			bcarray[start++] = this.parts[i];
			// console.log("Added BC: " + this.parts[i] + " to: " + this.name);
		}

		if (this.parts[i].canHaveChilds()) {
			start = this.parts[i].addBCs(bcarray, start);
		}
	}
	return start;
};

Bone.prototype.setupDone = function() {
	this.nd = 0;
	this.nt= 0;
	for ( var i = 0; i < this.pn; i++) {
		this.nd += this.parts[i].getNumberOfData();
		this.nt += this.parts[i].getNumberOfTextAndFont();		
		if (this.parts[i].getType() == BOUNDINGCIRCLE)
			this.nbcs++;
		if (this.parts[i].canHaveChilds()) {
			this.nbcs += this.parts[i].getNumberOfBCs();
		}
	}
	this.invalidateData();
};

Bone.prototype.getTextAndFont = function(t, startT) {
	if (!this.invaliddata) {
		return this.getNumberOfTextAndFont();
	}

	var st = startT;
	for ( var i = 0; i < this.pn; i++) {
		st += this.parts[i].getTextAndFont(t, st);
	}
	return this.nt;
};

Bone.prototype.getData = function(d, startD, xn, yn, zn, a11, a21, a12, a22) {
	if (!this.invaliddata) {
		// console.log("Valid Bone: "+this.name);
		return this.getNumberOfData();
	}
	// console.log("Bone: "+this.name+" "+this.pn);
	var sv = startD;
	var phi = -(this.rot + this.rrot);
	phi = Math.round(phi);
	while (phi < 0)
		phi += 360;
	phi %= 360;

	// console.log("phi: "+phi);
	var cphi = mycos[phi];
	var sphi = mysin[phi];

	var ta11 = cphi;
	var ta21 = sphi;
	var ta12 = -sphi;
	var ta22 = cphi;

	xn = xn + a11 * (this.rx + this.x) + a12 * (this.ry + this.y);
	yn = yn + a21 * (this.rx + this.x) + a22 * (this.ry + this.y);

	if (this.coordtap != null)
		this.coordtap.save(xn, yn, phi, a11, a21, a12, a22);
	var na11 = (ta11 * a11 + ta12 * a21) * this.sx * this.rsx;
	var na12 = (ta11 * a12 + ta12 * a22) * this.sy * this.rsy;
	var na21 = (ta21 * a11 + ta22 * a21) * this.sx * this.rsx;
	var na22 = (ta21 * a12 + ta22 * a22) * this.sy * this.rsy;
	if (!this.visible) {
		xn = -100000;
	}
	for ( var i = 0; i < this.pn; i++) {
		// console.log
		sv += this.parts[i].getData(d, sv, xn, yn, this.rz + this.z + zn, na11,
				na21, na12, na22);
	}
	return this.nd;
};

Bone.prototype.invalidateData = function() {
	this.invaliddata = true;
	if (!this.parent == undefined)
		this.parent.invaliddata = true;
	for ( var i = 0; i < this.pn; i++) {
		this.parts[i].invalidateData();
	}
	return i;
};

Bone.prototype.setVisibility = function(v) {
	this.visible = v;
	this.invalidateData();
};

Bone.prototype.setColor = function(c) {
	this.invalidateData();
	this.a = (c >> 24);
	this.r = ((c & 0x00FF0000) >> 16);
	this.g = ((c & 0x0000FF00) >> 8);
	this.b = ((c & 0x000000FF));
	for ( var i = 0; i < this.pn; i++) {
		this.parts[i].setColor(c);
	}
};

Bone.prototype.setAlpha = function(c) {
	this.invalidateData();
	this.a = c;
	for ( var i = 0; i < this.pn; i++) {
		this.parts[i].setAlpha(c);
	}
};

Bone.prototype.getType = function() {
	return BONE;
};

Bone.prototype.highlight = function(b) {
	this.invalidateData();

	this.highlighted = b;
	for ( var i = 0; i < this.pn; i++) {
		this.parts[i].highlight(b);
	}
};

Bone.prototype.reset = function() {
	this.invalidateData();
	this.partreset();
	for ( var i = 0; i < this.pn; i++) {
		this.parts[i].reset();
	}
};
