function MyTimer(listener) {
	this.timerListener = listener;
	this.stopped = false;
}

MyTimer.prototype.start = function(timeout) {
	this.timeout = timeout;
	this.stopped = false;
	this.counter = 0;
	setTimeout(makeTimer(this.timerListener, this), this.timeout);
};

MyTimer.prototype.stop = function() {
	this.stopped = true;
};

MyTimer.prototype.getCounter = function() {
	return this.counter;
};

MyTimer.prototype.counterIsOdd = function() {
	if (this.counter % 2 == 1)
		return true;
	return false;
};

function makeTimer(l, t) {
	var listener = l;
	var timer = t;
	return function() {
		t.counter++;
		listener(t);
		if (!timer.stopped)
			setTimeout(makeTimer(l, timer), timer.timeout);
	};
}
