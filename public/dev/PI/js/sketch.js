
let pi, f_pi;
let cpt = 2;
let rep = [];
let w;
let html_p;
let x0,y0,r0,w0=80;
let couleurs = ['#33FFFF','#FF3399', '#33FF99', '#FF3333', '#9933FF', '#FF9933', '#DFDF2D', '#FFFF33', '#FF3333','#3333FF','#99FF33']; 
// Torche:'#869F6C', V10:'#26BFBF', V40:'#1A8080'}
let choix = 2;
const r=2;

function preload() {
	f_pi = loadStrings("data/pi_million.txt");
}

function setup() {
	createCanvas(1000,700);
	w = width/10;
	pi = split(f_pi[0],"");

	for (let n=0;n<10;n++) {
		rep[n] = 0;
	}
	html_p = createP();
	x0=width/2; y0=height/2;
	r0=4;
	background(0);
	strokeWeight(1);
	noFill();
	// pixelDensity(1);
}

function draw() {
	// frameRate(10);
	// loadPixels();
	let x,y;
	if (cpt<10000) {
		switch (choix) {
		  case 0:
			let n = pi[cpt++];
			stroke(couleurs[n]);
			let a = n * TWO_PI/10;
			x = (x0 + r0*cos(a));
			y = (y0 + r0*sin(a));
			line(x0,y0,x,y);
			break;
		  case 1:
			// let p = get(x0,y0,1,1); //console.log(p.drawingContext.fillStyle);
			// if( p.drawingContext.fillStyle!='#000000') { console.log('yes'); r = 16;}
			n = pi[cpt++];
			stroke(couleurs[n]);
			a = n * TWO_PI/10;
			x = (x0 + r0*cos(a));
			y = (y0 + r0*sin(a));
			circle(x,y,r);
			break;
		  case 2:
		  	if(cpt===2) cpt++;
			stroke(couleurs[pi[cpt-1]]);
			x = ((cpt-3)%w0)*width/w0 +7;
			y = floor((cpt-3)/w0) *height/w0 +7;
			circle(x,y,2);
			stroke(couleurs[pi[cpt+1]]);
			circle(x,y,8);
			stroke(couleurs[pi[cpt++]]);
			circle(x,y,5);
			if (y>height) noLoop();
		}
		x0=x; y0=y;
	}
	if (cpt%100 === 0) {
		html_p.html(cpt);
	}
	// if (cpt<pi.length) {
	// 	rep[pi[cpt++]] += 1; // = rep[cpt++]+1 ;
	// }
	// if (cpt%100 === 0) {
	// 	background(51);
	// 	fill(255);
	// 	for (let n=0;n<10;n++) {
	// 		let x = n*w;
	// 		let y = map(rep[n],0,floor(cpt/10),height,100);
	// 		rect(x,y,w,height-y);
	// 	}
	// 	html_p.html(cpt);
	// }
	// updatePixels();
}
