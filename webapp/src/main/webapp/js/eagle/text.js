Text.prototype = new Part();

var TEXT_LEFT= 0;
var TEXT_RIGHT= 1;
var TEXT_CENTER= 2;

function Text() {
}

Text.prototype.init= function(t, irx, iry, ic) {
	this.setRoot(irx, iry, 0, 0);
	this.setColor(ic);
	this.tx_text= t;
	this.tx_size= 12;
	this.tx_font= "";
	this.text= t;
	this.size= "";
	this.font= "";	
	this.align= TEXT_CENTER;
};


Text.prototype.textBeginTX = function() {
	this.partBeginTX();
	this.tx_text= this.text;
	this.tx_size= this.size;
	this.tx_font= this.font;
	this.tx_align= this.align;
};

Text.prototype.commitTX = function() {
	this.textCommitTX();
};

Text.prototype.beginTX = function() {
	this.textBeginTX();
};

Text.prototype.rollbackTX = function() {
	this.textRollbackTX();
};

Text.prototype.textCommitTX = function() {
	this.partCommitTX();
};

Text.prototype.textRollbackTX = function() {
	this.partRollbackTX();
	this.text = this.tx_text;
	this.size = this.tx_size;
	this.font = this.tx_font;
	this.align = this.tx_align;
};

Text.prototype.reset = function() {
	this.partreset();
};

Text.prototype.getNumberOfData = function() {
	return 8; 
};

Text.prototype.getTextAndFont = function(t, startT) {
	var n = startT;
	t[n++] = this.text;
	t[n++] = this.font;	
	return 2;
};

Text.prototype.getNumberOfTextAntFont = function() {
	return 2; 
};

Text.prototype.getData = function(d, startD, xn, yn, zn, a11, a21, a12,
		a22) {
	var n = startD;
	d[n++] = this.getType();
	d[n++] = 8;
	d[n++] = (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
	d[n++] = 1;
	var dummy;
	var dummy2;
	var rx1 = this.rx + this.x;
	var ry1 = this.ry + this.y;
	dummy = rx1;
	dummy2 = ry1;
	d[n] = Math.round(dummy * a11 + dummy2 * a12 + xn);
	d[n+ 1] = Math.round(dummy * a21 + dummy2 * a22 + yn);
	d[n+ 2] = a11* this.size;
	d[n+ 3] = this.align;
	return this.getNumberOfData();
};

Text.prototype.setText = function(t) {
	this.text = t;
	//console.log("SETTEXT: "+t);
	this.invalidateData();
};

Text.prototype.setSize = function(s) {
	this.size = s;
	this.invalidateData();
};

Text.prototype.setFont = function(f) {
	this.font = f;
	this.invalidateData();
};

Text.prototype.setAlignment = function(a) {
	if(a>= TEXT_LEFT && a<= TEXT_CENTER) {
		this.align = a;
		this.invalidateData();
	}
};


Text.prototype.getText = function() {
	return this.text;
};

Text.prototype.getSize = function() {
	return this.size;
};

Text.prototype.getFont = function() {
	return this.font;
};

Text.prototype.getType = function() {
	return TEXT;
};

Text.prototype.getAlignment = function() {
	return this.align;
};