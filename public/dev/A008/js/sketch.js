let eC = {version: 'r01'};
let value = [];
let array = [];
let states = [];
let scale = 6;
let read=0, permutations=0;
let ind=0;
let bubbleB,quicSort,reRand,mergeB,shellB,jumpDownB;
let scaleSlider;
let rand;
let espacements = [701, 301, 132, 57, 23, 10, 4, 1];

function init() {
	console.log("%c ¯\\_(ツ)_/¯ # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	bubbleB = createButton('Bubble');
	bubbleB.position(width-80,5);
	bubbleB.mousePressed(bubble);
	quicSort = createButton('Quicksort');
	quicSort.position(width-80,30);
	quicSort.mousePressed(quick);
	mergeB = createButton('Merge');
	mergeB.position(width-80,55);
	mergeB.mousePressed(merge_tri);
	shellB = createButton('Shell');
	shellB.position(width-80,80);
	shellB.mousePressed(shell_tri);
	jumpDownB = createButton('JumpDown');
	jumpDownB.position(width-80,105);
	jumpDownB.mousePressed(JD_tri);

	scaleSlider = createSlider(1,10,scale,1);
	scaleSlider.style('width:','100px')

	reRand = createButton('Reset');
	// rer.position(width-80,30);
	reRand.mousePressed(reset);

	rand = createCheckbox('noise/random',false);

}
function reset() {
	init_tri();
	array = [];
	for (let i =0; i< floor(width/scale);i++) {
		if (rand.checked()) {
			array[i] = noise(i/10)*height;
		} else {
			array[i] = random()*height;
		}
	}
	value = array.slice();
}

function setup() {
	createCanvas(800,400);
	init();

	divText = createP('text');
	divText.style('font-size','10px');
	divText.style('color','white');
	divText.position(10,2);
	
	reset();
	value = array.slice();
}

function init_tri(){
	scale=floor(scaleSlider.value());
	value = array.slice();
	ind=0; permutations=0;read=0;
	states = [];
}
async function JD_tri() {
	init_tri();
	tri_jump_down(value);
}
async function merge_tri() {
	init_tri();
	mergesort(value);
}

async function quick() {
	init_tri();
	quickSort(value,0,value.length-1);
}

async function bubble() {
	init_tri();
	for (i =0;i<value.length;i++) {
		ind = i;
		await tri_Bubble(value,i);
	}
}

async function shell_tri() {
	init_tri();
	shell(value);
}
async function tri_Bubble(arr,id) {
		for(let j = 0; j< arr.length-id-1; j++) {
			let a = arr[j];
			let b = arr[j+1];
			read+=2;
			if (a>b) { 
				await swap(arr,j,j+1); 
			}
		}
}

function draw() {
	background(0);
	noStroke();
	divText.html('#valeurs: '+floor(width/scale)+'<hr>'+'Permutions: '+permutations+'<br>'+'accès: '+read);

	for (let i=0; i< value.length;i++) {
		if (i<width/scale-ind-1) {
			fill('#D6FFB7');
		} else if (i>width/scale-ind-1) {
			fill('#E0777D');
		} else {
			fill(255);
		}
		switch (states[i]) {
		 case 1: fill('#E0777D');break;
		 case 2: fill('#D6FFB7'); break;
		 case 0: fill(207);break;
		}

		rect(i*scale,height-value[i],scale,value[i]);
	}
	// if (ind>=value.length-1) {
	// 	noLoop();
	// }


}

//-----------------------
// Utilities
//
async function swap (arr,i,j) {
	await sleep(0.01);
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
	read += 2;
	permutations++;
}

function sleep(ms) {
	return new Promise(resolve=>setTimeout(resolve,ms));
}
//-------------------------------------------------------------------------
// Merge Sort 

async function mergesort(arr) {
  var n = arr.length, a0 = arr, a1 = new Array(n);
  for (let i=0;i<n;i++) {
  	states[i] = 0;
  }
  for (var m = 1; m < n; m <<= 1) {
    for (var i = 0; i < n; i += m << 1) {
      var left = i,
          right = Math.min(i + m, n),
          end = Math.min(i + (m << 1), n);
      for(let j=0;j<n;j++) {
      	if (j<left || j>right) {
      		states[j] =0;
      	} else {
      		states[j]=2;
      	}
      }
      states[right]=1;states[left]=1;
      await merge_(a0, a1, left, right, end);
    }
    i = a0, a0 = a1, a1 = i; permutations += a0.length;
  }
  if (arr === a1) {
    for (var i = 0; i < n; ++i) {
      arr[i] = a0[i]; read++;
    }
  }
  for (let i=0;i<n;i++) {
  	states[i] = 0;
  }
}

async function merge_(a0, a1, left, right, end) {
  for (var i0 = left, i1 = right; left < end; ++left) {
	await sleep(1);
    if (i0 < right && (i1 >= end || a0[i0] <= a0[i1])) {
      a1[left] = a0[i0++];
    } else {
      a1[left] = a0[i1++];
    }
    read += 4;
  }
}
//-------------------------------------------------------------------------
// quick quicSort

async function quickSort(arr,s,e) {
	if (s>=e) {
		return;
	}

	let index= await partition(arr,s,e);
	states[index] = 0;
	await Promise.all([quickSort(arr,s,index-1), quickSort(arr,index+1,e)]);
	// await quickSort(arr,s,index-1);
	// await quickSort(arr,index+1,e);
	for (let i=0;i<arr.length;i++) {
		states[i] = 0;
	}
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
//-------------------------------------------------------------------------
//  Shell tri
async function shell(arr) {
	let n = arr.length; 
	for (e of espacements) {
		for (let i =e; i<n;i++) {
			for (let k=0;k<n;k++) {
				if (k<e || k>i) {states[k]=1;} else { states[k]=2;}
			}
			await sleep(1);
			let temp = arr[i]; read++;
			j =i;
			while (j>=e && arr[j-e] > temp) {
				arr[j] = arr[j - e];
				j -= e;
				read += 3;
			}
			arr[j] = temp; permutations++; read++;
		}
	}
}
//-------------------------------------------------------------------------
// tri jump down
async function tri_jump_down(arr) {
	for (let i =arr.length-1;i>0;i--) {
		for (let j=0;j<i;j++) {
			await sleep(1);
			if (arr[i]<arr[j]) swap(arr,i,j);
			read += 2;
		}
	}
}