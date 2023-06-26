// // crerate MODEL
// const model = tf.sequential();

// // create Hiddeen Layer
// const configHidden = { units: 4, inputShape: [1], activation: 'sigmoid', useBias: false};
// const hidden = tf.layers.dense(configHidden);
// model.add(hidden);
// // create Outpu Layer
// const configOutput = { units: 1, inputShape: [4], activation: 'sigmoid', useBias: false};
// const output = tf.layers.dense(configOutput);
// model.add(output);
// // add optimizer
// const sgdOpt = tf.train.sgd(0.1);
// const config = { optimizer: sgdOpt, loss: 'meanSquaredError'};
// // compile le MODEL
// model.compile(config);


// const xs = tf.tensor([
// 	[0],
// 	[0.5],
// 	[1]
// 	]); 
// const ys = tf.tensor([
// 	[1],
// 	[0.5],
// 	[0]
// 	]); 
// const configFit = { epochs: 10, shuffle: true};

// console.log('start train');
// train().then( () => {
// 	console.log('Train finsihed');
// 	let outputs = model.predict(xs);
// 	outputs.print();
// })


// async function train() {
// 	for (let i =0; i< 1000; i++ ) {
// 		const response = await model.fit(xs,ys,configFit);
// 		if (i%10===0) console.log(i, response.history.loss[0]);
// 	}
// }


let x_vals = [], y_vals = [];
let m,b;

const lr = 0.1;
const optimizer = tf.train.sgd(lr);

function mousePressed() {
	let x = map(mouseX ,0,width,0,1);
	let y = map(mouseY,0,height,1,0);
	x_vals.push(x);
	y_vals.push(y);
}

function loss(predic,target) {
	return predic.sub(target).square().mean();
}

function predict(x) {
	const xs = tf.tensor(x);
	// y = mx + b
	const ys = xs.mul(m).add(b);
	return ys ;
}

function setup() {
	createCanvas(400,400);
	m = tf.variable(tf.scalar(random(1)));
	b = tf.variable(tf.scalar(random(1)));
}

function draw() {
	background(0);
	tf.tidy( () => {
		if (x_vals.length > 0) {
			let ys = tf.tensor(y_vals);
			optimizer.minimize( ()=> loss( predict(x_vals),ys));
		}
	});

	stroke(255);
	strokeWeight(5);
	for ( let i=0; i<x_vals.length ;i++) {
		let px = map(x_vals[i],0,1,0,width);
		let py = map(y_vals[i],0,1,height,0);
		point(px,py);
	}
	
	tf.tidy( () => {
		const xs= [0,1];
		const ys = predict(xs)
		let lY = ys.dataSync();
		let x1 = map(xs[0],0,1,0,width);
		let x2 = map(xs[1],0,1,0,width);
		let y1 = map(lY[0],0,1,height,0);
		let y2 = map(lY[1],0,1,height,0);

		stroke(220); strokeWeight(1);
		line(x1,y1,x2,y2);
	});

}
