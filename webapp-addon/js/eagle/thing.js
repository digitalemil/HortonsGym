function Thing(n) {
	this.nonvisiblecancollide = false;
	this.thinginit(n);
}

Thing.prototype = new Bone();

Thing.prototype.thinginit = function(n) {
	this.data = null;
	this.init(0, 0, 0, 0, n);
	this.movable = true;
	this.maxr = 0;
	this.nbc = 0;
	this.changed = true;
	this.cancollide = true;
	this.parts = new Array(n);
	this.layer = 0;
	this.bcs = null;
	this.collisionHandler= null;
};

Thing.prototype.setCollisionHandler= function(handler) {
	this.collisionHandler= handler;
}; 

Thing.prototype.isIn = function(x, y) {
	return false;
};

Thing.prototype.getLayer = function() {
	return this.layer;
};

Thing.prototype.setLayer = function(l) {
	this.layer = l;
};

Thing.prototype.getThingTextAndFont = function() {
	if (this.textAndFont == null || this.textAndFont == undefined) {
		this.textAndFont = new Array(this.nt);
	}
	this.getTextAndFont(this.textAndFont, 0);
	return this.textAndFont;
};

Thing.prototype.getThingData = function() {
	if (this.data == null || this.data == undefined) {
		//alert("create data array: "+this.name);
	//	console.log("nd: "+ this.nd);
		this.data = new Array(this.nd);
	}
	//console.log(this.name+" "+this.invaliddata+" "+this.data);
	this.getData(this.data, 0, 0, 0, 0, 1.0, 0, 0, 1.0);
	// alert(this.name+" "+this.data);
	
	if(this.collisionHandler!= null) {
		this.collisionHandler.checkCollision(this);	
	}
		
	return this.data;
};

Thing.prototype.getType = function() {
	return THING;
};

Thing.prototype.changeHandled = function() {
	this.changed = false;
};

Thing.prototype.change = function() {
	this.changed = true;
};

Thing.prototype.deleteData = function() {
	this.data = null;
	this.invalidateData();
};

Thing.prototype.reset = function() {
	this.thingReset();
};

Thing.prototype.thingReset = function() {
	this.invalidateData();
	// this.partreset();
	this.sx= 1.0;
	this.sy= 1.0;
	
	for ( var i = 0; i < this.pn; i++) {
		this.parts[i].reset();
	}
};
