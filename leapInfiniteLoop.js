var controllerOptions = {};

i = 0;
x = window.innerWidth/2;
y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{console.log(i++),
circle(x,y,100)
}
);
