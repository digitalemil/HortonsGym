var services;
var OPTIMIZED = true;
var fullOptimized = false;
var fps = 0;
var touchevent= false;
var debug;
var ntex= 0;

var d1 = 0, d2 = 0, d3 = 0, d4 = 0;

function Services() {
}

Services.prototype.update = function() {
	console.log("Timer!");
};

Services.prototype.getView = function() {
	return this.view;
};

Services.prototype.setActive = function(b) {
};

Services.prototype.setView = function(v) {
	if (this.getView())
		this.getView().setActive(false);
	this.view = v;
	// this.getView().setActive(true);
};

function itsTime(timer) {
	// console.log("services timer: "+timer.timeout);
	services.getView().update(timer);
}

function fpsTime(timer) {
	// LOG(d1+" "+d2+" "+d3+" "+d4);
	fpstext = this.modell.getFps();
	if (this.modell.getFps() >= 3) {
		services.getView().timer.timeout += 1;
	}
//	console.log("fps: "+this.modell.getFps());
	if (this.modell.getFps() < 1 && services.getView().timer.timeout > 0)
		services.getView().timer.timeout -= 4;
//	this.modell.getFps() = 0;
};


var createOffScreenImage = function(width, height) {
	var buffer = document.createElement('canvas');
	buffer.width = width;
	buffer.height = height;
	return buffer;
};

function View(canvas, m, desiredFps) {
	this.textures = new Array(1);
	this.ctx = canvas.getContext('2d');
	this.dfps = desiredFps;
	setWidth(canvas.width);
	setHeight(canvas.height);
	this.modell = m;
	this.modell.setup();
	this.init();
}

View.prototype.init = function() {
	services = new Services();
	services.setView(this);
	services.getView().enabled = true;
	this.font = "bold " + Math.round(16 * scale) + "px sans-serif";
	this.timer = new MyTimer(itsTime);
	fpstimer = new MyTimer(fpsTime);
	services.getView().update();

	this.timer.start(Math.round(1000 / this.dfps));
	fpstimer.start(1000);
	this.n = 0;
};

View.prototype.paintThing = function(d, di, len, textandfont) {
	var texts = 0;
	while (di < len) {
		var type = d[di];
		if (type == BOUNDINGCIRCLE && !visibleboundingcircle) {
			di += 7;
			continue;
		}
		var ni = d[di + 1];
		var color = RGB2HTML(d[di + 2]);
		var cor = d[di + 3];
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		if (type == BOUNDINGCIRCLE) {
			di++;
		}
		switch (type) {
		case LINE:
			var x1 = d[di + 4] + w2;
			var y1 = d[di + 5] + h2;
			var x2 = d[di + 6] + w2;
			var y2 = d[di + 7] + h2;
			var w= d[di + 8];
			if(x1>-10000 || x1<10000) {
				this.ctx.lineWidth= w;
				this.ctx.moveTo(x1, y1);
				this.ctx.lineTo(x2, y2);
				this.ctx.closePath();
				this.ctx.stroke();
			}
			di+= 9;
			//console.log("Draw line: "+x1+" "+y1+" "+x2+" "+y2+" "+w);
			break;
		case TEXT:
			this.ctx.font = textandfont[texts + 1] + "  "
					+ Math.round(d[di + 6]) + "px sans-serif";
			var metrics = this.ctx.measureText(textandfont[texts]);
			var mh = this.ctx.measureText("m").width;
			var x = d[di + 4] + w2;
			switch (d[di + 7]) {
			case TEXT_RIGHT:
				x -= metrics.width;
				break;
			case TEXT_CENTER:
				x -= metrics.width / 2;
				break;
			}
			this.ctx.fillText(textandfont[texts], x, d[di + 5] + h2 + mh / 2);
			texts += 2;
			di += 8;
			break;
		default:
			var dd = di + 4 + 2 * cor;
			this.ctx.moveTo(d[dd] + w2, d[dd + 1] + h2);
			var nimax = 2 * ni;
			for ( var li = 2; li < nimax; li += 2) {
				this.ctx.lineTo(d[dd + li] + w2, d[dd + li + 1] + h2);
			}
			this.ctx.closePath();
			this.ctx.fill();
			di += 4 + 2 * (ni + 1);
			break;
		}
	}
};

View.prototype.paintQuad = function(d, teximg, w, h) {
	var i = 6;
	var xmin = this.min(d[i], d[i + 2], d[i + 4], d[i + 6]);
	var ymin = this.min(d[i + 1], d[i + 3], d[i + 5], d[i + 7]);
	this.ctx.drawImage(teximg, xmin + w2, h2 + ymin);
};

View.prototype.paintPrep = function() {
	for ( var t = 0; t < this.modell.getNumberOfThings(); t++) {
		if (this.modell.getType(t) == IMAGE) {
			var texname = this.modell.getTexName(t);
			var tex = this.modell.getTexID(t);

			if ((texname == null || texname == undefined)) {
				continue;
			}
			if (this.modell.texNameChanged(t)) {
				this.textures[tex]= null;
			/*	if (this.modell.isTexIDSet(t)) {
					this.textures[tex].usage--;
					if (this.textures[tex].usage == 0) {
						this.textures.splice(tex, 1);
					}
				}
				*/
				if (texname == null) {
					console.log("setTexQuadID to 0");
					this.modell.setTexID(t, 0);
					continue;
				}
				tex = this.loadTexture(texname, this.modell.getImageWidth(t),
						this.modell.getImageHeight(t));

				this.modell.setTexID(t, tex);
			//	console.log("setTexQuadID to t:" + tex);
			}
		}
	}
	this.ctx.fillStyle = '#000000';
	this.ctx.strokeStyle = '#000000';
};

View.prototype.paint = function() {
	var now = (new Date()).getTime();
	this.modell.update();
	d1 += (new Date()).getTime() - now;
	now = (new Date()).getTime();
	this.paintPrep();
	d2 += (new Date()).getTime() - now;

	this.ctx.clearRect(0, 0, width, height);
	var ft = false;
	now = (new Date()).getTime();
	for ( var t = 0; t < this.modell.getNumberOfThings(); t++) {
		if (!this.modell.isVisible(t))
			continue;

		if (this.modell.getType(t) == IMAGE) {
			var tex = this.modell.getTexID(t);
			if (tex == 0 || tex == undefined)
				continue;
			var teximg = this.textures[tex];
			if (!teximg.loaded)
				continue;
		//	console.log("Paint id: "+tex);

			this.paintQuad(this.modell.getData(t), teximg,
					this.textures[tex].width, this.textures[tex].height);
		} else {
			if (ft == false) {
				ft = true;
				d3 += (new Date()).getTime() - now;
				now = (new Date()).getTime();
			}
			var d = this.modell.getData(t);
			var di = 0;
			var len = this.modell.getNumberOfData(t);
			var tantf = this.modell.getTextAndFont(t);
			this.paintThing(d, di, len, tantf);
		}
	}
	d4 += (new Date()).getTime() - now;

	this.ctx.font = this.font;
	this.ctx.fillStyle = "#592b13";
	this.ctx.strokeStyle = "#592b13";
//	this.ctx.fillText("  fps: " + this.modell.getFps(), 4, 36);
//	this.ctx.fillText("  debug: " + debug, 4, 36);
};

function dec2hex(i) {
	return (i + 0x100).toString(16).substr(-2).toUpperCase();
}

function RGB2HTML(c) {
	var a = (c >>> 24) / 255;
	var r = ((c & 0x00FF0000) >> 16);
	var g = ((c & 0x0000FF00) >> 8);
	var b = ((c & 0x000000FF));
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};

View.prototype.update = function(timer) {
	this.paint();
};

View.prototype.loadTexture = function(name, w, h) {
	//var id = this.textures.length;
	var id= ++ntex;
	
	/*
	for (i in this.textures) {
		var tex= this.textures[i];
		//console.log("i: "+tex.name);
	
		if (tex.name == name && tex.width == w && tex.height == h) {
			tex.usage++;
			return i;
		}
	}
	*/
	
	var texture = new Image(w, h);
	texture.allTextures = this.textures;
	this.textures[id] = texture;
	texture.loaded = false;
	texture.width = w;
	texture.height = h;
	texture.name= name;
	
	texture.onload = function() {
		texture.loaded = true;
	//	texture.name= texname;
		var img = createOffScreenImage(texture.width, texture.height);
		var ctx = img.getContext('2d');
		ctx.drawImage(texture, 0, 0, texture.width, texture.height);
		img.loaded = true;
		img.usage = 1;
		texture.allTextures[id] = img;
		delete texture.allTextures;
	};
	texture.src = name;
//	console.log("loading tex: "+texture.name+ " "+w+" "+h +" "+id);

	return id;
};

View.prototype.min = function(f1, f2, f3, f4) {
	var ret = f1;
	ret = Math.min(ret, f2);
	ret = Math.min(ret, f3);
	ret = Math.min(ret, f4);
	return ret;
};

View.prototype.max = function(f1, f2, f3, f4) {
	var ret = f1;
	ret = Math.max(ret, f2);
	ret = Math.max(ret, f3);
	ret = Math.max(ret, f4);
	return ret;
};

View.prototype.up = function(e) {
	if(touchevent)
		return;
	
	e.preventDefault();
	var event;
	if (e.touches != undefined) {
		event = e.touches[0];
	} else {
		event = e;
	}

	var x = event.clientX;
	var y = event.clientY;
	this.modell.touchStop(x, y);
};

View.prototype.touchup = function(e) {
	debug= "up ";
/*
	e.preventDefault();
	var event;
	if (e.touches != undefined) {
		event = e.touches[0];
	} else {
		event = e;
	}
*/
	var x = e.clientX;
	var y = e.clientY;
	debug= "up " +x+" "+y;

	this.modell.touchStop(x, y);
};

View.prototype.touchdown = function(e) {
	//alert("touchdown");
	//e.preventDefault();
	debug="touch down";
	touchevent= true;
	this.down(e);
}
View.prototype.down = function(e) {
	debug="down ";
	e.preventDefault();
	var event;
	if (e.touches != undefined) {
		event = e.touches[0];
	} else {
		event = e;
	}

	var x = event.clientX;
	var y = event.clientY;
	this.modell.touchStart(x, y);
};

View.prototype.move = function(e) {
	debug="move ";
	
//	alert('move: '+e); 
	e.preventDefault();
	var event;

	if (e.touches != undefined) {
		event = e.touches[0];
	} else {
		event = e;
	}
//	alert('move: '+event); 

	var x = event.clientX;
	var y = event.clientY;
	debug="move "+x+" "+y;

	this.modell.touch(x, y);
};

