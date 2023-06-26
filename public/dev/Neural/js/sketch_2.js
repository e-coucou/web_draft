
let nn = new NeuralNetwork(2,5,1);
// let nnFx = new NeuralNetwork(2,7,1);
let cpt = 0;
const nbT = 1;
let trainings = [];
let res = 10;
let lr,lrSlider;

let training_data = [
		{ inputs: [1,0], output: [1]},
		{ inputs: [0,1], output: [1]},
		{ inputs: [1,1], output: [0]},
		{ inputs: [0,0], output: [0]},
	];

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
	lrSlider = createSlider(0.001,2,0.03,0.01);

	for (let i = 0; i< nbT; i++) {
		let data = random(training_data)
		nn.train_EP(data.inputs,data.output);
	}
	// console.log(training_data[0].input,training_data[0].output,nn.feedforward_EP(training_data[0].input).matrix[0]);
	// console.log(training_data[1].input,training_data[1].output,nn.feedforward_EP(training_data[1].input).matrix[0]);
	// console.log(training_data[2].input,training_data[2].output,nn.feedforward_EP(training_data[2].input).matrix[0]);
	// console.log(training_data[3].input,training_data[3].output,nn.feedforward_EP(training_data[3].input).matrix[0]);
	// for (let j=0;j<nbT;j++) {
		// let it = gen_item();
		// nnFx.train_EP(it.inputs, it.output);
	// } 
}


function draw() {
	// if(cpt < 1000) { background(51); }
	// stroke(200,255,0);
	// for(let i=0; i<width;i++) {
		// line(i,f(i),i+1,f(i+1));
	// }
	// frameRate(10);
	lr = lrSlider.value();
	nn.setLR(lr);
	let item = random(training_data);
	trainings.push(item);
	// more trainings ...
	for (let j=0;j<1000;j++) {
		let it = random(training_data);
		nn.train_EP(it.inputs, it.output);
	} 
	
	for( let x=0;x<width;x+=res) {
		for (let y=0;y<height;y+=res) {
			let guess = float(nn.feedforward_EP([x/width,y/height]).matrix[0]);
			
			let c = Math.log(guess[0]+1.0)*256/Math.log(2);//Math.log(guess+1)*256/0.693;
			fill(c);
			rect(x,y,res,res);
		}
	}
	// console.log(item,nnFx.feedforward_EP(item.inputs).matrix[0]);
	stroke(255);
	// for( let i = 0; i<cpt;i++) {
		// let guess = nn.feedforward_EP(trainings[i].inputs).matrix[0];
		// let x = trainings[i].inputs[0];
		// console.log(trainings[i]);
		// console.log(guess);
		// if (guess>0.5) {noFill();} else {fill(255);}
		// circle(trainings[i].inputs[0],trainings[i].inputs[1],4);
	// }
	cpt++; if (cpt > 10000) noLoop();
}