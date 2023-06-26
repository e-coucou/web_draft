// crerate MODEL
const model = tf.sequential();

// create Hiddeen Layer
const configHidden = { units: 4, inputShape: [1], activation: 'sigmoid', useBias: false};
const hidden = tf.layers.dense(configHidden);
model.add(hidden);
// create Outpu Layer
const configOutput = { units: 1, inputShape: [4], activation: 'sigmoid', useBias: false};
const output = tf.layers.dense(configOutput);
model.add(output);
// add optimizer
const sgdOpt = tf.train.sgd(0.1);
const config = { optimizer: sgdOpt, loss: 'meanSquaredError'};
// compile le MODEL
model.compile(config);


const xs = tf.tensor([
	[0],
	[0.5],
	[1]
	]); 
const ys = tf.tensor([
	[1],
	[0.5],
	[0]
	]); 
const configFit = { epochs: 10, shuffle: true};

console.log('start train');
train().then( () => {
	console.log('Train finsihed');
	let outputs = model.predict(xs);
	outputs.print();
})


async function train() {
	for (let i =0; i< 1000; i++ ) {
		const response = await model.fit(xs,ys,configFit);
		if (i%10===0) console.log(i, response.history.loss[0]);
	}
}





function setup() {
	noCanvas();
}

function draw() {
}
