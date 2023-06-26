let planetes = [];
let cam;

function setup() {
	createCanvas(800,600,WEBGL);
	planetes.push( new Planete(50,0) );
	planetes.push( new Planete(20,200,planetes[0]) );
	planetes.push( new Planete(5,40,planetes[1]) );
	planetes[2].speed = 0.1;
	cam = createCamera();
	cam.setPosition(-300,-300,-300);
	cam.lookAt(0,0,0);
}

function draw() {
	background(0);
	lights();
	for (let i=0;i<planetes.length;i++) {
		planetes[i].move();
		planetes[i].show();
	}
}