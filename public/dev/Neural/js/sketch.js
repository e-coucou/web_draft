
// let nn = new NeuralNetwork(2,5,1);
let nnFx = new NeuralNetwork(2,7,1);
let cpt = 0;
const nbT = 50000;
let trainings = [];

// let training_data = [
// 		{ input: [1,0], output: [1]},
// 		{ input: [0,1], output: [1]},
// 		{ input: [1,1], output: [0]},
// 		{ input: [0,0], output: [0]},
// 	];

function f(x) {
	// return (pow(x/200,2)*100);
	return 2*x;
}
function answer(x,y) {
	if (y>f(x)) { return 1; } else { return 0;}
}

function gen_item() {
	let x = random(width);
	let y = random(height);
	let a = answer(x,y);
	return ({inputs: [x,y], output:[a]});
}
function setup() {

	createCanvas(400,400);

	// for (let i = 0; i< nbT; i++) {
	// 	let data = random(training_data)
	// 	nn.train_EP(data.input,data.output);
	// }
	// console.log(training_data[0].input,training_data[0].output,nn.feedforward_EP(training_data[0].input).matrix[0]);
	// console.log(training_data[1].input,training_data[1].output,nn.feedforward_EP(training_data[1].input).matrix[0]);
	// console.log(training_data[2].input,training_data[2].output,nn.feedforward_EP(training_data[2].input).matrix[0]);
	// console.log(training_data[3].input,training_data[3].output,nn.feedforward_EP(training_data[3].input).matrix[0]);
	for (let j=0;j<nbT;j++) {
		let it = gen_item();
		nnFx.train_EP(it.inputs, it.output);
	} 
}


function draw() {
	if(cpt < 1000) { background(51); }
	stroke(200,255,0);
	for(let i=0; i<width;i++) {
		line(i,f(i),i+1,f(i+1));
	}
	// frameRate(10);

	// let x= floor(random(width));
	// let y= floor(random(height));
	// stroke(255); noFill();
	// circle(x,y,4);
	let item = gen_item();
	trainings.push(item);
	// more trainings ...
	for (let j=0;j<1000;j++) {
		let it = gen_item();
		nnFx.train_EP(it.inputs, it.output);
	} 
	
	// console.log(item,nnFx.feedforward_EP(item.inputs).matrix[0]);
	stroke(255);
	for( let i = 0; i<cpt;i++) {
		let guess = nnFx.feedforward_EP(trainings[i].inputs).matrix[0];
		// console.log(trainings[i]);
		// console.log(guess);
		if (guess>0.5) {noFill();} else {fill(255);}
		circle(trainings[i].inputs[0],trainings[i].inputs[1],4);
	}
	cpt++; if (cpt > 1000) noLoop();
}