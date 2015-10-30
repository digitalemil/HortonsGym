CoordinateTap= function(n) {
	this.name= n;
	this.x= -100000;
	this.y= -100000;
	this.r= 0;
	this.a11= 0;
	this.a21= 0;
	this.a12= 0;
	this.a22= 0;
};

CoordinateTap.prototype.save= function(ix, iy, ir, ia11, ia21, ia12, ia22) {
	this.x= ix;
	this.y= iy;
	this.r= ir;
	this.a11= ia11;
	this.a21= ia21;
	this.a12= ia12;
	this.a22= ia22;
};

CoordinateTap.prototype.reset= function(n) {
	this.y= -100000;
	this.y= -100000;
};

CoordinateTap.prototype.setName= function(n) {
	this.name= n;
};

CoordinateTap.prototype.getX= function(n) {
	return this.x;
};

CoordinateTap.prototype.getY= function(n) {
	return this.y;
};
CoordinateTap.prototype.getR= function(n) {
	return this.r;
};
CoordinateTap.prototype.getName= function(n) {
	return this.name;
};


