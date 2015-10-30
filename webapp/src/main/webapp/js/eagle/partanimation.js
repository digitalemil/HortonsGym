function PartAnimation() {
}

PartAnimation.prototype.initColorAnimation = function(p, a, d) {
	this.coloranim = true;
	this.fca = a;
	this.rduration= this.sduration = duration = d;
	this.part = p;
	this._loops = false;
	this.running = false;
};

PartAnimation.prototype.init = function(p, tx, ty, tr, tsx, tsy, d, l) {
	this.coloranim = false;
	this.running = false;
	this.translationX = tx;
	this.translationY = ty;
	this.scaleX = tsx;
	this.scaleY = tsy;
	this.rotation = tr;
	this.rduration= this.sduration = this.duration = d;
	this.part = p;
	this._loops = l;
};

PartAnimation.prototype.currentTimeMillies = function() {
	return (new Date()).getTime();
};

PartAnimation.prototype.start = function() {
	this.running = true;
	this.sduration= this.rduration;			
	this.duration = this.sduration;
	this.lsx = this.lsy = 1.0;
	this.lca = this.part.a;
	this.lx = 0.0;
	this.ly = 0.0;
	this.lr = 0.0;
	this.delta = 0;
	this._start = this.currentTimeMillies();
};

PartAnimation.prototype.createReverseAnimation = function() {
	var d = this.duration;
	var r = -this.rotation;
	var x = -this.translationX;
	var y = -this.translationY;
	var sx = 1.0 / this.scaleX;
	var sy = 1.0 / this.scaleY;

	if (this.running) {
		var p = (this.currentTimeMillies() - this._start) / this.duration;
		d *= p;
		x *= p;
		y *= p;
		sx = (1.0 + (this.scaleX - 1.0) * p);
		sy = (1.0 + (this.scaleY - 1.0) * p);
		r *= p;
	}
	var ret = new PartAnimation();
	ret.init(this.part, x, y, r, sx, sy, d, this._loops);
	return ret;
};

PartAnimation.prototype.animateNow = function() {
	this.animate(this.currentTimeMillies());
};

PartAnimation.prototype.animate = function(now) {
	if (!this.running) {
		return 1.0;
	}
	var delta = (now - this._start);
	if(now== undefined)
		console.trace();
	var percentage = (delta / this.duration);
	if (percentage > 1.0) {
		percentage = 1.0;
	}
//	console.log("delta: "+delta+" "+percentage);
	if (delta >= this.duration && !this._loops) {
		percentage= 1.0;
		this.finish();
	}
	if (this.coloranim) {
		this.part.setAlpha(this.lca + (this.fca - this.lca) * percentage);
	} else {
		var v1 = (1.0 + (this.scaleX - 1.0) * percentage);
		var v2 = (1.0 + (this.scaleY - 1.0) * percentage);
	//	if(this.name== "ArrowAni")
		//	console.log("Arrow Animation: "+(this.translationX * percentage - this.lx)+" "+(this.translationY * percentage - this.ly));

		this.part.translate(this.translationX * percentage - this.lx,
				this.translationY * percentage - this.ly, 0.0);
		this.lx = this.translationX * percentage;
		this.ly = this.translationY * percentage;
		this.part.scale(v1 / this.lsx, v2 / this.lsy);
		this.lsx = v1;
		this.lsy = v2;
		this.part.rotate(this.rotation * percentage - this.lr);
		this.lr = this.rotation * percentage;
	}
	if (delta >= this.duration && this._loops) {
		this.start();
	}
	return percentage;
};

PartAnimation.prototype.setValues = function(x, y, sx, sy, rot) {
	this.part.clearAll();
	this.part.translate(x, y, 0.0);
	this.part.rotate(rot);
	this.part.scale(sx, sy);
};

PartAnimation.prototype.finish = function() {
	this.running = false;
};

PartAnimation.prototype.isRunning = function() {
	return this.running;
};

PartAnimation.prototype.stop = function() {
	this.running = false;
};

PartAnimation.prototype.pause = function() {
	duration = (1.0 - (this.currentTimeMillies() - _start) / duration);
};

PartAnimation.prototype.cont = function() {
	running = true;
};

PartAnimation.prototype.animateDelta = function(d) {
	this.delta += d;
	return animate(this._start + this.delta);
};

PartAnimation.prototype.faster= function() {
	this.sduration= (this.sduration*0.8);
};

PartAnimation.prototype.slower= function() {	
	this.sduration= (this.sduration*1.2);
};

PartAnimation.prototype.getType = function() {
	return PARTANIMATION;
};