class Snow {
	constructor() {
		this.flocons = [];
	}

	addF() {
		this.flocons.push(new Flocon());
	}

	update() {
		for (let i=this.flocons.length-1;i>=0;i--) {
			let f=this.flocons[i];
			wind = map(noise(i*frameCount/1000),0,1,-0.007,0.007);
			f.applyForce(createVector(wind,gravity));
			f.update();
			if (f.outScreen()) this.flocons.splice(i,1);
		}
	}

	show() {
		for(let i=this.flocons.length-1;i>=0;i--) {
			let f=this.flocons[i];
			f.show();
		}
	}
}