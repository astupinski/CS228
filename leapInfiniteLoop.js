var controllerOptions = {};

x = window.innerWidth/2;
y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{
if (frame.hands.length < 2 && frame.hands.length > 0) {
	console.log(frame.hands[0]);
}
/*clear();
var rand_up = Math.floor(Math.random() * (3) ) + -1;
var rand_side = Math.floor(Math.random() * (3) ) + -1;
circle(x+rand_side,y+rand_up,100);*/
}
);
