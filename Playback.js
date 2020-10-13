oneFrameOfData = nj.array([[[  0.5256, 0.34165,  0.7383,  0.5256, 0.34165,  0.7383],
        [  0.5256, 0.34165,  0.7383, 0.62375, 0.46901, 0.68709],
        [ 0.62375, 0.46901, 0.68709, 0.65453, 0.56232, 0.60148],
        [ 0.65453, 0.56232, 0.60148, 0.68955,  0.6256, 0.55997]],
       [[ 0.48766, 0.39652, 0.80224, 0.48935, 0.59164, 0.57522],
        [ 0.48935, 0.59164, 0.57522,  0.5006,  0.5325, 0.37199],
        [  0.5006,  0.5325, 0.37199, 0.50751, 0.45418, 0.38961],
        [ 0.50751, 0.45418, 0.38961, 0.50993, 0.41142, 0.44736]],
       [[ 0.44731, 0.39944, 0.80262,  0.4177, 0.58104, 0.58507],
        [  0.4177, 0.58104, 0.58507, 0.45181, 0.52554, 0.35529],
        [ 0.45181, 0.52554, 0.35529, 0.47647,  0.4358, 0.36802],
        [ 0.47647,  0.4358, 0.36802, 0.48559, 0.38745, 0.42736]],
       [[ 0.40776, 0.39292, 0.79528, 0.35098, 0.54862,  0.6011],
        [ 0.35098, 0.54862,  0.6011, 0.38029, 0.51744, 0.37756],
        [ 0.38029, 0.51744, 0.37756, 0.41959, 0.43616, 0.35941],
        [ 0.41959, 0.43616, 0.35941, 0.44095, 0.38479, 0.40068]],
       [[ 0.37305, 0.36728, 0.76663, 0.29469, 0.50644, 0.60137],
        [ 0.29469, 0.50644, 0.60137, 0.20033, 0.57152, 0.57144],
        [ 0.20033, 0.57152, 0.57144, 0.15157, 0.60384, 0.52913],
        [ 0.15155, 0.60381, 0.52925, 0.11401, 0.62758, 0.47338]]])

anotherFrameOfData = nj.array([[[ 0.49362, 0.38414, 0.86931, 0.49362, 0.38414, 0.86931],
        [ 0.49362, 0.38414, 0.86931, 0.59978, 0.49111, 0.75431],
        [ 0.59978, 0.49111, 0.75431, 0.64329, 0.56091, 0.62829],
        [ 0.64329, 0.56091, 0.62829, 0.68768,  0.6111, 0.56361]],
       [[ 0.45186, 0.44749, 0.90632, 0.46365, 0.60516, 0.60561],
        [ 0.46365, 0.60516, 0.60561, 0.47059, 0.73161, 0.49705],
        [ 0.47059, 0.73161, 0.49705, 0.47669, 0.79611, 0.41984],
        [ 0.47669, 0.79611, 0.41984, 0.48232, 0.83657, 0.35609]],
       [[ 0.41083, 0.44958, 0.90092, 0.39039, 0.59467, 0.61129],
        [ 0.39039, 0.59467, 0.61129, 0.35733, 0.73279, 0.48931],
        [ 0.35733, 0.73279, 0.48931, 0.34151, 0.80778, 0.39938],
        [ 0.34151, 0.80778, 0.39938, 0.33344, 0.85256,  0.3302]],
       [[ 0.37099, 0.44114, 0.89171, 0.32193, 0.56369, 0.63225],
        [ 0.32193, 0.56369, 0.63225, 0.26925, 0.68538, 0.52205],
        [ 0.26925, 0.68538, 0.52205, 0.24037, 0.75498, 0.43596],
        [ 0.24037, 0.75498, 0.43596, 0.22354, 0.79752, 0.36804]],
       [[ 0.33715,  0.4106, 0.86962, 0.26485, 0.52083, 0.64272],
        [ 0.26485, 0.52083, 0.64272, 0.19402, 0.60509, 0.57333],
        [ 0.19402, 0.60509, 0.57333, 0.15749, 0.64893,  0.5222],
        [ 0.15758,   0.649, 0.52216, 0.12807, 0.68475, 0.46744]]])


var frameIndex = 0;
var flip = 0;

function draw() {
    clear();

    for (var i = 0; i < oneFrameOfData.shape[0]; i++) {
	for (var j = 0; j < oneFrameOfData.shape[1]; j++) {

	    if (flip % 2 == 0) {

		var xStart = anotherFrameOfData.get(i,j,0);
		var yStart = anotherFrameOfData.get(i,j,1);
		var zStart = anotherFrameOfData.get(i,j,2);
		var xEnd = anotherFrameOfData.get(i,j,3);
		var yEnd = anotherFrameOfData.get(i,j,4);
		var zEnd = anotherFrameOfData.get(i,j,5);

		//convert the normalized coordinates to span the canvas
		var canvasXprev = window.innerWidth * xStart;
		var canvasYprev = window.innerHeight * (1 - yStart);

		var canvasXnext = window.innerWidth * xEnd;
		var canvasYnext = window.innerHeight * (1 - yEnd);
	    
		line(canvasXprev, canvasYprev, canvasXnext, canvasYnext);
		
		//line(xStart, yStart, xEnd, yEnd);
		
	    }
	    else {
		
		var xStart = oneFrameOfData.get(i,j,0);
		var yStart = oneFrameOfData.get(i,j,1);
		var zStart = oneFrameOfData.get(i,j,2);
		var xEnd = oneFrameOfData.get(i,j,3);
		var yEnd = oneFrameOfData.get(i,j,4);
		var zEnd = oneFrameOfData.get(i,j,5);

		//convert the normalized coordinates to span the canvas
		var canvasXprev = window.innerWidth * xStart;
		var canvasYprev = window.innerHeight * (1 - yStart);

		var canvasXnext = window.innerWidth * xEnd;
		var canvasYnext = window.innerHeight * (1 - yEnd);
	    
		line(canvasXprev, canvasYprev, canvasXnext, canvasYnext);
		
		//line(xStart, yStart, xEnd, yEnd);
	    };
	};
    };



    frameIndex++;
    if (frameIndex == 100) {
	frameIndex = 0;
	if (flip == 0) {
	    flip = 1;
	} else if (flip == 1) {
	    flip = 0;
	};
    };

    console.log(flip);

    
};
