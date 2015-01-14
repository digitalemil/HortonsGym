
function ThingContainer(nthings) {
	this.__setup();
}

ThingContainer.prototype.__setup = function(nthings, layer) {
	this.n = nthings;
	this.things = new Array(this.n);
	this.layers = new Array(layer);
	this.ix= new Array(this.n);
	this.iy= new Array(this.n);
	this.x= 0;
	this.y= 0;

};

ThingContainer.prototype.addThings = function(objs, p, layer) {
	this.pos = p;
	var ninlayer = 0;
	this.layers[layer] = p;
	for ( var i = 0; i < this.n; i++) {
		if (this.things[i].getLayer() == layer) {
			// console.log("adding: "+this.things[i].getName()+" at: "+p);
			objs[p++] = this.things[i];
			ninlayer++;
		}
	}
	return ninlayer;
};

ThingContainer.prototype.removeThings = function(objs) {
	var lastlayer = -1;
	var thingsinlayer = 0;
	for ( var i = 0; i < this.n; i++) {
		var layer = this.things[i].getLayer();
		var p = this.layers[layer];

		if (lastlayer != layer)
			thingsinlayer = 0;
		else
			thingsinlayer++;

		objs[p + thingsinlayer] = null;
	}
};

ThingContainer.prototype.translate = function(x, y, z) {
//	this.x+= x;
//	this.y+= y;
	for ( var i = 0; i < this.n; i++) {
		this.things[i].translate(x, y);
	}
};

ThingContainer.prototype.rotate = function(deg) {
	for ( var i = 0; i < this.n; i++) {
		this.things[i].rotate(deg);
	}
};

ThingContainer.prototype.scale = function(isx, isy) {
	
	for ( var i = 0; i < this.n; i++) {
		
		this.things[i].scale(isx, isy);	
		this.things[i].x*= isy;
		this.things[i].y*= isx;
	}
};

ThingContainer.prototype.setVisibility = function(v) {
	for ( var i = 0; i < this.n; i++) {
		this.things[i].visible= v;
	}
};

ThingContainer.prototype.translateRoot = function(x, y, z) {
	for ( var i = 0; i < this.n; i++) {
		this.things[i].translateRoot(x, y, z);
	}
};

ThingContainer.prototype.rotateRoot = function(deg) {
	for ( var i = 0; i < this.n; i++) {
		this.things[i].rotateRoot(deg);
	}
};

ThingContainer.prototype.scaleRoot = function(sx, sy) {
	for ( var i = 0; i < this.n; i++) {
		this.things[i].scaleRoot(sx, sy);
	}
};

ThingContainer.prototype.getType = function() {
	return THINGCONTAINER;
};

ThingContainer.prototype.setupDone = function() {
	for ( var i = 0; i < this.n; i++) {
		this.ix[i]= this.things[i].x;
		this.iy[i]= this.things[i].y;
	}
};

