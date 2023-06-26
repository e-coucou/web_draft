let slider,sliderLR;

let x_vals = [], y_vals = [];
let a,b,c,d,e;
let dragging = false;

let lr = -1;
let optimizer;
let power;
// const optimizer = tf.train.sgd(lr);

function mousePressed() {
	dragging = true;
}

function mouseReleased() {
	dragging = false;
}

function loss(predic,target) {
	return predic.sub(target).square().mean();
}

function predict(x) {
	const xs = tf.tensor(x);
	let ys;
	// // y = mx + b
	// const ys = xs.mul(a).add(b);
	// y = ax2 + bx +c
	// const ys = xs.pow(tf.scalar(4)).mul(a).add(xs.pow(tf.scalar(3).mul(b))).add(xs.square().mul(c)).add(xs.mul(d)).add(e);
	switch (power) {
		case 2 : ys = xs.square().mul(a).add(xs.mul(b)).add(c); break;
		case 3 : ys = xs.pow(tf.scalar(3)).mul(a).add(xs.square().mul(b)).add(xs.mul(c)).add(d);break;
		case 4 : ys = xs.pow(tf.scalar(4)).mul(a).add(xs.pow(tf.scalar(2)).mul(b)).add(xs.square().mul(c)).add(xs.mul(d)).add(e); break;
	}
	return ys ;
}

function setup() {
	createCanvas(400,400);
	slider = createSlider(2,4,2,1);
	sliderLR = createSlider(0.001,1,0.1,0.01);
	power=-1;
}
function init_power() {
	power= slider.value();
	try {
		a.dispose();b.dispose();c.dispose();d.dispose();e.dispose();
	} catch { console.log('no dispose');}
	a = tf.variable(tf.scalar(random(-1,1)));
	b = tf.variable(tf.scalar(random(-1,1)));
	c = tf.variable(tf.scalar(random(-1,1)));
	d = tf.variable(tf.scalar(random(-1,1)));
	e = tf.variable(tf.scalar(random(-1,1)));
}

function init_optimizer() {
	lr = sliderLR.value();
	try { 
		optimizer.dipose();
	} catch { console.log('optimizer');}
	optimizer  = tf.train.adam(lr);
}

function draw() {
	background(0);

	if(sliderLR.value() !== lr) {
		init_optimizer();
	}
	if (slider.value() !== power) {
		init_optimizer();
		init_power();
	}

	if (dragging) {
		let x = map(mouseX ,0,width,-1,1);
		let y = map(mouseY,0,height,1,-1);
		x_vals.push(x);
		y_vals.push(y);
	} else {
		tf.tidy( () => {
			if (x_vals.length > 0) {
				let ys = tf.tensor(y_vals);
				optimizer.minimize( ()=> loss( predict(x_vals),ys));
			}
		});
	}

	stroke(255);
	strokeWeight(5);
	for ( let i=0; i<x_vals.length ;i++) {
		let px = map(x_vals[i],-1,1,0,width);
		let py = map(y_vals[i],-1,1,height,0);
		point(px,py);
	}
	
	const xs= [-1,1];
	const cX = [];
	for (let i=-1;i<=1;i+=0.05) {
		cX.push(i);
	}

	const ys = tf.tidy( () => predict(xs) );
	let lY = ys.dataSync();
	ys.dispose();

	const ycs = tf.tidy( () => predict(cX) );
	let cY = ycs.dataSync();
	ycs.dispose();

	let x1 = map(xs[0],-1,1,0,width);
	let x2 = map(xs[1],-1,1,0,width);
	let y1 = map(lY[0],-1,1,height,0);
	let y2 = map(lY[1],-1,1,height,0);

	// stroke(220); strokeWeight(1);
	// line(x1,y1,x2,y2);

	beginShape();
	stroke(120,255,100); noFill();strokeWeight(2);
	for (let i=0; i<cX.length;i++) {
		let x = map(cX[i],-1,1,0,width);
		let y = map(cY[i],-1,1,height,0);
		vertex(x,y);
	}
	endShape();

}
