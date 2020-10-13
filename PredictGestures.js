const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;


var numSamples = train5.shape[3];
//var numFeatures = irisData.shape[1] - 1;
var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros(numSamples);


function Train() {
    console.log("I am being trained");

    for (i = 0; i < train5.shape[3]; i++) {
	features = train5.pick(null,null,null,i);
	features1 = train7.pick(null,null,null,i);
	
	features = features.reshape(1,120);
	features1 = features1.reshape(1,120);
	
	knnClassifier.addExample(features.tolist(), 5);
	knnClassifier.addExample(features1.tolist(), 7);

	
    };
};


function Test() {
    //console.log("I am being tested");

    for (i = 0; i < test.shape[3]; i++) {
	currentFeatures = test.pick(null,null,null,i);

	currentFeatures = currentFeatures.reshape(1,120);
	knnClassifier.classify(currentFeatures.tolist(), GotResults);
	
	//console.log(currentFeatures.toString());
	
    }; 
};


function GotResults(err, result) {
   
    predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
    testingSampleIndex++;
    if (testingSampleIndex == numSamples) {
	testingSampleIndex = 0;
    };

    console.log(predictedClassLabels.toString());

};


function draw() {
    clear();

    if (trainingCompleted == false) {
	
	Train();
	trainingCompleted = true;
    };
    
    Test();
    
};


