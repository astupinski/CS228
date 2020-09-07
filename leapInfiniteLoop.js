var controllerOptions = {};

i = 0;
x = window.innerWidth/2;
y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{console.log(i++);
var rand = Math.floor(Math.random() * (3) ) + -1;
circle(x+rand,y,100);
}
);
