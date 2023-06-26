let mobilnet;


function modelReady() {
	console.log('Model Ready');
}
function setup() {
	createCanvas(400,400);
	background(0);
	mobilenet = ml5.imageClassifier('mobilenet',modelReady);
}