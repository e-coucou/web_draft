let numFrames = 100;
let n = 3000;
let delay = 2.0;
let noise = new OpenSimplexNoise();
let motion = 0.5;

let x1n = (t) => { 
	let seed =1337;
	return 0.25*width + 150*noise.noise2D(seed+motion*cos(TWO_PI*t),motion*sin(TWO_PI*t));}

let y1n = (t) =>  {
	let seed = 1515;
	return 0.5*width + 150*noise.noise2D(seed+motion*cos(TWO_PI*t),motion*sin(TWO_PI*t)); }

let x1 = (t) => 0.25*width + 50*cos(TWO_PI*t); 
let y1 = (t) =>  0.5*width + 50*sin(TWO_PI*t); 
let x2 = (t) =>  0.75*width + 50*cos(2*TWO_PI*t); 
let y2 = (t) =>  0.55*width + 50*sin(2*TWO_PI*t); 


function setup() {
	createCanvas(500,500);
 
}

function draw() {
 	background(0);
 	fill(255); stroke(255);

	let t = 1.0*(frameCount - 1)/numFrames;

 	ellipse(x1n(t),y1n(t),6,6);
 	ellipse(x2(t),y2(t),6,6);

	push();
	strokeWeight(2);
	stroke(255,100);
	for(let i=0;i<=n;i++){
		let tt = 1.0*i/n;
 
		let x = lerp(x1n(t-delay*tt),x2(t-delay*tt),tt);
		let y = lerp(y1n(t-delay*tt),y2(t-delay*tt),tt);
		point(x,y);
	}
	pop();

  // println("saving frame " + frameCount + "/" + numFrames);
 	// if(frameCount<=numFrames) saveFrame("fr###.png");
 	if(frameCount == numFrames) noLoop();

}
