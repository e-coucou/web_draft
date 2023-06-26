let block1, block2;

let cpt = 0;
let cptDiv;
let digits = 4;
const pas = 100;
function setup() {
	createCanvas(700,320);
	const m2 = pow(100,digits-1)
	block1 = new Block(100,20,0,1,0);
	block2 = new Block(250,100,-5/pas,m2,block1.w);
	cptDiv = createDiv(cpt);
}
function draw() {
	background(151);
	stroke(255, 204, 250);
	strokeWeight(1);
	for (let i=0; i<pas;i++) {
	// print(cpt,block1.x,block2.x,block1.v);
		if (block1.collision(block2)) {
			const v1 = block1.bing(block2);
			const v2 = block2.bing(block1);
			block1.v = v1;
			block2.v = v2;
			cpt++;
		}
		if (block1.mur()) { block1.retour(); cpt++;}
		block1.update();
		block2.update();
	}
	block1.show();
	block2.show();
	stroke(255);
	line(0,height-block1.w,block1.x+50,height-block1.w)
	line(0,height-block2.w,block2.x+50,height-block2.w)

	cptDiv.html(nf(cpt,digits));
	if (block2.x>width-50) noLoop();
	// if (block2.v > block1.v && block2.v>0) {noLoop();}
}