var controllerOptions = {};

//x = window.innerWidth/2;
//y = window.innerHeight/2;

rawXMin = 100;
rawXMax = 10;
rawYMin = 100;
rawYMax = 10;

function HandleFrame(frame) {
	if (frame.hands.length < 2 && frame.hands.length > 0) {
		var hand = frame.hands[0];
		HandleHand(hand);
	};
	/*var rand_up = Math.floor(Math.random() * (3) ) + -1;
	var rand_side = Math.floor(Math.random() * (3) ) + -1;
	circle(x+rand_side,y+rand_up,100);*/
};

function HandleHand(hand) {
	var fingers = hand.fingers;
	hand.fingers.forEach(function(finger) {
		HandleFinger(finger);
	});
};

function HandleFinger(finger) {
	if (finger.type == 1) {
		tip = finger.tipPosition;
		x = tip[0];
		y = tip[1];
		z = tip[2];

		if (x < rawXMin) {
			rawXMin = x;	
		};

		if (x > rawXMax) {
			rawXMax = x;
		};

		if (y < rawYMax) {
			rawYMax = y;
		};

		if (y > rawYMin) {
			rawYMin = y;
		};

		OldRangeX = (rawXMax - rawXMin);
		NewRangeX = (window.innerWidth - 0); 		
		NewValueX = (((x - rawXMin) * NewRangeX) / OldRangeX) + 0;

		OldRangeY = (rawYMax - rawYMin);
		NewRangeY = (window.innerHeight - 0);
		NewValueY = (((y - rawYMin) * NewRangeY) / OldRangeY) + 0;

		circle(NewValueX,NewValueY,100);
		console.log(tip);
		console.log(rawXMin, rawXMax, rawYMin, rawYMax);
	};
};

Leap.loop(controllerOptions, function(frame) {
	clear();
	HandleFrame(frame);
});


