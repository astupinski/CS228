var controllerOptions = {};

const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;
var programState = 0;


var numSamples = train5.shape[3];
//var numFeatures = irisData.shape[1] - 1;
var predictedClassLabels = nj.zeros(numSamples);
var framesOfData = nj.zeros([5,4,6]);
var numPredictions = 0;
var mean_acc = 0;



function HandleFrame(frame) {
    hand_num = frame.hands.length;
    if (hand_num > 0) {
	var hand = frame.hands[0];
	var ibox = frame.interactionBox;
	
	HandleHand(hand, hand_num, ibox);

	//Test();
	//console.log(predictedClassLabels.toString());
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

    /*if (previousNumHands == 2 && currentNumHands == 1) {

	console.log(framesOfData.toString());
    };*/
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
    framesOfData.set(fingerIndex,boneIndex,0,xb);
    framesOfData.set(fingerIndex,boneIndex,1,yb);
    framesOfData.set(fingerIndex,boneIndex,2,zb);

    framesOfData.set(fingerIndex,boneIndex,3,xt);
    framesOfData.set(fingerIndex,boneIndex,4,yt);
    framesOfData.set(fingerIndex,boneIndex,5,zt);

 


    //convert the normalized coordinates to span the canvas
    var canvasXprev = window.innerWidth/2 * normalizedPrevJoint[0];
    var canvasYprev = window.innerHeight/2 * (1 - normalizedPrevJoint[1]);

    var canvasXnext = window.innerWidth/2 * normalizedNextJoint[0];
    var canvasYnext = window.innerHeight/2 * (1 - normalizedNextJoint[1]);
    

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


function Train() {
    console.log("I am being trained");

    for (i = 0; i < train5.shape[3]; i++) {

	features0 = train0.pick(null,null,null,i);
	features02 = train0Bongard.pick(null,null,null,i);
	
	features1 = train1.pick(null,null,null,i);
	features12 = train1Bongard.pick(null,null,null,i);
	
	features2 = train2.pick(null,null,null,i);
	features22 = train2Bongard.pick(null,null,null,i);
	
	features3 = train3.pick(null,null,null,i);
	features32 = train3Bongard.pick(null,null,null,i);
	
	features4 = train4.pick(null,null,null,i);
	features42 = train4Bongard.pick(null,null,null,i);
	
	features5 = train5.pick(null,null,null,i);
	features52 = train5Bongard.pick(null,null,null,i);
	
	features6 = train6.pick(null,null,null,i);
	features62 = train6Bongard.pick(null,null,null,i);
	
	features7 = train7.pick(null,null,null,i);
	features72 = train7Bongard.pick(null,null,null,i);
	
	features8 = train8.pick(null,null,null,i);
	features82 = train8Bongard.pick(null,null,null,i);
	
	features9 = train9.pick(null,null,null,i);
	features92 = train9Bongard.pick(null,null,null,i);
	
	
	features0 = features0.reshape(1,120);
	features02 = features02.reshape(1,120);
	
	features1 = features1.reshape(1,120);
	features12 = features12.reshape(1,120);
	
	features2 = features2.reshape(1,120);
	features22 = features22.reshape(1,120);
	
	features3 = features3.reshape(1,120);
	features32 = features32.reshape(1,120);
	
	features4 = features4.reshape(1,120);
	features42 = features42.reshape(1,120);
	
	features5 = features5.reshape(1,120);
	features52 = features52.reshape(1,120);
	
	features6 = features6.reshape(1,120);
	features62 = features62.reshape(1,120);
	
	features7 = features7.reshape(1,120);
	features72 = features72.reshape(1,120);
	
	features8 = features8.reshape(1,120);
	features82 = features82.reshape(1,120);
	
	features9 = features9.reshape(1,120);
	features92 = features92.reshape(1,120);
	
	
	knnClassifier.addExample(features0.tolist(), 0);
	knnClassifier.addExample(features02.tolist(), 0);
	
	knnClassifier.addExample(features1.tolist(), 1);
	knnClassifier.addExample(features12.tolist(), 1);
	
	knnClassifier.addExample(features2.tolist(), 2);
	knnClassifier.addExample(features22.tolist(), 2);
	
	knnClassifier.addExample(features3.tolist(), 3);
	knnClassifier.addExample(features32.tolist(), 3);
	
	knnClassifier.addExample(features4.tolist(), 4);
	knnClassifier.addExample(features42.tolist(), 4);
	
	knnClassifier.addExample(features5.tolist(), 5);
	knnClassifier.addExample(features52.tolist(), 5);
	
	knnClassifier.addExample(features6.tolist(), 6);
	knnClassifier.addExample(features62.tolist(), 6);
	
	knnClassifier.addExample(features7.tolist(), 7);
	knnClassifier.addExample(features72.tolist(), 7);
	
	knnClassifier.addExample(features8.tolist(), 8);
	knnClassifier.addExample(features82.tolist(), 8);
	
	knnClassifier.addExample(features9.tolist(), 9);
	knnClassifier.addExample(features92.tolist(), 9);




	

	
    };
};


function Test() {
    //console.log("I am being tested");

    //for (i = 0; i < framesOfData.shape[3]; i++) {
    currentFeatures = framesOfData;
    CenterXData();
    CenterYData();
    CenterZData();
    
    currentFeatures = currentFeatures.reshape(1,120);
    knnClassifier.classify(currentFeatures.tolist(), GotResults);
	
	
   // }; 
};


function GotResults(err, result) {
   
    //console.log(parseInt(result.label));
    prediction = parseInt(result.label);
    numPredictions++;
    var d = 9;
    mean_acc = (((numPredictions-1)*mean_acc) + (prediction == d))/numPredictions;

    console.log(prediction);

    //console.log(predictedClassLabels.toString());

};


function CenterXData() {
    xValues = framesOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();

    horizontalShift = 0.5 - currentXMean;

    for (currentRow = 0; currentRow < 5; currentRow++) {
	for (currentCol = 0; currentCol < 4; currentCol++) {
	    currentX = framesOfData.get(currentRow, currentCol, 0);
	    shiftedX = currentX + horizontalShift;
	    framesOfData.set(currentRow, currentCol, 0, shiftedX);

	    currentX2 = framesOfData.get(currentRow, currentCol, 3);
	    shiftedX2 = currentX2 + horizontalShift;
	    framesOfData.set(currentRow, currentCol, 3, shiftedX2);
	};
    };
    xValues = framesOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();

};


function MirrorHand() {
    xValues = framesOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();

    horizontalShift = 0.5 - currentXMean;

    for (currentRow = 0; currentRow < 5; currentRow++) {
	for (currentCol = 0; currentCol < 4; currentCol++) {
	    currentX = framesOfData.get(currentRow, currentCol, 0);
	    shiftedX = currentX + horizontalShift;
	    shiftedX = shiftedX;
	    framesOfData.set(currentRow, currentCol, 0, shiftedX-1);

	    currentX2 = framesOfData.get(currentRow, currentCol, 3);
	    shiftedX2 = currentX2 + horizontalShift;
	    shiftedX2 = shiftedX2;
	    framesOfData.set(currentRow, currentCol, 3, shiftedX2-1);
	};
    };
    xValues = framesOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();

};


function CenterYData() {

    yValues = framesOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean();

    horizontalShiftY = 0.5 - currentYMean;

    for (currentRow = 0; currentRow < 5; currentRow++) {
	for (currentCol = 0; currentCol < 4; currentCol++) {
	    currentY = framesOfData.get(currentRow, currentCol, 1);
	    shiftedY = currentY + horizontalShiftY;
	    framesOfData.set(currentRow, currentCol, 1, shiftedY);

	    currentY2 = framesOfData.get(currentRow, currentCol, 4);
	    shiftedY2 = currentY2 + horizontalShiftY;
	    framesOfData.set(currentRow, currentCol, 4, shiftedY2);
	};
    };
    yValues = framesOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean();

};

function CenterZData() {

    zValues = framesOfData.slice([],[],[2,6,3]);
    currentMean = zValues.mean();

    horizontalShift = 0.5 - currentMean;

    for (currentRow = 0; currentRow < 5; currentRow++) {
	for (currentCol = 0; currentCol < 4; currentCol++) {
	    currentZ = framesOfData.get(currentRow, currentCol, 2);
	    shiftedZ = currentZ + horizontalShift;
	    framesOfData.set(currentRow, currentCol, 2, shiftedZ);

	    currentZ2 = framesOfData.get(currentRow, currentCol, 5);
	    shiftedZ2 = currentZ2 + horizontalShift;
	    framesOfData.set(currentRow, currentCol, 5, shiftedZ2);
	};
    };
    zValues = framesOfData.slice([],[],[2,6,3]);
    currentMean = zValues.mean();

};

function DetermineState(frame) {
    hand_num = frame.hands.length;
    if (hand_num==0) {
	programState = 0;
    } else if (HandIsUncentered) {
	programState = 1;
    } else {
	programState = 2;
    };
};

function HandIsUncentered() {
    if ( HandIsTooFarToTheLeft() ) {
	return true;
    } else if ( HandIsTooFarToTheRight() ){
	return true;
    } else if ( HandIsTooLow() ) {
	return true;
    } else if ( HandIsTooHigh()) {
	return true;
    } else if ( HandIsTooFar()) {
	return true;
    } else if ( HandIsTooClose()) {
	return true;
    } else {
	return false;
    };
};

function HandIsTooFarToTheLeft() {
    xValues = framesOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();
    if (currentXMean < 0.25) {
	return true;
    } else {
	return false;
    };
};

function HandIsTooFarToTheRight() {
    xValues = framesOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();
    if (currentXMean > 0.75) {
	return true;
    } else {
	return false;
    };
};

function HandIsTooLow() {
    yValues = framesOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean();
    if (currentYMean < 0.25) {
	return true;
    } else {
	return false;
    };
};

function HandIsTooHigh() {
    yValues = framesOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean();
    if (currentYMean > 0.75) {
	return true;
    } else {
	return false;
    };
};

function HandIsTooFar() {
    zValues = framesOfData.slice([],[],[2,6,3]);
    currentMean = zValues.mean();
    if (currentMean < 0.25) {
	return true;
    } else {
	return false;
    };
};

function HandIsTooClose() {
    zValues = framesOfData.slice([],[],[2,6,3]);
    currentMean = zValues.mean();
    if (currentMean > 0.75) {
	return true;
    } else {
	return false;
    };
};

function HandleState0(frame) {
    TrainKNNIfNotDoneYet();
    DrawImageToHelpUserPutTheirHandOverTheDevice();
};

function TrainKNNIfNotDoneYet() {
    if (trainingCompleted == false) {
	
	//Train();
	trainingCompleted = true;
    };
};

function DrawImageToHelpUserPutTheirHandOverTheDevice() {
    image(img, 0, 0, window.innerWidth/2, window.innerHeight/2);
};

function HandleState1(frame) {
    HandleFrame(frame);
    if ( HandIsTooFarToTheLeft() ) {
	DrawArrowRight();
	
    } else if (HandIsTooFarToTheRight() ) {
	DrawArrowLeft();
	
    } else if (HandIsTooLow() ) {
	DrawArrowUp();
	
    } else if (HandIsTooHigh()) {
	DrawArrowDown();
	
    } else if (HandIsTooFar()) {
	DrawArrowToward();
    } else if (HandIsTooClose()){
	DrawArrowAway();
    }; 
};

function DrawArrowRight() {
    image(arrowRight, window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2);
};


function DrawArrowLeft() {
    image(arrowLeft, window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2);
};

function DrawArrowUp() {
    image(arrowUp, window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2);
};

function DrawArrowDown() {
    image(arrowDown, window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2);
};

function DrawArrowToward() {
    image(arrowToward, window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2);
};

function DrawArrowAway() {
    image(arrowAway, window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2);
};

function HandleState2(frame) {
    HandleFrame(frame);
};


function SignIn() {

    username = document.getElementById('username').value;
    console.log(username);
    
    var list = document.getElementById('users');
    
   
    if (IsNewUser(username, list)==false) {
	
	CreateNewUser(username, list);
	CreateSignInItem(username, list);
    } else {
	ID = String(username) + "_signins";
	listItem = document.getElementById( ID );
	listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
    };

    console.log(list.innerHTML);

    return false;
    
};

function IsNewUser(username, list) {
    
    var users = list.children;
    var usernameFound = false;

    for (i=0; i < users.length; i++) {
	if (username == users[i].innerHTML) {
	    usernameFound = true;
	   
	};
	console.log(users[i]);
	console.log(users[i].innerHTML);
    };
    return usernameFound;
};


function CreateNewUser(username, list) {
    var item = document.createElement('li');
    item.innerHTML = String(username);
    item.id = String(username) + "_name";
    list.appendChild(item);
};


function CreateSignInItem(username, list) {
    var item2 = document.createElement('li');
    item2.innerHTML = 1;
    item2.id = String(username) + "_signins";
    list.appendChild(item2);
};


Leap.loop(controllerOptions, function(frame) {
    clear();
    DetermineState(frame);
    
    if (programState==0) {
	HandleState0(frame);
	
    } else if (programState==1) {
	HandleState1(frame);
    };
 
    
});


