var PART = 0;
var BONE = 1;
var RECTANGLE = 2;
var QUAD = 3;
var IMAGE= 3;
var THING = 4;
var ELLIPSE = 15;
var TRIANGLE = 28;
var BOUNDINGCIRCLE = 25;
var TRIANGLE = 28;
var POINT = 38;
var MUSTANG = 105;
var SIOUX = 101;
var ARROW = 102;
var PARTANIMATION = 6;
var COMPOSITEANIMATION = 7;
var TATANKAANIMATION = 106;
var TATANKA= 103;
var LOOP= 83;
var SIOUXWITHROPE= 84;
var ROPE= 104;
var THINGCONTAINER= 86;
var LAKOTAANIMATION= 87;
var TEXT= 112;
var LINE= 113;



function LOG(text) {
	var LOGENTRIES=  localStorage.LOGENTRIES;
	if(LOGENTRIES== undefined) 
		LOGENTRIES= 0;
	if(LOGENTRIES>= 2048) {
		LOGENTRIES= 0;
	}
	eval("localStorage.LOG"+LOGENTRIES+"='"+text+" @" + new Date()+"'");
	LOGENTRIES++;
	localStorage.LOGENTRIES= LOGENTRIES;
}

function Console() {
}

Console.prototype.log = function(text) {
	LOG(text);
};

//var console= new Console();

var mycos = new Array(1.0, 0.9998477, 0.99939084, 0.9986295, 0.9975641,
		0.9961947, 0.9945219, 0.99254614, 0.99026805, 0.98768836, 0.9848077,
		0.98162717, 0.9781476, 0.97437006, 0.9702957, 0.9659258, 0.9612617,
		0.9563047, 0.95105654, 0.94551855, 0.9396926, 0.9335804, 0.92718387,
		0.92050487, 0.9135454, 0.9063078, 0.89879405, 0.8910065, 0.88294756,
		0.8746197, 0.8660254, 0.8571673, 0.8480481, 0.83867055, 0.82903755,
		0.81915206, 0.809017, 0.7986355, 0.7880108, 0.777146, 0.76604444,
		0.7547096, 0.7431448, 0.7313537, 0.7193398, 0.70710677, 0.6946584,
		0.6819984, 0.6691306, 0.656059, 0.64278764, 0.6293204, 0.6156615,
		0.60181504, 0.58778524, 0.57357645, 0.5591929, 0.54463905, 0.52991927,
		0.5150381, 0.5, 0.4848096, 0.46947157, 0.4539905, 0.43837115,
		0.42261827, 0.40673664, 0.39073113, 0.37460658, 0.35836795, 0.34202015,
		0.32556817, 0.309017, 0.2923717, 0.27563736, 0.25881904, 0.2419219,
		0.22495106, 0.20791169, 0.190809, 0.17364818, 0.15643446, 0.1391731,
		0.12186934, 0.104528464, 0.087155744, 0.06975647, 0.052335955,
		0.034899496, 0.017452406, 6.123234E-17, -0.017452406, -0.034899496,
		-0.052335955, -0.06975647, -0.087155744, -0.104528464, -0.12186934,
		-0.1391731, -0.15643446, -0.17364818, -0.190809, -0.20791169,
		-0.22495106, -0.2419219, -0.25881904, -0.27563736, -0.2923717,
		-0.309017, -0.32556817, -0.34202015, -0.35836795, -0.37460658,
		-0.39073113, -0.40673664, -0.42261827, -0.43837115, -0.4539905,
		-0.46947157, -0.4848096, -0.5, -0.5150381, -0.52991927, -0.54463905,
		-0.5591929, -0.57357645, -0.58778524, -0.60181504, -0.6156615,
		-0.6293204, -0.64278764, -0.656059, -0.6691306, -0.6819984, -0.6946584,
		-0.70710677, -0.7193398, -0.7313537, -0.7431448, -0.7547096,
		-0.76604444, -0.777146, -0.7880108, -0.7986355, -0.809017, -0.81915206,
		-0.82903755, -0.83867055, -0.8480481, -0.8571673, -0.8660254,
		-0.8746197, -0.88294756, -0.8910065, -0.89879405, -0.9063078,
		-0.9135454, -0.92050487, -0.92718387, -0.9335804, -0.9396926,
		-0.94551855, -0.95105654, -0.9563047, -0.9612617, -0.9659258,
		-0.9702957, -0.97437006, -0.9781476, -0.98162717, -0.9848077,
		-0.98768836, -0.99026805, -0.99254614, -0.9945219, -0.9961947,
		-0.9975641, -0.9986295, -0.99939084, -0.9998477, -1.0, -0.9998477,
		-0.99939084, -0.9986295, -0.9975641, -0.9961947, -0.9945219,
		-0.99254614, -0.99026805, -0.98768836, -0.9848077, -0.98162717,
		-0.9781476, -0.97437006, -0.9702957, -0.9659258, -0.9612617,
		-0.9563047, -0.95105654, -0.94551855, -0.9396926, -0.9335804,
		-0.92718387, -0.92050487, -0.9135454, -0.9063078, -0.89879405,
		-0.8910065, -0.88294756, -0.8746197, -0.8660254, -0.8571673,
		-0.8480481, -0.83867055, -0.82903755, -0.81915206, -0.809017,
		-0.7986355, -0.7880108, -0.777146, -0.76604444, -0.7547096, -0.7431448,
		-0.7313537, -0.7193398, -0.70710677, -0.6946584, -0.6819984,
		-0.6691306, -0.656059, -0.64278764, -0.6293204, -0.6156615,
		-0.60181504, -0.58778524, -0.57357645, -0.5591929, -0.54463905,
		-0.52991927, -0.5150381, -0.5, -0.4848096, -0.46947157, -0.4539905,
		-0.43837115, -0.42261827, -0.40673664, -0.39073113, -0.37460658,
		-0.35836795, -0.34202015, -0.32556817, -0.309017, -0.2923717,
		-0.27563736, -0.25881904, -0.2419219, -0.22495106, -0.20791169,
		-0.190809, -0.17364818, -0.15643446, -0.1391731, -0.12186934,
		-0.104528464, -0.087155744, -0.06975647, -0.052335955, -0.034899496,
		-0.017452406, -1.8369701E-16, 0.017452406, 0.034899496, 0.052335955,
		0.06975647, 0.087155744, 0.104528464, 0.12186934, 0.1391731,
		0.15643446, 0.17364818, 0.190809, 0.20791169, 0.22495106, 0.2419219,
		0.25881904, 0.27563736, 0.2923717, 0.309017, 0.32556817, 0.34202015,
		0.35836795, 0.37460658, 0.39073113, 0.40673664, 0.42261827, 0.43837115,
		0.4539905, 0.46947157, 0.4848096, 0.5, 0.5150381, 0.52991927,
		0.54463905, 0.5591929, 0.57357645, 0.58778524, 0.60181504, 0.6156615,
		0.6293204, 0.64278764, 0.656059, 0.6691306, 0.6819984, 0.6946584,
		0.70710677, 0.7193398, 0.7313537, 0.7431448, 0.7547096, 0.76604444,
		0.777146, 0.7880108, 0.7986355, 0.809017, 0.81915206, 0.82903755,
		0.83867055, 0.8480481, 0.8571673, 0.8660254, 0.8746197, 0.88294756,
		0.8910065, 0.89879405, 0.9063078, 0.9135454, 0.92050487, 0.92718387,
		0.9335804, 0.9396926, 0.94551855, 0.95105654, 0.9563047, 0.9612617,
		0.9659258, 0.9702957, 0.97437006, 0.9781476, 0.98162717, 0.9848077,
		0.98768836, 0.99026805, 0.99254614, 0.9945219, 0.9961947, 0.9975641,
		0.9986295, 0.99939084, 0.9998477);
var mysin = new Array(0.0, 0.017452406, 0.034899496, 0.052335955, 0.06975647,
		0.087155744, 0.104528464, 0.12186934, 0.1391731, 0.15643446,
		0.17364818, 0.190809, 0.20791169, 0.22495106, 0.2419219, 0.25881904,
		0.27563736, 0.2923717, 0.309017, 0.32556817, 0.34202015, 0.35836795,
		0.37460658, 0.39073113, 0.40673664, 0.42261827, 0.43837115, 0.4539905,
		0.46947157, 0.4848096, 0.5, 0.5150381, 0.52991927, 0.54463905,
		0.5591929, 0.57357645, 0.58778524, 0.60181504, 0.6156615, 0.6293204,
		0.64278764, 0.656059, 0.6691306, 0.6819984, 0.6946584, 0.70710677,
		0.7193398, 0.7313537, 0.7431448, 0.7547096, 0.76604444, 0.777146,
		0.7880108, 0.7986355, 0.809017, 0.81915206, 0.82903755, 0.83867055,
		0.8480481, 0.8571673, 0.8660254, 0.8746197, 0.88294756, 0.8910065,
		0.89879405, 0.9063078, 0.9135454, 0.92050487, 0.92718387, 0.9335804,
		0.9396926, 0.94551855, 0.95105654, 0.9563047, 0.9612617, 0.9659258,
		0.9702957, 0.97437006, 0.9781476, 0.98162717, 0.9848077, 0.98768836,
		0.99026805, 0.99254614, 0.9945219, 0.9961947, 0.9975641, 0.9986295,
		0.99939084, 0.9998477, 1.0, 0.9998477, 0.99939084, 0.9986295,
		0.9975641, 0.9961947, 0.9945219, 0.99254614, 0.99026805, 0.98768836,
		0.9848077, 0.98162717, 0.9781476, 0.97437006, 0.9702957, 0.9659258,
		0.9612617, 0.9563047, 0.95105654, 0.94551855, 0.9396926, 0.9335804,
		0.92718387, 0.92050487, 0.9135454, 0.9063078, 0.89879405, 0.8910065,
		0.88294756, 0.8746197, 0.8660254, 0.8571673, 0.8480481, 0.83867055,
		0.82903755, 0.81915206, 0.809017, 0.7986355, 0.7880108, 0.777146,
		0.76604444, 0.7547096, 0.7431448, 0.7313537, 0.7193398, 0.70710677,
		0.6946584, 0.6819984, 0.6691306, 0.656059, 0.64278764, 0.6293204,
		0.6156615, 0.60181504, 0.58778524, 0.57357645, 0.5591929, 0.54463905,
		0.52991927, 0.5150381, 0.5, 0.4848096, 0.46947157, 0.4539905,
		0.43837115, 0.42261827, 0.40673664, 0.39073113, 0.37460658, 0.35836795,
		0.34202015, 0.32556817, 0.309017, 0.2923717, 0.27563736, 0.25881904,
		0.2419219, 0.22495106, 0.20791169, 0.190809, 0.17364818, 0.15643446,
		0.1391731, 0.12186934, 0.104528464, 0.087155744, 0.06975647,
		0.052335955, 0.034899496, 0.017452406, 1.2246469E-16, -0.017452406,
		-0.034899496, -0.052335955, -0.06975647, -0.087155744, -0.104528464,
		-0.12186934, -0.1391731, -0.15643446, -0.17364818, -0.190809,
		-0.20791169, -0.22495106, -0.2419219, -0.25881904, -0.27563736,
		-0.2923717, -0.309017, -0.32556817, -0.34202015, -0.35836795,
		-0.37460658, -0.39073113, -0.40673664, -0.42261827, -0.43837115,
		-0.4539905, -0.46947157, -0.4848096, -0.5, -0.5150381, -0.52991927,
		-0.54463905, -0.5591929, -0.57357645, -0.58778524, -0.60181504,
		-0.6156615, -0.6293204, -0.64278764, -0.656059, -0.6691306, -0.6819984,
		-0.6946584, -0.70710677, -0.7193398, -0.7313537, -0.7431448,
		-0.7547096, -0.76604444, -0.777146, -0.7880108, -0.7986355, -0.809017,
		-0.81915206, -0.82903755, -0.83867055, -0.8480481, -0.8571673,
		-0.8660254, -0.8746197, -0.88294756, -0.8910065, -0.89879405,
		-0.9063078, -0.9135454, -0.92050487, -0.92718387, -0.9335804,
		-0.9396926, -0.94551855, -0.95105654, -0.9563047, -0.9612617,
		-0.9659258, -0.9702957, -0.97437006, -0.9781476, -0.98162717,
		-0.9848077, -0.98768836, -0.99026805, -0.99254614, -0.9945219,
		-0.9961947, -0.9975641, -0.9986295, -0.99939084, -0.9998477, -1.0,
		-0.9998477, -0.99939084, -0.9986295, -0.9975641, -0.9961947,
		-0.9945219, -0.99254614, -0.99026805, -0.98768836, -0.9848077,
		-0.98162717, -0.9781476, -0.97437006, -0.9702957, -0.9659258,
		-0.9612617, -0.9563047, -0.95105654, -0.94551855, -0.9396926,
		-0.9335804, -0.92718387, -0.92050487, -0.9135454, -0.9063078,
		-0.89879405, -0.8910065, -0.88294756, -0.8746197, -0.8660254,
		-0.8571673, -0.8480481, -0.83867055, -0.82903755, -0.81915206,
		-0.809017, -0.7986355, -0.7880108, -0.777146, -0.76604444, -0.7547096,
		-0.7431448, -0.7313537, -0.7193398, -0.70710677, -0.6946584,
		-0.6819984, -0.6691306, -0.656059, -0.64278764, -0.6293204, -0.6156615,
		-0.60181504, -0.58778524, -0.57357645, -0.5591929, -0.54463905,
		-0.52991927, -0.5150381, -0.5, -0.4848096, -0.46947157, -0.4539905,
		-0.43837115, -0.42261827, -0.40673664, -0.39073113, -0.37460658,
		-0.35836795, -0.34202015, -0.32556817, -0.309017, -0.2923717,
		-0.27563736, -0.25881904, -0.2419219, -0.22495106, -0.20791169,
		-0.190809, -0.17364818, -0.15643446, -0.1391731, -0.12186934,
		-0.104528464, -0.087155744, -0.06975647, -0.052335955, -0.034899496,
		-0.017452406);

function calcPhi(phi) {
	phi = Math.round(phi);
	while (phi < 0)
		phi += 360;
	return Math.floor(phi %= 360);
}

function Part() {
	this.partinit();
}

Part.prototype.partinit = function() {
	this.rsx = this.rsy = this.sx = this.sy = 1.0;
	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;
	this.rot = 0.0;
	this.a = 0;
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.rx = 0.0;
	this.ry = 0.0;
	this.rz = 0.0;
	this.rrot = 0.0;
	this.invaliddata = true;
	this.highlighted = false;

	this.tx_rsx = this.tx_rsy = this.tx_sx = this.tx_sy = 1.0;
	this.tx_x = 0.0;
	this.tx_y = 0.0;
	this.tx_z = 0.0;
	this.tx_rot = 0.0;
	this.tx_a = 0;
	this.tx_r = 0;
	this.tx_g = 0;
	this.tx_b = 0;
	this.tx_rx = 0.0;
	this.tx_ry = 0.0;
	this.tx_rz = 0.0;
	this.tx_rrot = 0.0;
	this.tx_invaliddata = true;
	this.tx_highlighted = false;
	this.tx_type= this.getType();
	this.tx_name= "";
	this.intransaction= false;
	this.coordtap= null;
	this.supTX= true;
};

Part.prototype.setTXSupport= function(b) {
	this.supTX= b;
};

Part.prototype.supportsTX= function() {
	return this.supTX;
};

Part.prototype.canHaveChilds = function() {
	return false;
};

Part.prototype.setName= function(n) {
	this.name= n;
};

Part.prototype.getName= function() {
	return this.name;
};

Part.prototype.setCoordinateTap= function(callback) {
	this.coordtap= callback;
};

Part.prototype.getCoordinateTap= function(callback) {
	return this.coordtap;
};

Part.prototype.saveState = function() {
	return "PART|"+this.tx_type+"|"+this.tx_name+"|"+this.tx_rsx+"||";
};

Part.prototype.loadState= function(state) {
	
};

Part.prototype.partBeginTX = function() {
	if(this.intransaction) {
		throw new Exception("Already in transaction: "+this.name);
	}
	this.intransaction= true;
	this.tx_type= this.getType();
	if(this.name== undefined && this.name!= null)
		this.tx_name= "";
	else
		this.tx_name= this.name;
	this.tx_rsx = this.rsx;
	this.tx_rsy = this.rsy;
	this.tx_sx = this.sx;
	this.tx_sy = this.sy;
	this.tx_x = this.x;
	this.tx_y = this.y;
	this.tx_z = this.z;
	this.tx_rot = this.rot;
	this.tx_a = this.a;
	this.tx_r = this.r;
	this.tx_g = this.g;
	this.tx_b = this.b;
	this.tx_rx = this.rx;
	this.tx_ry = this.ry;
	this.tx_rz = this.rz;
	this.tx_rrot = this.rrot;
	this.tx_invaliddata = this.invaliddata;
	this.tx_highlighted = this.highlighted;
};

Part.prototype.commitTX = function() {
	this.partCommitTX();
};

Part.prototype.beginTX = function() {
	this.partBeginTX();
};

Part.prototype.rollbackTX = function() {
	this.partRollbackTX();
};

Part.prototype.partCommitTX = function() {
	if(!this.intransaction) {
		throw new Exception("Can not commit: Not in transaction: "+this.name);
	}
	this.intransaction= false;
};

Part.prototype.partRollbackTX = function() {
	if(!this.intransaction) {
		throw new Exception("Can not rollback: Not in transaction: "+this.name);
	}
	this.intransaction= false;
	
	this.rsx = this.tx_rsx;
	this.rsy = this.tx_rsy;
	this.sx = this.tx_sx;
	this.sy = this.tx_sy;
	this.x = this.tx_x;
	this.y = this.tx_y;
	this.z = this.tx_z;
	this.rot = this.tx_rot;
	this.a = this.tx_a;
	this.r = this.tx_r;
	this.g = this.tx_g;
	this.b = this.tx_b;
	this.rx = this.tx_rx;
	this.ry = this.tx_ry;
	this.rz = this.tx_rz;
	this.rrot = this.tx_rrot;
	this.name= this.tx_name;
	this.invaliddata = this.tx_invaliddata;
	this.highlighted = this.tx_highlighted;
};

Part.prototype.getNumberOfTextAndFont = function() {
	return 0; 
};

Part.prototype.getTextAndFont = function(t, startT) {
	return 0;
};

Part.prototype.getNumberOfData = function() {
	return 0; // type, n, color, data triangles*(x & y)
};

Part.prototype.setParent = function(bone) {
	this.parent = bone;
};

Part.prototype.invalidateData = function() {
	var i = this.invaliddata;
	this.invaliddata = true;
	if (!this.parent == undefined)
		this.parent.invalidateData();
	return i;
};

Part.prototype.setRoot = function(x, y, z, r) {

	this.invalidateData();
	this.rx = x;
	this.ry = y;
	this.rz = z;
	this.rrot = r;
};

Part.prototype.setColor = function(c) {

	this.invalidateData();
	this.a = (c >>> 24);
	this.r = ((c & 0x00FF0000) >> 16);
	this.g = ((c & 0x0000FF00) >> 8);
	this.b = ((c & 0x000000FF));
};

Part.prototype.setAlpha = function(alpha) {
	this.invalidateData();
	this.a = alpha;
};

Part.prototype.scale = function(x, y) {
	this.invalidateData();
	this.sx *= x;
	this.sy *= y;
};

Part.prototype.scaleRoot = function(x, y) {
	this.invalidateData();
	this.rsx *= x;
	this.rsy *= y;
};


Part.prototype.rotateRoot = function(r) {
	this.invalidateData();
	this.rrot+= r;
};

Part.prototype.clearScale = function() {

	this.invalidateData();
	this.sx = this.sy = 1.0;
};

Part.prototype.translate = function(tx, ty, tz) {

	this.invalidateData();
	this.x += tx;
	this.y += ty;
	this.z += tz;
};

Part.prototype.translateRoot = function(tx, ty, tz) {
	this.invalidateData();
	this.rx += tx;
	this.ry += ty;
	this.rz += tz;
};

Part.prototype.clearTranslation = function() {
	this.invalidateData();
	this.x = this.y = this.z = 0;
};

Part.prototype.rotate = function(r) {
	this.rot += r;
	while (this.rot < 0.0) {
		this.rot += 360.0;
	}
	while (this.rot >= 360.0) {
		this.rot -= 360.0;
	}
	this.invalidateData();

};

Part.prototype.clearRotation = function() {
	this.invalidateData();
	this.rot = 0;
};

Part.prototype.highlight = function(bin) {

	this.invalidateData();
	if (bin && !this.highlighted) {
		this.ored = this.r;
		this.og = this.g;
		this.ob = this.b;
		this.r = ((1.3 * this.r > 255.0 ? 255.0 : 1.3 * this.r) > 0.3 * 255 ? (1.3 * this.r > 255.0 ? 255.0
				: 1.3 * this.r)
				: 0.3 * 255);
		this.g = ((1.3 * this.g > 255.0 ? 255.0 : 1.3 * this.g) > 0.3 * 255 ? (1.3 * this.g > 255.0 ? 255.0
				: 1.3 * this.g)
				: 0.3 * 255);
		this.b = ((1.3 * 0.3 * 255 > 255.0 ? 255.0 : 1.3 * 0.3 * 255) > 0.3 * 255 ? (1.3 * 0.3 * 255 > 255.0 ? 255.0
				: 1.3 * 0.3 * 255)
				: 0.3 * 255);
		this.highlighted = true;
	} else {
		if (!bin && this.highlighted) {
			this.r = this.ored;
			this.g = this.og;
			this.b = this.ob;
			this.highlighted = false;
		}
	}
};

Part.prototype.clearAll = function() {
	this.clearTranslation();
	this.clearScale();
	this.clearRotation();
};

Part.prototype.getType = function() {
	return PART;
};

Part.prototype.partreset = function() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.rot = 0;
	this.sx = 1.0;
	this.sy = 1.0;
	this.invalidateData();
};

