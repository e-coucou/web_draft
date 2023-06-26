let villes = [];
let total = 15;
let permut = fact(total);
let cpt = 1;
let nbPop = 500;

let optiD = Infinity, bestP,currentP, current;

let one, two;
let ordre= [];

let scale = 3/2;

let population = [];
let fitness = [];

function setup(){
	createCanvas(600,600);
	for (let i=0;i<total;i++) {
		let v = createVector(random(width),random(height/3*2));
		villes[i] = v;
		ordre[i] = i;
	}

	for (let i=0;i<nbPop;i++) {
		// population[i]=ordre.slice();
		// melange(population[i],10);
		population[i] = shuffle(ordre);
	}

	console.log(population);

	//- Lexical ordre
	// let d = distance(villes,ordre);
	// optiD = d;
	// bestP = ordre.slice();
	
}


function draw() {
	background(51);
	// DNA Algo
	calcFitness();
	nextGeneration();

	//- Affiche les Villes
	//
	fill(0);
	stroke(255);
	strokeWeight(2);
	for(let i=0;i<villes.length;i++) {
		circle(villes[i].x, villes[i].y,9);
	}
	//-----
	// Draw ordre (Ex)
	//----
	strokeWeight(1);
	noFill();
	stroke(200);
	translate(width/scale,height/scale);
	beginShape();
	for(let i=0;i<currentP.length;i++) {
		let n = currentP[i];
		vertex(villes[n].x/scale/2,villes[n].y/scale/2);
	}
	endShape();
	translate(-width/scale,-height/scale);

	// permutation en mode aléatoire
	// let i = floor(random(villes.length));
	// let j = floor(random(villes.length));
	// swap(villes,i,j);

	// permutation en mode force brute
	// ordre = nextOrder(ordre);
	// let d = distance(villes,ordre);
	// if (d<optiD) {
	// 	optiD = d;
	// 	bestP = ordre.slice();
	// }

	strokeWeight(5);
	noFill();
	stroke(200,200,10);
	beginShape();
	for(let i=0;i<villes.length;i++) {
		vertex(villes[bestP[i]].x,villes[bestP[i]].y);
	}
	endShape();

	// affiche actuel ordre
	textSize(28);
	// let s = 'Calc : ', b='Best : ';
	// for(let i=0;i<ordre.length;i++) {
	// 	s += ordre[i];
	// 	b += bestP[i];
	// }
	fill(255);
	stroke(0);
	// text(s,20,height/3*2+100);
	// text(b,20,height/3*2+140);
	let avt = cpt/permut*100.0;
	text('avt= '+nf(avt,0,1)+' % ['+nf(optiD,0,0)+'] '+cpt+'('+nf(current,0,0)+')',20,height/3*2+180);

}


function distance(v,o) { // villes et ordre
	let sum = 0;
	for(let i=1; i<o.length;i++) {
		let f = o[i-1], e=o[i];
		let d = dist(v[f].x,v[f].y,v[e].x,v[e].y);
		sum += d;
	}
	return sum;
}

function swap(a,i,j) {
	let temp = a[i];
	a[i] = a[j];
	a[j] = temp;
}
function melange(arr,nb) {
	for(let i=0;i<nb;i++) {
		let a = floor(random(arr.length));
		let b = floor(random(arr.length));
		swap(arr,a,b);
	}
}
// lexical order

function nextOrder(arr) {
	//algo step One
	let one = -1;
	for (let i=0;i<arr.length-1;i++) {
		if(arr[i] <arr[i+1]) {
			one=i;
		}
	}
	if (one==-1) {
		noLoop(); 
		console.log(arr);
		console.log('Terminé');
		return arr;
	} 
	// alog step 2;
	for(let j=0;j<arr.length;j++) {
		if(arr[one]<arr[j]) {
			two = j;
		}
	}
	// algo step 3
	swap(arr,one,two);

	//algo step 4 (reverse )
	let end = arr.splice(one+1);
	end.reverse();
	arr = arr.concat(end);
	cpt++;
	return arr;
}

function fact(n) {
	if (n==1) return 1;
	return n * fact(n-1);
}
