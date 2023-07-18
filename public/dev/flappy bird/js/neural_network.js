class NeuralNetwork {
	constructor (Inb,Hnb,Onb) {
		if (Inb instanceof NeuralNetwork) {
			this.Inb = Inb.Inb;
			this.Hnb = Inb.Hnb;
			this.Onb = Inb.Onb;
	// Mine
			this.wih =  Inb.wih.copy();
			this.who = Inb.who.copy();
			this.bh = Inb.bh.copy();
			this.bo = Inb.bo.copy();
		} else {
			this.Inb = Inb;
			this.Hnb = Hnb;
			this.Onb = Onb;
	// Mine
			this.wih =  new Matrix(this.Hnb,this.Inb);
			this.who = new Matrix(this.Onb,this.Hnb);
			this.bh = new Matrix(this.Hnb,1);
			this.bo = new Matrix(this.Onb,1);
			this.wih.randomize();
			this.who.randomize();
			this.bh.randomize();
			this.bo.randomize();
	//--
		}

		this.h_o;
		this.h_i;
		this.o;
		this.learning_rate = 0.2;
	}
	
	setLR(lr) {
		this.learning_rate = lr;
	}
	//
	copy() {
		return new NeuralNetwork(this);
	}

	mutate(r_) {
		function mutate(val) {
			if (Math.random() < r_) {
				// return 2 * Math.random() - 1;
				return val + randomGaussian(0,0.1);
			} else {
				return val;
			}
		}
		this.wih.map(mutate);
		this.who.map(mutate);
		this.bh.map(mutate);
		this.bo.map(mutate);

	}
	static deserialize(data) {
		if (typeof data == 'string') {
		  data = JSON.parse(data);
		}
		let nn = new NeuralNetwork(data.Inb, data.Hnb, data.Onb);
		nn.wih = Matrix.deserialize(data.wih);
		nn.who = Matrix.deserialize(data.who);
		nn.bh = Matrix.deserialize(data.bh);
		nn.bo = Matrix.deserialize(data.bo);
		nn.l = data.learning_rate;
		return nn;
	  }
	predic(a) {
		return this.feedforward_EP(a).matrix;
	}
	
	feedforward_EP(a) {
		let input = Matrix.fromArray(a);
		let h_i = Matrix.multiply(this.wih,input);
		h_i.add(this.bh);
		this.h_i = h_i.copy();
		let h_o = Matrix.map(h_i,sigmoid);
		this.h_o = h_o.copy();
		// console.log(this.h_o);
		// h_i.print();
		let o_i = Matrix.multiply(this.who,h_o);
		o_i.add(this.bo);
		let output = Matrix.map(o_i,sigmoid);
		this.o = output.copy();
		
		return output;
s	}

	train_EP(a,b) {
		// transforme array en matrice
		let inputs = Matrix.fromArray(a);
		let answer = Matrix.fromArray(b);
		// generate hidden output
		let hidden = Matrix.multiply(this.wih,inputs);
		hidden.add(this.bh);
		// activation function
		hidden.map(sigmoid);
		// generate outputs
		let outputs = Matrix.multiply(this.who,hidden);
		outputs.add(this.bo);
		outputs.map(sigmoid);

		// console.table(outputs.matrix);
		// console.table(this.feedforward_EP(a).matrix);

		//calculate error output
		let output_error = Matrix.subtract(answer,outputs);

		// caculate gradient output
		let gradients = Matrix.map(outputs,dsigmoid);
		gradients.multiply(output_error);
		gradients.multiply(this.learning_rate);

		//calculate delta
		let hiddenT = Matrix.transpose(hidden);
		let delta_ho = Matrix.multiply(gradients,hiddenT);
		// adjust the weigth by delta
		this.who.add(delta_ho);
		//adjust bias by gradient
		this.bo.add(gradients);

		//calculate the hidden error
		let whoT = Matrix.transpose(this.who);
		let hidden_error = Matrix.multiply(whoT,output_error);
		//calculate hidden gradient
		let hidden_gradient = Matrix.map(hidden,dsigmoid);
		hidden_gradient.multiply(hidden_error);
		hidden_gradient.multiply(this.learning_rate);

		// calculate input hidden deltas
		let inputT = Matrix.transpose(inputs);
		let delta_ih = Matrix.multiply(hidden_gradient,inputT);
		this.wih.add(delta_ih);
		this.bh.add(hidden_gradient);

	}

	render() {
		fill(0,120,120,120);
		noStroke();
		let w = 150;
		let h = 100;
		let x = width-w;
		let y = height-h;
		rect(x,y,w,h);
		let h0 = h / (this.Inb +1);
		let h1 = h / (this.Hnb +1);
		let h2 = h / (this.Onb +1);
		stroke(255,60);
		strokeWeight(1);
		for (let i=0; i<this.Inb;i++) {
			for (let j=0; j<this.Hnb;j++) {
				let c = map(this.wih.matrix[i][j], -10, 10, 0, 255);
				stroke(255,c);
				line(x+w/4, y + (i+1)*h0, x+w/2, y +(j+1)*h1);
			}
		}
		for (let i=0; i<this.Onb;i++) {
			for (let j=0; j<this.Hnb;j++) {
				let c = map(this.wih.matrix[i][j], -10, 10, 0, 255);
				stroke(255,c);
				line(x+3*w/4, y + (i+1)*h2, x+w/2, y +(j+1)*h1);
			}
		}
		noStroke();
		for (let i=0; i<this.Inb;i++) {
			let c = map(this.h_i.matrix[i][0], -1, 1, 0, 255);
			fill(c,255);
			circle(x+w/4, y + (i+1)*h0, 10);
		}
		for (let i=0; i<this.Hnb;i++) {
			let c = map(this.h_o.matrix[i][0], -1, 1, 0, 255);
			fill(c,255);
			circle(x+w/2, y + (i+1)*h1, 10);
		}
		for (let i=0; i<this.Onb;i++) {
			let c = map(this.o.matrix[i][0], -1, 1, 0, 255);
			fill(c,255);
			circle(x+3*w/4, y + (i+1)*h2, 10);
		}
	}

}

// function matrix_random(a,r,c) {
// 	for (let i =0;i<r;i++) {
// 		for(let j =0;j<c;j++) {
// 			a.subset(math.index(i,j), Math.random()*2-1);
// 		}
// 	}
// }


function sigmoid(x) {
	return (1/(1+Math.exp(-x)));
	// let y = 1 / (1 + pow(Math.E, -x));
	// return y;
}


function dsigmoid(y) {
	return (y * (1-y));
}


function mapFct(a,func) {
	let ret = nj.zeros([a.shape[0],a.shape[1]]);
	for (let i=0; i<a.shape[0];i++) {
		if (a.ndim>1) {
	 		for( let j = 0;j<a.shape[1];j++) {
				let v = a.get(i,j);
				ret.set(i,j, func(v));
			}
		} else {
				let v = a.get(i);
				ret.set(i, func(v));
		}
	}
	return ret;
}