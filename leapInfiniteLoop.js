var controllerOptions = {};

x = window.innerWidth/2;
y = window.innerHeight/2;


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
		console.log(finger);
	};
};

Leap.loop(controllerOptions, function(frame) {
	HandleFrame(frame);
});


