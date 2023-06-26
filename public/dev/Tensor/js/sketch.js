

function setup() {
	noCanvas();
}

function draw() {
	const values = [];
	for (let i=0; i< 15; i++) {
		values[i] = random(0,100);
	}
	const shape = [5,3];

	tf.tidy(() => {
		const a = tf.tensor2d(values,shape,'int32');
		const b = tf.tensor2d(values,shape,'int32');
		const bT = b.transpose();

		const c = tf.matMul(a,bT)

		console.log(c.data());

	});

	console.log(tf.memory().numTensors);
}
