let rand = [];
let sorted = [];
let i = 0, j=0;
let scale = 2;
let states = [];
let permutations = 0; let read=0;
let divText;

function setup() {
	createCanvas(800,300);
	divText = createP('text');
	divText.style('font-size','10px');
	divText.style('color','white');
	divText.position(10,2);
	for (let i = 0; i< width/scale;i++) {
		rand[i] = noise(i/100)*height;
		// rand[i] = random(height);
		states[i] = 0;
	}
//sort ...
// by processing
//	rand = sort(rand);

	quickSort(rand,0,rand.length-1);

}

async function swap (arr,i,j) {
	// await sleep(1);
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
	read += 4;
	permutations++;
}

async function quickSort(arr,s,e) {
	if (s>=e) {
		console.log('end');
		return;
	}

	let index= await partition(arr,s,e);
	states[index] = 0;
	await Promise.all([quickSort(arr,s,index-1), quickSort(arr,index+1,e)]);
	// await quickSort(arr,s,index-1);
	// await quickSort(arr,index+1,e);
}

async function partition(arr,start,end) {
	let pivotI = start;
	let pivotV = arr[end]; read++;
	for (let i =start; i<end;i++) {
		states[i] = 2;
	}
	states[pivotI]=1;
	for( let i = start; i<end;i++) {
		if(arr[i]< pivotV) {
			await swap(arr,i,pivotI);
			states[pivotI] = 0;
			pivotI++;
			states[pivotI] = 1;
		}
		read++;
	}
	states[pivotI]=1;
	await swap(arr,pivotI,end);
	for (let i =start; i<end;i++) {
		if (i != pivotI)  states[i] = 0;
	}
	return pivotI;
}

function draw() {
	background(51);
	fill(255); noStroke();
	divText.html('#valeurs: '+width/scale+'<hr>'+'Permutions: '+permutations+'<br>'+'accès: '+read);

	for(let i = 0; i< rand.length;i++) {
		switch (states[i]) {
		 case 1: fill('#E0777D');break;
		 case 2: fill('#D6FFB7'); break;
		 case 0: fill(207);break;
		}
		rect(i*scale,height-rand[i],scale,rand[i]);
	}

}


function sleep(ms) {
	return new Promise(resolve=>setTimeout(resolve,ms));
}