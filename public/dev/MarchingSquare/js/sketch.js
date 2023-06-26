const seed = Date.now();
let xOff = 0, yOff=0, zOff = 0;
let inc = 0.1;
let noise = new OpenSimplexNoise(Date.now());
// let noise = openSimplexNoise(seed);
let res = 5 ;
let index = 0,colonnes,lignes;
let field = [];
function setup() {
//	fullscreen();
	createCanvas(400,400);
	// pixelDensity(1);
	background(127);
	lignes = 1+height /res; colonnes = 1+width/res;
}

function keyPressed() {
	if (key == ' ') noLoop();
}
function draw() {
	index=0;
	xOff=0;
	field=[];
	background(0);
	for (let i=0; i<colonnes;i++) {
		xOff += inc;
		let k=[];
		yOff = 0;
		for (let j=0;j<lignes;j++) {
			//coul = map(noise.noise3D(xOff,yOff,zOff),-1,1,0,255);
			yOff += inc;
			k.push(noise.noise3D(xOff,yOff,zOff));
		}
		field.push(k);
	}
	zOff += 0.1;

	// loadPixels();
	for (let i=0; i<colonnes-1;i++) {
		for (let j=0;j<lignes-1;j++) {
			// pixels[index++] = coul;
			// pixels[index++] = coul;
			// pixels[index++] = coul;
			// pixels[index++] = 255;
			let x = i * res, y = j * res;
			let l,m,n,o;
			l=field[i][j]+1; // intervalle [0,2]
			m=field[i+1][j]+1;
			n=field[i+1][j+1]+1;
			o=field[i][j+1]+1;
			let a,b,c,d;
			a = createVector(x+res*m/(l+m),y);
			b = createVector(x+ res,y+res*n/(n+m));
			c = createVector(x+res*o/(n+o),y+res);
			d = createVector(x,y+res*o/(l+o));
			let val = (field[i][j]);
			// § Calcul d'une couleur ..
			// let coul = map(val,-1,0,0,256*256*256);
			// stroke(coul%256+200,(Math.floor(coul/256/256)),(Math.floor(coul/256)%256),255);
			strokeWeight(res*0.6);
			stroke(val*255+127);
			point(i*res,j*res);
			// square(i*res,j*res,res);
			let type = getType(i,j);
			strokeWeight(1);
			stroke(255);
			switch(type) {
				case 0:
					break;
				case 1:
				case 14: 
					ligne(c,d);
					break;
				case 2:
				case 13:
					ligne(b,c);
					break;
				case 3:
				case 12:
					ligne(b,d);
					break;
				case 4:
				case 11:
					ligne(a,b);
					break;
				case 5: ligne(a,d);ligne(b,c);
					break;
				case 6:
				case 9:
					ligne(a,c);
					break;
				case 7:
				case 8 : 
					ligne(a,d);
					break;
				case 10: ligne(a,b);ligne(c,d);
					break;
			}	
		}
	}
	// updatePixels();
	// noLoop();
}

function ligne(a,b) {
	line(a.x,a.y,b.x,b.y);
}

function getType(i,j) {
	return (ceil(field[i][j])*8 + 4*ceil(field[i+1][j]) + 2* ceil(field[i+1][j+1]) + ceil(field[i][j+1]));
}