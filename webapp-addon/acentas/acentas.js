var MAXWIDGETS = 20;
var MAXXWIDGETS = 10;
var MAXYWIDGETS = 5;
var THINGSINCONTAINER = 7;
var WIDGETWIDTH= 360;
var WIDGETHEIGHT= 520;
var ws;

var touchstart = -1;
var lastthingtouched = -1;
var zoomed = -1;
var prezoomx;
var prezoomy;
var zoomuser;

var delay = 1000;
var minutes = 3;
var datapointsperbucket = 1;
var nbuckets = minutes * 60 / datapointsperbucket;
// immer alle buckets vorhanden, line -1000, -1000

function moveLeft(buckets) {
//	console.log("Move left...");
	for(var i= 1; i< nbuckets; i++) {
		buckets[i-1].n= buckets[i].n;
		buckets[i-1].value= buckets[i].value;		
	}
	cleanBucket(buckets[nbuckets-1]);
}
function calcLines(buckets, parts, n) {
//	console.log(n+" "+parts);
	var sy= 313;
	var w= 252/(nbuckets-1);
	var startX= -126;
	for(var b= 0; b<nbuckets-1; b++) {
		var i= nbuckets-1-b;
	//	console.log("i: "+i);
		var x1= startX+i*w;
		var y1= sy- Math.max(Math.min(0.8*200, 0.8*buckets[i].value), 0.8*60);
		var x2= startX+(i-1)*w;
		var y2= sy- Math.max(Math.min(0.8*200,0.8*buckets[i-1].value), 0.8*60);
		if(buckets[i].value== 0 || buckets[i-1].value== 0) {
			x1= 4000000;
			x2= 4000000;
		}
		parts[n+i-1].setPoints(x1, y1, x2, y2);
	}
}

function cleanBucket(bucket) {
		bucket.value= 0;
		bucket.n= 0;		
}

function addToBucket(bucket, val) {
	bucket.value= (bucket.n*bucket.value+ val)/(bucket.n+1);
	bucket.n++;
}

function fetchData() {
	req = false;
	// branch for native XMLHttpRequest object
	var url= "sessions/running";
	if(server!= undefined  && server!= null && server.length>8)
		url = "http://"+server+"/sessions/running";
	console.log("Load url: " + url);
	if (window.XMLHttpRequest) {
		try {
			req = new XMLHttpRequest();
		} catch (e) {
			req = false;
		}
		// branch for IE/Windows ActiveX version
	} else {
		if (window.ActiveXObject) {
			try {
				req = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					req = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					req = false;
				}
			}
		}
	}
	if (req) {
		req.onreadystatechange = processData;
		req.open("GET", url, true);
		req.send("");
	} else {
		alert("req== false");
	}

}

function processData() {

	if (req.readyState != 4)
		return;

	// ...processing statements go here...
	var response = req.responseText;
	var session;
	
	try {
		session= JSON.parse(response);
	}
	catch(ex) {
		setTimeout("fetchData()", 100);
	}
	for ( var i = 0; i < MAXWIDGETS; i++) {
		if (i < session.users.length) {
			if (zoomed == -1 || (zoomed >= 0 && i == zoomed)) {
				biz.widgets[i].setVisibility(true);
			}
		} else {
			biz.widgets[i].setVisibility(false);
			continue;
		}

		var hr = session.users[i].hr;
		// console.log(i+ " "+ hr);
		
		biz.widgets[i].things[0].zone1end= session.users[i].aZone1end;
		biz.widgets[i].things[0].zone2end= session.users[i].aZone2end;
		biz.widgets[i].things[0].zone3end= session.users[i].aZone3end;
		biz.widgets[i].things[0].zone4end= session.users[i].aZone4end;
		
		biz.widgets[i].things[0].setHR(hr);
		biz.widgets[i].things[0].texts[0].setText(session.users[i].name);
		biz.widgets[i].things[0].texts[2].setText(session.users[i].acentasPercentage);
		
		if(session.users[i].lowbattery== 0)
			biz.widgets[i].things[2].visible= false;
		for(var si= 1; si<= 4; si++) {
			biz.widgets[i].things[2+si].visible= false;
		}
		if((zoomed>= 0 && i == zoomed) || zoomed== -1)	
			biz.widgets[i].things[2 + session.users[i].signalstrength].visible = true;
		biz.widgets[i].things[0].rects[1].setColor(0xFF000000+session.users[i].acentasColor);
		if(zoomuser== session.users[i].name) {
			biz.zoomMe(zoomuser);
			zoomuser= "-1";
		}
	}
	setTimeout("fetchData()", delay);
}

function BizAndSportsModell() {
	this.newdata = false;
}

BizAndSportsModell.prototype = new Modell(64);

BizAndSportsModell.prototype.setup = function() {
	console.log("scale: " + scale + " w: " + width + " h: " + height);
	this.widgets = new Array(MAXWIDGETS);
		
	ws= (width/WIDGETWIDTH*WIDGETHEIGHT + height)/(WIDGETHEIGHT*MAXWIDGETS+ 2*WIDGETHEIGHT)
	
	var nx= Math.ceil(width/WIDGETWIDTH/ws);
	var ny= Math.ceil((height-2*WIDGETHEIGHT*ws)/WIDGETHEIGHT/ws);
	console.log("nx: "+nx+ " ny: "+ny+ " ws: "+ws+" nx+ny: "+(nx+ny));

	ws= Math.min(width/nx/WIDGETWIDTH, (height-2*WIDGETHEIGHT*ws)/ny/WIDGETHEIGHT);
	nx= Math.floor(width/WIDGETWIDTH/ws);
	ny= Math.floor((height-2*WIDGETHEIGHT*ws)/WIDGETHEIGHT/ws);
	
	console.log("nx: "+nx+ " ny: "+ny+ " ws: "+ws+" nx+ny: "+(nx+ny));
	var n= 0;
	var lx= 0, ly= 0;
	lx= -w2+WIDGETWIDTH*ws;
	for ( var y = 0; y < Math.floor(ny/2); y++) {
		ly= -h2+2*WIDGETHEIGHT*ws+y*(height- 2*ws*WIDGETHEIGHT)/ny*2;
		this.widgets[n] = new WidgetWithIcon("Belt"+(n+1), lx, ly, ws);
	//	this.widgets[n].scale(ws, ws);
		this.widgets[n].setVisibility(false);
		n++;
	}
	
	for ( var x = 0; x < Math.floor(nx/2); x++) {
		lx= x*width/Math.floor(nx/2)-w2+WIDGETWIDTH*ws;
		this.widgets[n] = new WidgetWithIcon("Belt"+(n+1), lx, h2-ws*WIDGETHEIGHT,  ws);
	//	this.widgets[n].scale(ws, ws);
		this.widgets[n].setVisibility(false);
		n++;
	}
	
	for ( var y = Math.floor(ny/2)-1; y >= 0; y--) {
		this.widgets[n] = new WidgetWithIcon("Belt"+(n+1), w2-WIDGETWIDTH*ws, ly- (Math.floor(ny/2-1)-y)*2*WIDGETHEIGHT*ws, ws);
	//	this.widgets[n].scale(ws, ws);
		this.widgets[n].setVisibility(false);
		n++;
	}
	
	for ( var x = Math.floor(nx/2)-1; x >= 0; x--) {
		this.widgets[n] = new WidgetWithIcon("Belt"+(n+1), lx- Math.floor(((nx/2-1))-x)*width/nx*2, -h2+WIDGETHEIGHT*ws, ws);
	//	this.widgets[n].scale(ws, ws);
		this.widgets[n].setVisibility(false);
		n++;
	}

	var pos = 0;
	for ( var layer = 0; layer < 1000; layer++) {
		for ( var j = 0; j < MAXWIDGETS; j++) {
			pos += this.widgets[j].addThings(allThings, pos, layer);
		}
	}
	numberOfThings = pos;
	console.log("NumberOfThings: " + numberOfThings);
	this.fr = 0;

	setTimeout("fetchData()", 100);
};

BizAndSportsModell.prototype.update = function(currentTimeMillis) {
	if (this.fr % 10 == 1) {
		// allThings[50].scale(1.05, 1.05);
	}
	this.fr++;
	this.modellupdate(currentTimeMillis);
	for ( var i = 0; i < numberOfThings; i++) {
		if (allThings[i] instanceof Widget)
			allThings[i].update();
	}
};

BizAndSportsModell.prototype.touch = function(x, y) {
	for ( var i = 0; i < numberOfThings; i++) {
		if (allThings[i].dragged) {
			//alert("dragged!");
			
			this.widgets[i / THINGSINCONTAINER].translate(-allThings[i].x + x - w2,
					-allThings[i].y + y - h2);
			return;
		}
	}
};

BizAndSportsModell.prototype.touchStart = function(x, y) {

	// console.log("touch: "+(x-w2)+" "+(y-h2));
	for ( var i = 0; i < numberOfThings; i++) {
		if (allThings[i].isIn(x - w2, y - h2)) {
			
			if (i == lastthingtouched
					&& new Date().getTime() - touchstart < 1000) {
				var w= Math.floor(i/THINGSINCONTAINER);
	//			console.log(w);
				this.zoomMe(this.widgets[w].things[0].texts[0].getText());

			} else {
				allThings[i].dragged = true;
			//	alert("drag start");
			}
			lastthingtouched = i;
			touchstart = new Date().getTime();
		}
	}
};

BizAndSportsModell.prototype.touchStop = function(x, y) {
	for ( var i = 0; i < numberOfThings; i++) {
		allThings[i].dragged = false;
	}
};

BizAndSportsModell.prototype.zoomIn = function(x, y) {
	for ( var i = 0; i < MAXWIDGETS; i++) {
		biz.widgets[i].scale(1.1, 1.1);
	}
};

BizAndSportsModell.prototype.zoomOut = function(x, y) {
	for ( var i = 0; i < MAXWIDGETS; i++) {
		biz.widgets[i].scale(1/1.1, 1/1.1);
	}
};

BizAndSportsModell.prototype.zoomMe = function(name) {
	var s= Math.min(width*0.8/ws/2/WIDGETWIDTH, height*0.8/ws/2/WIDGETHEIGHT);
	
	
	
	for ( var i = 0; i < MAXWIDGETS; i++) {
		if(biz.widgets[i].things[0].texts[0].getText()== name) {
			if (zoomed == -1) {
				zoomed = i;
				prezoomx= -allThings[i*THINGSINCONTAINER].x;
				prezoomy= -allThings[i*THINGSINCONTAINER].y;
				this.widgets[i].things[0].zoom(true);
				
				this.widgets[i].translate(prezoomx,
						prezoomy);
				this.widgets[i].scale(s, s);
					
				for ( var j = 0; j < MAXWIDGETS; j++) {
					if (i != j)
						this.widgets[j].setVisibility(false);
				}
			}
			else {
				zoomed = -1;
				this.widgets[i].scale(1/s, 1/s);
				this.widgets[i].things[0].zoom(false);

				for ( var j = 0; j < MAXWIDGETS; j++) {
					if (i  != j) {
					//	this.widgets[j].setVisibility(true);
					}
					else {
						this.widgets[i].translate(-prezoomx,
								-prezoomy);
					}
				}
			}
			return;
		}
	}
};

function WidgetWithIcon(text, x, y, s) {
	this.__setup(THINGSINCONTAINER);
	this.things[0] = new Widget(text);
	this.things[0].scale(2*s, 2*s);
	
	this.things[1] = new ImageThing("acentas/Studio herz 50.png", 24*2*s, 24*2*s);
//	this.things[1].scale(0.25, 0.25);
	this.things[1].translate(-120*s,	 -130*s, 0);
	
	this.things[2] = new ImageThing("imgs/battery_recharge.png", 2*30*s, 2*10*s);
	this.things[2].translate(-272*s,	 -275*s, 0);
	this.things[2].setVisibility(false);
	
	for(var si= 1; si<=4; si++) {
		this.things[2+si] = new ImageThing("imgs/sig-"+si+"-15px-hight.png", 2*25*s, 2*15*s);
		this.things[2+si].translate(282*s,	 -280*s, 0);
	}


	this.setupDone();
	this.translate(x, y);
}

WidgetWithIcon.prototype = new ThingContainer(2);

function Widget(text) {
	this.thinginit(10+nbuckets-1);
	this.coords = new CoordinateTap("WidgetCoords");
	this.setCoordinateTap(this.coords);
	this.ct = new Array(2);
	this.rects = new Array(2);
	this.texts = new Array(6);
	this.hr = 90;
	this.hrs = new Array();
	this.hrs[0] = this.hr;
	this.nhrs = 0;
	this.buckets = new Array(nbuckets);
	this.lastbucket= 0;
	for(var i= 0; i< nbuckets; i++) {
		this.buckets[i]= new Object();
		cleanBucket(this.buckets[i]);
	}


	this.updates = 0;
	var gray1 = 0x80575757;
	var gray2 = 0x80000000;
	var red1 = 0xA0AA0000;
	var hred = 0xFFFF0000;
	var Rot=  0xFFFF8A8A;
	var Gelb=  0xFFFFFF96;
	var Gruen = 0xFF8CFF9B;
	var Blau=  0xFF8CB9FF;
	var Grau=  0xFFDCDCDC;

	this.name = "Widget";
	this.rects[0] = new Rectangle();
	this.rects[0].init(320, 320, 0, 0, 0, 0, gray1);
	this.ct[0] = new CoordinateTap("Frame");
	this.rects[0].setCoordinateTap(this.ct[0]);
	this.add(this.rects[0]);

	this.rects[1] = new Rectangle();
	this.rects[1].init(220, 160, 0, 0, 0, 0, red1);
	this.rects[1].translate(15, 60, 0);
	
	this.rects[2] = new Rectangle();
	this.rects[2].init(32, 32, 0, 0, 0, 0, Rot);
	this.rects[2].translate(-110, -5, 0);
	
	this.rects[3] = new Rectangle();
	this.rects[3].init(32, 32, 0, 0, 0, 0, Gelb);
	this.rects[3].translate(-110, -5+32, 0);
	
	this.rects[4] = new Rectangle();
	this.rects[4].init(32, 32, 0, 0, 0, 0, Gruen);
	this.rects[4].translate(-110, -5+64, 0);
	
	this.rects[5] = new Rectangle();
	this.rects[5].init(32, 32, 0, 0, 0, 0, Blau);
	this.rects[5].translate(-110, -5+96, 0);
	
	this.rects[6] = new Rectangle();
	this.rects[6].init(32, 32, 0, 0, 0, 0, Grau);
	this.rects[6].translate(-110, -5+128, 0);
	
	this.ct[1] = new CoordinateTap("Body");
	this.rects[1].setCoordinateTap(this.ct[1]);
	this.add(this.rects[1]);
	this.add(this.rects[2]);
	this.add(this.rects[3]);
	this.add(this.rects[4]);
	this.add(this.rects[5]);
	this.add(this.rects[6]);	
	
	var it = 0;
	this.texts[it] = new Text();
	this.texts[it].init(text, 0, -108, 0xFFFFFFFF);
	this.texts[it].setFont("bold");
	this.texts[it].setSize(40);
	this.texts[it].translate(0, -10, 0);	
	this.add(this.texts[it]);

	it++;
	this.texts[it] = new Text();
	this.texts[it].translate(0, 1, 0);	
	this.texts[it].init("bpm", 48, -64, Grau);
	this.texts[it].setFont("bold");
	this.texts[it].setSize(18);
	this.texts[it].setAlignment(TEXT_LEFT);

	this.add(this.texts[it]);

	it++;
	this.texts[it] = new Text();
	this.texts[it].init("", 0, 60, 0xFF000000);
	this.texts[it].setFont("bold");
	this.texts[it].setSize(60);
	this.texts[it].setAlignment(TEXT_CENTER);
	this.add(this.texts[it]);

	it++;
	this.texts[it] = new Text();
	this.texts[it].init("%", 100, 70, 0xFF000000);
	this.texts[it].setFont("bold");
	this.texts[it].setSize(40);
	this.texts[it].setAlignment(TEXT_CENTER);
	this.add(this.texts[it]);

	it++;
	this.hrindex = it;
	this.texts[it] = new Text();
	this.texts[it].init("130", 0, -70, 0xFFFFFFFF);
	//this.texts[it].setFont("bold");
	this.texts[it].setSize(36);
	this.texts[it].setAlignment(TEXT_CENTER);
	this.add(this.texts[it]);

	it++;
	
	this.add(new Line(-127, 150, 126, 150, 1, 0, 0));
	this.add(new Line(-127, 266, 126, 266, 1, 0, 0));
	this.add(new Line(-127, 150, -127, 266, 1, 0, 0));
	this.add(new Line(126, 150, 126, 266, 1, 0, 0));
	
	var zone = new Rectangle();
	zone.init(302, 24, 0, 100, 0, 0, 0);
	this.add(zone);
	zone = new Rectangle();
	zone.init(302, 24, 0, 130, 0, 0, 0);
	this.add(zone);
	zone = new Rectangle();
	zone.init(302, 24, 0, 160, 0, 0, 0);
	this.add(zone);
	zone = new Rectangle();
	zone.init(302, 24, 0, 190, 0, 0, 0);
	this.add(zone);
	zone = new Rectangle();
	zone.init(302, 24, 0, 220, 0, 0, 0);
	this.add(zone);
	
	this.graphstart= this.pn; 
	for (var l= 0; l< nbuckets-1; l++) {
		this.add(new Line(400000, 400, -400, -400, 2, 0, 0xFF000000));
	}

	this.setupDone();
	this.zoom(false);

}

Widget.prototype = new Thing(1);

Widget.prototype.getType = function() {
	return ARROW;
};

Widget.prototype.isIn = function(x, y) {
	this.dragged = false;

	for ( var i = 0; i < 2; i++) {
		// console.log("xmin: "+this.ct[i].a11+" xmax: "+this.ct[i].a21+ " ymin:
		// "+this.ct[i].a12+" ymax: "+this.ct[i].a22);
		if (x >= this.ct[i].a11 && x <= this.ct[i].a21 && y >= this.ct[i].a12
				&& y <= this.ct[i].a22) {
			return true;
		}
	}
	return false;
};

Widget.prototype.setHR = function(hr) {
	this.texts[this.hrindex].setText(hr);
	this.hrs[this.nhrs] = hr;
	var curb= this.lastbucket;
	
	if(this.buckets[this.lastbucket].n== datapointsperbucket) {
		if(curb< nbuckets-1) {
			curb++;
		}
		else {
			calcLines(this.buckets, this.parts, this.graphstart);
			moveLeft(this.buckets);
		}
	}
	
	
	addToBucket(this.buckets[curb], hr);

	if(this.lastbucket!= curb)
		calcLines(this.buckets, this.parts, this.graphstart);

	this.lastbucket= curb; 

	this.nhrs++;
};

Widget.prototype.update = function() {
	this.updates++;

	/*
	 * if (this.updates % 10 == 1) { this.hr += -2 + getRandom(0, 4); }
	 */
};

Widget.prototype.zoom = function(on) {
	if (!on) {
		if(this.rects[0].y== 60) {
			this.rects[0].setDimension(320, 320);
			this.rects[0].translate(0, -60, 0);
			for(var i= 1; i< 10; i++) {
				this.parts[this.graphstart-i].setColor(0);
			}
		}
		this.pn = this.graphstart;
	} else {
		if(this.pn==21)
			this.pn+= nbuckets-1;
		this.rects[0].setDimension(320, 440);
		this.rects[0].translate(0, 60, 0);
		for(var i= 6; i< 10; i++) {
			this.parts[this.graphstart-i].setColor(0xFFFFFFFF);
		}
	
		var zh1= (this.zone1end-60)*0.8;
		this.parts[this.graphstart-1].translate(0, -this.parts[this.graphstart-1].ry-this.parts[this.graphstart-1].y, 0);
		this.parts[this.graphstart-1].translate(0, 265-zh1/2+1, 0);
		this.parts[this.graphstart-1].setDimension(252, zh1);		
		this.parts[this.graphstart-1].setColor(0xFFDCDCDC);

		var zh2= (this.zone2end-this.zone1end)*0.8;
		this.parts[this.graphstart-2].translate(0, -this.parts[this.graphstart-2].ry-this.parts[this.graphstart-2].y, 0);
		this.parts[this.graphstart-2].translate(0, 265-zh1-zh2/2+1, 0);
		this.parts[this.graphstart-2].setDimension(252, zh2);
		this.parts[this.graphstart-2].setColor(0xFF8CB9FF);

		var zh3= (this.zone3end-this.zone2end)*0.8;
		this.parts[this.graphstart-3].translate(0, -this.parts[this.graphstart-3].ry-this.parts[this.graphstart-3].y, 0);
		this.parts[this.graphstart-3].translate(0, 265-zh1-zh2-zh3/2+1, 0);
		this.parts[this.graphstart-3].setDimension(252, zh3);
		this.parts[this.graphstart-3].setColor(0xFF8CFF9B);

		var zh4= (this.zone4end-this.zone3end)*0.8;
		this.parts[this.graphstart-4].translate(0, -this.parts[this.graphstart-4].ry-this.parts[this.graphstart-4].y, 0);
		this.parts[this.graphstart-4].translate(0, 265-zh1-zh2-zh3-zh4/2+1, 0);
		this.parts[this.graphstart-4].setDimension(252, zh4);
		this.parts[this.graphstart-4].setColor(0xFFFFFF96);

		var zh5= (200-this.zone4end)*0.8;
		this.parts[this.graphstart-5].translate(0, -this.parts[this.graphstart-5].ry-this.parts[this.graphstart-5].y, 0);
		this.parts[this.graphstart-5].translate(0, 265-zh1-zh2-zh3-zh4-zh5/2+1, 0);
		this.parts[this.graphstart-5].setDimension(252, zh5);
		this.parts[this.graphstart-5].setColor(0xFFFF8A8A);

	}
	this.setupDone();
};

