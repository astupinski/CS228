var controllerOptions = {};


rawXMin = 100;
rawXMax = 10;
rawYMin = 100;
rawYMax = 10;

previousNumHands = 0;
currentNumHands = 0;

var oneFrameOfData = nj.zeros([5,4,6]);

function HandleFrame(frame) {
    hand_num = frame.hands.length;
    if (hand_num > 0) {
	var hand = frame.hands[0];
	HandleHand(hand, hand_num);
    };	
};

function HandleHand(hand, hand_num) {
    var fingers = hand.fingers;

    var i;
    var j;
  
    for (i = 0; i < 4; i++) {
	for (j = 0; j < 5; j++) {
	    finger = hand.fingers[j];
	    bone = finger.bones[i];
	    HandleBone(bone, bone.type, hand_num, j, i);
	};
    };			   
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

function HandleBone(bone, type, hand_num, fingerIndex, boneIndex) {
    
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

    sum = xt + yt + zt + xb + yb + zb;
    
    oneFrameOfData.set(fingerIndex,boneIndex,0,xb);
    oneFrameOfData.set(fingerIndex,boneIndex,1,yb);
    oneFrameOfData.set(fingerIndex,boneIndex,2,zb);

    oneFrameOfData.set(fingerIndex,boneIndex,3,xt);
    oneFrameOfData.set(fingerIndex,boneIndex,4,yt);
    oneFrameOfData.set(fingerIndex,boneIndex,5,zt);
    

    if (hand_num == 1) {

	if (type == 0) {
	    stroke(0,192,0,[192]);
	    strokeWeight(8);
	};

	if (type == 1) {
	    stroke(0,129,0,[129]);
	    strokeWeight(6);
	};

	if (type == 2) {
	    stroke(0,66,0,[66]);
	    strokeWeight(4);
	};

	if (type == 3) {
	    stroke(0,10,0,[0]);
	    strokeWeight(2);
	};
    };

    if (hand_num == 2) {

	if (type == 0) {
	    stroke(192,0,0,[192]);
	    strokeWeight(8);
	};

	if (type == 1) {
	    stroke(129,0,0,[129]);
	    strokeWeight(6);
	};

	if (type == 2) {
	    stroke(66,0,0,[66]);
	    strokeWeight(4);
	};

	if (type == 3) {
	    stroke(10,0,0,[0]);
	    strokeWeight(2);
	};
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

function RecordData() {
    
    if (previousNumHands == 2 && currentNumHands == 1) {
	background("black");
    };

    console.log(oneFrameOfData.toString());
    
};

Leap.loop(controllerOptions, function(frame) {
    
    currentNumHands = frame.hands.length;
    
    clear();
    HandleFrame(frame);

    if (previousNumHands == 2 && currentNumHands == 1) {
	RecordData();
    };

    previousNumHands = currentNumHands;
});


