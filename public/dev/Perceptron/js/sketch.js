
let couleurs = ['#33FFFF','#FF3399', '#33FF99', '#FF3333', '#9933FF', '#FF9933', '#DFDF2D', '#FFFF33', '#FF3333','#3333FF','#99FF33']; 
let cpt = 0;
let pTron, nb = 3;
let nbT = 500;
let trainings = []; 

function f(x) {
	return (pow(x/200,2)*100);
}

function answer(x,y) {
	if (y>f(x)) { return 1; } else { return -1;}
}

function setup() {
	createCanvas(400,400);

	pTron = new Perceptron(nb);
	for(let i=0;i<nbT;i++) {
		let x = (random(width));
		let y = (random(height));
		let a = answer(x,y);
		let train = new Trainer(x,y,a,nb);
		trainings[i] = train; //console.log(train);
	}
}


function draw() {
	if(cpt < nbT) { background(51); }
	stroke(200,255,0);
	for(let i=0; i<width;i++) {
		line(i,f(i),i+1,f(i+1));
	}
	// frameRate(10);

	// let x= floor(random(width));
	// let y= floor(random(height));
	// stroke(255); noFill();
	// circle(x,y,4);

	pTron.train(trainings[cpt].inputs, trainings[cpt].answer); //console.log(cpt,pTron);
	cpt++; if (cpt > nbT) noLoop();
	stroke(255);
	for( let i = 0; i<cpt;i++) {
		let guess = pTron.feedforward(trainings[i].inputs);
		if (guess>0) {noFill();} else {fill(255);}
		circle(trainings[i].inputs[0],trainings[i].inputs[1],4);
	}
}