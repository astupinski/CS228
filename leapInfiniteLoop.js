var controllerOptions = {};

x = window.innerWidth/2;
y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{
//var hand = frame.hands[0];
//console.log(hand.fingers);

if (frame.hands.length < 2 && frame.hands.length > 0) {
	var hand = frame.hands[0];
	var fingers = hand.fingers;

	hand.fingers.forEach(function(finger) {
		if (finger.type == 1) {
			console.log(finger);
		};
	});
};
/*clear();
var rand_up = Math.floor(Math.random() * (3) ) + -1;
var rand_side = Math.floor(Math.random() * (3) ) + -1;
circle(x+rand_side,y+rand_up,100);*/
}
);
