var controllerOptions = {};

const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;
var programState = 0;

var digitToShow = 0;


var numSamples = train5.shape[3];
//var numFeatures = irisData.shape[1] - 1;
var predictedClassLabels = nj.zeros(numSamples);
var framesOfData = nj.zeros([5,4,6]);
var numPredictions = 0;
var mean_acc = 0;
var overall_acc = nj.zeros(2);
var timeframe = 10;

var timeSinceLastDigitChange = new Date();


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

    var greenVal = mean_acc * 255;
    var redVal = (1-mean_acc) * 255;
    

    if (hand_num == 1) {

	if (type == 0) {
	    stroke(redVal,greenVal,0,[192]);
	    strokeWeight(8*5);
	};

	if (type == 1) {
	    stroke(redVal,greenVal,0,[129]);
	    strokeWeight(6*5);
	};

	if (type == 2) {
	    stroke(redVal,greenVal,0,[66]);
	    strokeWeight(4*5);
	};

	if (type == 3) {
	    stroke(redVal,greenVal,0,[0]);
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
	features03 = train0Allison.pick(null,null,null,i);
	features04 = train0Croxford.pick(null,null,null,i);
	features05 = train0Davis.pick(null,null,null,i);
	
	features1 = train1.pick(null,null,null,i);
	features12 = train1Bongard.pick(null,null,null,i);
	features13 = train1Davis.pick(null,null,null,i);
//	features14 = train1Hunt.pick(null,null,null,i);
	features15 = train1Jimmo.pick(null,null,null,i);
	
	features2 = train2.pick(null,null,null,i);
	features22 = train2Bongard.pick(null,null,null,i);
	features23 = train2Banaszewski.pick(null,null,null,i);
	features24 = train2Downs.pick(null,null,null,i);
	features25 = train2Jing.pick(null,null,null,i);
	
	features3 = train3.pick(null,null,null,i);
	features32 = train3Bongard.pick(null,null,null,i);
	features33 = train3Beattie.pick(null,null,null,i);
	features34 = train3Luksevish.pick(null,null,null,i);
//	features35 = train3Nimako.pick(null,null,null,i);
	
	features4 = train4.pick(null,null,null,i);
	features42 = train4Bongard.pick(null,null,null,i);
	features43 = train4Beattie.pick(null,null,null,i);
	features44 = train4Bertschinger.pick(null,null,null,i);
	features45 = train4Faucher.pick(null,null,null,i);
	
	features5 = train5.pick(null,null,null,i);
	features52 = train5Bongard.pick(null,null,null,i);
	features53 = train5Bertschinger.pick(null,null,null,i);
	features54 = train5Blewett.pick(null,null,null,i);
	features55 = train5Faucher.pick(null,null,null,i);
	
	features6 = train6.pick(null,null,null,i);
	features62 = train6Bongard.pick(null,null,null,i);
	features63 = train6Fisher.pick(null,null,null,i);
	features64 = train6Koretsky.pick(null,null,null,i);
	features65 = train6Laquerre.pick(null,null,null,i);
	
	features7 = train7.pick(null,null,null,i);
	features72 = train7Bongard.pick(null,null,null,i);
	features73 = train7Fisher.pick(null,null,null,i);
//	features74 = train7Gagnon.pick(null,null,null,i);
	features75 = train7Laquerre.pick(null,null,null,i);
	
	features8 = train8.pick(null,null,null,i);
	features82 = train8Bongard.pick(null,null,null,i);
//	features83 = train8Gagnon.pick(null,null,null,i);
	features84 = train8Goldman.pick(null,null,null,i);
	features85 = train8ILee.pick(null,null,null,i);
	
	features9 = train9.pick(null,null,null,i);
	features92 = train9Bongard.pick(null,null,null,i);
	features93 = train9Croxford.pick(null,null,null,i);
	features94 = train9JClark.pick(null,null,null,i);
	features95 = train9McLaughlin.pick(null,null,null,i);
	
	
	features0 = features0.reshape(1,120);
	features02 = features02.reshape(1,120);
	features03 = features03.reshape(1,120);
	features04 = features04.reshape(1,120);
	features05 = features05.reshape(1,120);
	
	features1 = features1.reshape(1,120);
	features12 = features12.reshape(1,120);
	features13 = features13.reshape(1,120);
//	features14 = features14.reshape(1,120);
	features15 = features15.reshape(1,120);
	
	features2 = features2.reshape(1,120);
	features22 = features22.reshape(1,120);
	features23 = features23.reshape(1,120);
	features24 = features24.reshape(1,120);
	features25 = features25.reshape(1,120);
	
	features3 = features3.reshape(1,120);
	features32 = features32.reshape(1,120);
	features33 = features33.reshape(1,120);
	features34 = features34.reshape(1,120);
//	features35 = features35.reshape(1,120);
	
	features4 = features4.reshape(1,120);
	features42 = features42.reshape(1,120);
	features43 = features43.reshape(1,120);
	features44 = features44.reshape(1,120);
	features45 = features45.reshape(1,120);
	
	features5 = features5.reshape(1,120);
	features52 = features52.reshape(1,120);
	features53 = features53.reshape(1,120);
	features54 = features54.reshape(1,120);
	features55 = features55.reshape(1,120);
	
	features6 = features6.reshape(1,120);
	features62 = features62.reshape(1,120);
	features63 = features63.reshape(1,120);
	features64 = features64.reshape(1,120);
	features65 = features65.reshape(1,120);
	
	features7 = features7.reshape(1,120);
	features72 = features72.reshape(1,120);
	features73 = features73.reshape(1,120);
//	features74 = features74.reshape(1,120);
	features75 = features75.reshape(1,120);
	
	features8 = features8.reshape(1,120);
	features82 = features82.reshape(1,120);
//	features83 = features83.reshape(1,120);
	features84 = features84.reshape(1,120);
	features85 = features85.reshape(1,120);
	
	features9 = features9.reshape(1,120);
	features92 = features92.reshape(1,120);
	features93 = features93.reshape(1,120);
	features94 = features94.reshape(1,120);
	features95 = features95.reshape(1,120);
	
	
	knnClassifier.addExample(features0.tolist(), 0);
	knnClassifier.addExample(features02.tolist(), 0);
	knnClassifier.addExample(features03.tolist(), 0);
	knnClassifier.addExample(features04.tolist(), 0);
	knnClassifier.addExample(features05.tolist(), 0);
	
	knnClassifier.addExample(features1.tolist(), 1);
	knnClassifier.addExample(features12.tolist(), 1);
	knnClassifier.addExample(features13.tolist(), 1);
//	knnClassifier.addExample(features14.tolist(), 1);
	knnClassifier.addExample(features15.tolist(), 1);
	
	knnClassifier.addExample(features2.tolist(), 2);
	knnClassifier.addExample(features22.tolist(), 2);
	knnClassifier.addExample(features23.tolist(), 2);
	knnClassifier.addExample(features24.tolist(), 2);
	knnClassifier.addExample(features25.tolist(), 2);
	
	
	knnClassifier.addExample(features3.tolist(), 3);
	knnClassifier.addExample(features32.tolist(), 3);
	knnClassifier.addExample(features33.tolist(), 3);
	knnClassifier.addExample(features34.tolist(), 3);
//	knnClassifier.addExample(features35.tolist(), 3);
	
	knnClassifier.addExample(features4.tolist(), 4);
	knnClassifier.addExample(features42.tolist(), 4);
	knnClassifier.addExample(features43.tolist(), 4);
	knnClassifier.addExample(features44.tolist(), 4);
	knnClassifier.addExample(features45.tolist(), 4);
	
	knnClassifier.addExample(features5.tolist(), 5);
	knnClassifier.addExample(features52.tolist(), 5);
	knnClassifier.addExample(features53.tolist(), 5);
	knnClassifier.addExample(features54.tolist(), 5);
	knnClassifier.addExample(features55.tolist(), 5);
	
	knnClassifier.addExample(features6.tolist(), 6);
	knnClassifier.addExample(features62.tolist(), 6);
	knnClassifier.addExample(features63.tolist(), 6);
	knnClassifier.addExample(features64.tolist(), 6);
	knnClassifier.addExample(features65.tolist(), 6);
	
	knnClassifier.addExample(features7.tolist(), 7);
	knnClassifier.addExample(features72.tolist(), 7);
	knnClassifier.addExample(features73.tolist(), 7);
//	knnClassifier.addExample(features74.tolist(), 7);
	knnClassifier.addExample(features75.tolist(), 7);
	
	knnClassifier.addExample(features8.tolist(), 8);
	knnClassifier.addExample(features82.tolist(), 8);
//	knnClassifier.addExample(features83.tolist(), 8);
	knnClassifier.addExample(features84.tolist(), 8);
	knnClassifier.addExample(features85.tolist(), 8);
	
	knnClassifier.addExample(features9.tolist(), 9);
	knnClassifier.addExample(features92.tolist(), 9);
	knnClassifier.addExample(features93.tolist(), 9);
	knnClassifier.addExample(features94.tolist(), 9);
	knnClassifier.addExample(features95.tolist(), 9);
	
	
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
    mean_acc = (((numPredictions-1)*mean_acc) + (prediction == digitToShow))/numPredictions;

    if (mean_acc > overall_acc[digitToShow]) {
	overall_acc[digitToShow] = mean_acc;
	if (timeframe > 2) {
	    timeframe = timeframe-3;
	};
    };

    console.log(prediction, mean_acc);

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
    } else if (HandIsUncentered() == false) {
	programState = 2;
    } else if (HandIsUncentered() == true) {
	programState = 1;
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
	
	Train();
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
    image(arrowRight, window.innerWidth/2, 0);
};


function DrawArrowLeft() {
    image(arrowLeft, window.innerWidth/2, 0);
};

function DrawArrowUp() {
    image(arrowUp, window.innerWidth/2, 0);
};

function DrawArrowDown() {
    image(arrowDown, window.innerWidth/2, 0);
};

function DrawArrowToward() {
    image(arrowToward, window.innerWidth/2, 0);
};

function DrawArrowAway() {
    image(arrowAway, window.innerWidth/2, 0);
};

function HandleState2(frame) {
    HandleFrame(frame);
    DrawLowerRightPanel();
    Test();
    DetermineWhetherToDropImage();
    DetermineWhetherToSwitchDigits();
};

function DrawLowerRightPanel() {
    if (digitToShow == 0) {
	image(signZero, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 1) {
	image(signOne, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 2) {
	image(signTwo, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 3) {
	image(signThree, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 4) {
	image(signFour, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 5) {
	image(signFive, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 6) {
	image(signSix, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 7) {
	image(signSeven, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 8) {
	image(signEight, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 9) {
	image(signNine, window.innerWidth/2, window.innerHeight/2);
	
    };
};


function DrawNum() {
    if (digitToShow == 0) {
	image(signZeroNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 1) {
	image(signOneNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 2) {
	image(signTwoNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 3) {
	image(signThreeNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 4) {
	image(signFourNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 5) {
	image(signFiveNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 6) {
	image(signSixNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 7) {
	image(signSevenNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 8) {
	image(signEightNum, window.innerWidth/2, window.innerHeight/2);
	
    } else if (digitToShow == 9) {
	image(signNineNum, window.innerWidth/2, window.innerHeight/2);
	
    };
};


function DetermineWhetherToDropImage() {
    if (mean_acc > 0.3) {
	DrawNum();
    } else if (mean_acc < 0.3) {
	DrawLowerRightPanel();
    };
};

function DetermineWhetherToSwitchDigits() {
    if (mean_acc > 0.5 && TimeToSwitchDigits() == true) {
	SwitchDigits();
	numPredictions = 0;
    };
};

function SwitchDigits() {
    digitToShow++;
    if (digitToShow == 2) {
	digitToShow = 0;
    };
    timeSinceLastDigitChange = new Date();
};

function TimeToSwitchDigits() {
    var currentTime = new Date();
    var timeInMilliseconds = currentTime - timeSinceLastDigitChange;
    var timeInSeconds = timeInMilliseconds / 1000;
    
    if (timeInSeconds > timeframe) {
	console.log("true");
	return true;
    } else {
	return false;
    };
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
	
    } else if (programState==2) {
	HandleState2(frame);
    };
 
    
});


