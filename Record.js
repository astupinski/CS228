var controllerOptions = {};
nj.config.printThreshold = 1000;

rawXMin = 100;
rawXMax = 10;
rawYMin = 100;
rawYMax = 10;

previousNumHands = 0;
currentNumHands = 0;

var numSamples = 100;
var framesOfData = nj.zeros([5,4,6, numSamples]);
var currentSample = 0;
var currentSampleNum = 0;


function HandleFrame(frame) {
    hand_num = frame.hands.length;
    if (hand_num > 0) {
	var hand = frame.hands[0];
	var ibox = frame.interactionBox;
	
	HandleHand(hand, hand_num, ibox);
    };	
};

function HandleHand(hand, hand_num, ibox) {
    var fingers = hand.fingers;

    var i;
    var j;
	
  
    for (i = 0; i < 4; i++) {
	for (j = 0; j < 5; j++) {
	    finger = hand.fingers[j];
	    bone = finger.bones[i];
	    HandleBone(bone, bone.type, hand_num, j, i, ibox);
	};
    };

    if (previousNumHands == 2 && currentNumHands == 1) {

	console.log(framesOfData.toString());
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

function HandleBone(bone, type, hand_num, fingerIndex, boneIndex, ibox) {

    normalizedPrevJoint = ibox.normalizePoint(bone.prevJoint, true);
    normalizedNextJoint = ibox.normalizePoint(bone.nextJoint, true);

    //store raw data
    tip = normalizedNextJoint;
    xt = tip[0];
    yt = tip[1];
    zt = tip[2];

    base = normalizedPrevJoint;
    xb = base[0];
    yb = base[1];
    zb = base[2];


	// background("black");
    framesOfData.set(fingerIndex,boneIndex,0,currentSample,xb);
    framesOfData.set(fingerIndex,boneIndex,1,currentSample,yb);
    framesOfData.set(fingerIndex,boneIndex,2,currentSample,zb);

    framesOfData.set(fingerIndex,boneIndex,3,currentSample,xt);
    framesOfData.set(fingerIndex,boneIndex,4,currentSample,yt);
    framesOfData.set(fingerIndex,boneIndex,5,currentSample,zt);

 


    //convert the normalized coordinates to span the canvas
    var canvasXprev = window.innerWidth * normalizedPrevJoint[0];
    var canvasYprev = window.innerHeight * (1 - normalizedPrevJoint[1]);

    var canvasXnext = window.innerWidth * normalizedNextJoint[0];
    var canvasYnext = window.innerHeight * (1 - normalizedNextJoint[1]);
    

    if (hand_num == 1) {

	if (type == 0) {
	    stroke(0,192,0,[192]);
	    strokeWeight(8*5);
	};

	if (type == 1) {
	    stroke(0,129,0,[129]);
	    strokeWeight(6*5);
	};

	if (type == 2) {
	    stroke(0,66,0,[66]);
	    strokeWeight(4*5);
	};

	if (type == 3) {
	    stroke(0,10,0,[0]);
	    strokeWeight(2*5);
	};
    };

    if (hand_num == 2) {

	if (type == 0) {
	    stroke(192,0,0,[192]);
	    strokeWeight(8*5);
	};

	if (type == 1) {
	    stroke(129,0,0,[129]);
	    strokeWeight(6*5);
	};

	if (type == 2) {
	    stroke(66,0,0,[66]);
	    strokeWeight(4*5);
	};

	if (type == 3) {
	    stroke(10,0,0,[0]);
	    strokeWeight(2*5);
	};
    };

    line(canvasXnext, canvasYnext, canvasXprev, canvasYprev);
    
};


function RecordData() {
   

    if (currentNumHands == 1) {

	currentSample++;
	if (currentSample == numSamples) {
	    currentSample = 0;
	};
    };
    
};

Leap.loop(controllerOptions, function(frame) {
    
    currentNumHands = frame.hands.length;
    
    clear();
    HandleFrame(frame);

    
    RecordData();
    

    previousNumHands = currentNumHands;
});


