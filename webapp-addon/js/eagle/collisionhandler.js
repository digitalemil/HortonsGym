
function CollisionHandler() {
}

CollisionHandler.prototype.setup = function(thing, ts, start, end) {
	this.me= thing;
	this.things = ts;
	this.start = start;
	this.end = end;
	this.enabled = true;
	this.NOCOLLISION= -1;
	this.collisionhappend= this.NOCOLLISION;
};

CollisionHandler.prototype.getCollisionHappend= function() {
	return this.collisionhappend;
};

CollisionHandler.prototype.isEnabled = function() {
	return this.enabled;
};

CollisionHandler.prototype.enable = function() {
	this.enabled = true;
};

CollisionHandler.prototype.disable = function() {
	this.enabled = false;
};

CollisionHandler.prototype.canCollide = function(thing) {
	return true;
};

CollisionHandler.prototype.checkCollision = function() {
	if (!this.enabled)
		return;

	var thingbcs= this.me.getBCs();

	for ( var i = this.start; i < this.end; i++) {
		if (this.things[i] == undefined || this.things[i] == null)
			return;
		if (!this.canCollide(this.things[i]) || this.me== this.things[i])
			continue;
		
		
		var bcs = this.things[i].getBCs();
		
		for ( var h = 0; h < bcs.length; h++) {
		//	console.log("h: "+h+" "+bcs[h]+" "+bcs[h].getCoordinateTap());
			var bbc = bcs[h];
			if(bbc== null || bbc== undefined || bbc.getCoordinateTap()== undefined || bbc.getCoordinateTap()== null )
				continue;
		
			var bx = bbc.getCoordinateTap().getX();
			var by = bbc.getCoordinateTap().getY();
			var br = bbc.getCoordinateTap().getR() * this.things[i].sx
					* this.things[i].rsx; // radius
			for ( var j = 0; j < thingbcs.length; j++) {
				var abc = thingbcs[j];
				// Check for hit
				if(abc.getCoordinateTap()==null)
					continue;
						
				var ax = abc.getCoordinateTap().getX();
				var ay = abc.getCoordinateTap().getY();
				var ar = abc.getCoordinateTap().getR() * this.me.sx * this.me.rsx; // radius
				if ((bx - ax) * (bx - ax) + (by - ay) * (by - ay) <= (br + ar)
						* (br + ar)) {
		//	console.log(ax+" "+ay+ " "+ar+" "+bx+" "+by+" "+br+" "+abc.getCoordinateTap().name);
					this.other= this.things[i];		
					this.collisionhappend= this.other.getType();
					return this.handleCollision(this.other);
				}
			}
		}

	}
};

CollisionHandler.prototype.handleCollision = function(thing) {
};

CollisionHandler.prototype.clearCollision= function() {
	this.collisionhappend= this.NOCOLLISION;
	this.other= null;
};


