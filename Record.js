var controllerOptions = {};


rawXMin = 100;
rawXMax = 10;
rawYMin = 100;
rawYMax = 10;

function HandleFrame(frame) {
	if (frame.hands.length < 2 && frame.hands.length > 0) {
		var hand = frame.hands[0];
		HandleHand(hand);
	};
	
};

function HandleHand(hand) {
    var fingers = hand.fingers;

    var i;
    var j;
  
    for (i = 0; i < 4; i++) {
	for (j = 0; j < 5; j++) {
	    finger = hand.fingers[j];
	    bone = finger.bones[i];
	    HandleBone(bone, bone.type);
	};
    };

    


    
    
    //hand.fingers.forEach(function(finger) {
	//finger.bones.forEach(function(bone) {
	   // HandleBone(bone, bone.type);
	//});
    //});
			   
};

function HandleFinger(finger) {
	
	tip = finger.tipPosition;
	x = tip[0];
	y = tip[1];
	z = tip[2];

	var bones = finger.bones;
	finger.bones.forEach(function(bone) {
	    HandleBone(bone, bone.type);
	});

};

function HandleBone(bone, type) {
    
    tip = bone.nextJoint;
    xt = tip[0];
    yt = tip[1];
    zt = tip[2];

    base = bone.prevJoint;
    xb = base[0];
    yb = base[1];
    zb = base[2];

    //get bone tip coordinates
    [xt,yt] = TransformCoordinates(xt,yt);

    //get bone base coordinates
    [xb,yb] = TransformCoordinates(xb,yb);

    if (type == 0) {
	strokeWeight(4);
	stroke([192]);
    };

    if (type == 1) {
	strokeWeight(3);
	stroke([129]);
    };

    if (type == 2) {
	strokeWeight(2);
	stroke([66]);
    };

    if (type == 3) {
	strokeWeight(1);
	stroke([0]);
    };

    line(xt, yt, xb, yb)
    
};

function TransformCoordinates(x,y) {

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

    return [NewValueX,NewValueY];

};

Leap.loop(controllerOptions, function(frame) {
	clear();
	HandleFrame(frame);
});


