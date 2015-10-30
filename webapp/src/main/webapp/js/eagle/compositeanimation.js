function CompositeAnimation() {
}

CompositeAnimation.prototype.init= function(n, ml, maxa, l) {
	this._loops = l;
    this.name = n;
    this.running = false;
    this.maxlevel = ml;
    this.maxanimation = maxa;
    this.anis= new Array(ml*maxa);
    this.level= 0;
    for (var i = 0; i < this.maxlevel; i++) {
        for (var j = 0; j < this.maxanimation; j++) {
            this.anis[i * this.maxanimation + j] = undefined;
        }
    }
};

CompositeAnimation.prototype.dispose= function() {
    for (var i = 0; i < this.maxlevel; i++) {
        for (var j = 0; j < this.maxanimation; j++) {
            this.anis[i * this.maxanimation + j] = undefined;
        }
    }
    this.anis = undefined;
};

CompositeAnimation.prototype.increaseLevel= function() {
	if(this.anis[this.level * this.maxanimation].coloranim== true) {
      	db= true;
	}
      	this.level++;
	  
    if (this.level >= this.maxlevel) {
        this.stop();
    }
    else {	
        for (var i = 0; i < this.maxanimation; i++) {
            if (this.anis[this.level * this.maxanimation + i] == undefined) {
            	continue;
            }
            this.anis[this.level * this.maxanimation + i].start();
        }
    }
};


CompositeAnimation.prototype.addAnimation= function(a, l) {
    for (var i = 0; i < this.maxanimation; i++)     {
        //console.log(this.anis[l * this.maxanimation + i]);
        if (this.anis[l * this.maxanimation + i] == undefined) {
            this.anis[l * this.maxanimation + i] = a;
            return;
        }
    }
};

CompositeAnimation.prototype.createReverseAnimation= function() {
    var ret = new CompositeAnimation();
    ret.init("Reverse"+this.name, this.maxlevel, this.maxanimation, this._loops);
    for (var i = 0; i < this.maxlevel; i++) {
        for (var j = 0; j < this.maxanimation; j++) {
            if (this.anis[i * this.maxanimation + j] != undefined) {
                
                ret.anis[(this.maxlevel - 1 - i) * this.maxanimation + this.maxanimation - 1 - j] = this.anis[i * this.maxanimation + j].createReverseAnimation();
            }
        }
    }
    return ret;
};

CompositeAnimation.prototype.start= function() {
    this.level = 0;
    this._start = (new Date()).getTime();
    for (var i = 0; i < this.maxanimation; i++) {
        if (this.anis[i] != undefined) {
            this.anis[i].start();
        }
    }
    this.running = true;
};

CompositeAnimation.prototype.animateDelta= function(delta) {
    return animate(this._start + delta);
};

CompositeAnimation.prototype.animate= function(now) {
    if (!this.running) {
        return 1.0;
    }
    var ret = 0.0;
    for (var i = 0; i < this.maxanimation; i++) {
        if (this.anis[this.level * this.maxanimation + i] == undefined) {
            continue;
        }
        this.oneret = this.anis[this.level * this.maxanimation + i].animate(now);
            if (this.oneret >= 1.0 && i == this.maxanimation - 1) {
            this.increaseLevel();
         //   this.oneret = 0.0;
        }
        ret = this.oneret;
    }
    return ret;
};

CompositeAnimation.prototype.finish= function() {
    if (this.level >= this.maxlevel) {
        return;
    }
    for (var i = 0; i < this.maxanimation; i++) {
        if (this.anis[this.level * this.maxanimation + i] != undefined) {
            this.anis[this.level * this.maxanimation + i].finish();
        }
    }
    
};

CompositeAnimation.prototype.faster= function() {
    for (var a = 0; a < this.maxlevel; a++) {
        for (var i = 0; i < this.maxanimation; i++) {
            if (this.anis[a * this.maxanimation + i] != undefined) {
                this.anis[a * this.maxanimation + i].faster();
            }
        }
    }
};

CompositeAnimation.prototype.slower= function() {
    for (var a = 0; a < this.maxlevel; a++) {
        for (var i = 0; i < this.maxanimation; i++) {
            if (this.anis[a * this.maxanimation + i] != undefined) {
            	this.anis[a * this.maxanimation + i].slower();
            }
        }
    }
};

CompositeAnimation.prototype.stop= function() {
    if (this._loops) {
        this.start();
    }
    else {
        for (var a = 0; a < this.maxlevel; a++) {
            for (var i = 0; i < this.maxanimation; i++) {
                if (this.anis[a * this.maxanimation + i] != undefined) {
                    this.anis[a * this.maxanimation + i].stop();
                }
            }
        }
        this.running = false;
    }
};

CompositeAnimation.prototype.getType= function() {
    return COMPOSITEANIMATION;
};
