let DEV = false;
const w = 600;
const h = 600;

let buffer, result;
let samplesPerFrame=3;
let shutterAngle = 1.5;
let numFrames = 100;
let frameCpt = 0;
let Boucle=false;

function ease(p, g) {
  if (p < 0.5) 
    return 0.5 * pow(2*p, g);
  else
    return 1 - 0.5 * pow(2*(1 - p), g);
}

function draw() {
  if (DEV) {
    // t = mouseX*1.0/width;
    // c = mouseY*1.0/height;
    // if (mouseIsPressed)
      // println(c);
	t = map(frameCpt-1, 0, numFrames, 0, 1);
	t = ease(t,1);
    draw_();
  } else {
    // for (let i=0; i<result.length; i++)
    //     result[i] = 0;
 
    c = 0;
    for (let sa=0; sa<samplesPerFrame; sa++) {
	    t = map(frameCpt-1 + sa*shutterAngle/samplesPerFrame, 0, numFrames, 0, 1);
     	draw_();
     	// buffer.loadPixels();
	    loadPixels();
      for (let i=0; i<pixels.length; i+=4) {
        result[i] += pixels[i+2]; // >> 16 & 0xff;
        result[i+1] += pixels[i+1]; // >> 8 & 0xff;
        result[i+2] += pixels[i];// & 0xff;
      }
    }
 
    loadPixels();
    for (let i=0; i<pixels.length; i+=4) {
	      // buffer.pixels[i] = 0xff << 24 | 
    	  //   (result[i]*1.0/samplesPerFrame) << 16 | 
    	  //   (result[i]*1.0/samplesPerFrame) << 8 | 
    	  //   (result[i]*1.0/samplesPerFrame);
	      pixels[i+3] = 0xff | 
    	    (result[i+2]*1.0/samplesPerFrame)| 
    	    (result[i+1]*1.0/samplesPerFrame)| 
    	    (result[i]*1.0/samplesPerFrame);
    	}
    updatePixels();
 
    // saveFrame("fr#");
  }
  // image(buffer,0,0);
    frameCpt++;
    if (frameCpt===numFrames ) {
    	if (Boucle) {
			frameCpt=0;
  			t=0; c=0;
    	} else {
    		console.log('fin de boucle');
    		noLoop();
  		}
  	}
}



//----------------------------------------------------------------
let objets = [];
let m = 500;
let delay = 1.2;
let noise = new OpenSimplexNoise();
let motion = 0.35;
let n = 10;
let p0;
let t;
//--
let startB;

function initObjets() {

}

function reStart() {
	t=0;
	frameCpt = 0;
	loop();
}
function checkBChange() {
	Boucle = this.checked();
}

function setup() {
	createCanvas(w, h);
	startB = createButton('ReStart');
	startB.mousePressed(reStart);
	checkB = createCheckbox('Boucle',Boucle);
	checkB.changed(checkBChange);

	p0 = createVector(width/2,height-5);
	buffer = createGraphics(w,h);
	result = createGraphics(w,h);
	for (let i= 0; i<n;i++) {
		objets.push(new Objet(random(0.1,0.9)*w,random(0.1,0.6)*h,random(50,200)));
	}
}


function draw_(){
	background(0);
	fill(255); stroke(255),strokeWeight(8);
	p0.x = width/2 +30*noise.noise2D(cos(TWO_PI*t),sin(TWO_PI*t));
	p0.y = height-5 + 5*noise.noise2D(cos(TWO_PI*t),sin(TWO_PI*t));
	point(p0.x,p0.y);
	for ( let i =0; i< objets.length; i++ ) {
		objets[i].show(p0);
	}
}

//--------
// 
class Objet {

	constructor(x,y,r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.seedx = random(1200,1500);
		this.seedy = random(1400,1700);
		this.x1n = (t) => { 
			// let seed = 1337;
			return this.x + this.r*noise.noise2D(this.seedx+motion*cos(TWO_PI*t),motion*sin(TWO_PI*t));}

		this.y1n = (t) =>  {
			// let seed = 1515;
			return this.y + this.r*noise.noise2D(this.seedy+motion*cos(TWO_PI*t),motion*sin(TWO_PI*t)); }

		// let x1 = (t) => 0.25*width + 50*cos(TWO_PI*t); 
		// let y1 = (t) =>  0.5*width + 50*sin(TWO_PI*t); 
		this.x2 = (t) =>  this.x + this.r*cos(2*TWO_PI*t); 
		this.y2 = (t) =>  this.y + this.r*sin(2*TWO_PI*t); 

	}

	show(p) {
		stroke(255,255,255,100);
		strokeWeight(3);
	 	circle(this.x1n(t),this.y1n(t),1);
 		// ellipse(x2(t),y2(t),6,6);
		push();
		strokeWeight(1);
		for(let i=0;i<=m;i++){
			let tt = 1.0*i/m;
	 
			// let x = lerp(this.x1n(t-delay*tt),this.x2(t-delay*tt),tt);
			// let y = lerp(this.y1n(t-delay*tt),this.y2(t-delay*tt),tt);
			let x = lerp(this.x1n(t-delay*tt),p.x,tt);
			let y = lerp(this.y1n(t-delay*tt),p.y,tt);
			point(x,y);
		}
		pop();
	}

	update() {


	}
}


