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
		this.affNtw = true;
		this.w = 200;
		this.h = 150;
		this.x = width-this.w;
		this.y = height-this.h;
	}

	setRender(x,y,w,h) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
	}

	switchNtw() {
		this.affNtw = ! this.affNtw;
	}
	
	setLR(lr) {
		this.learning_rate = lr;
	}
	//
	copy() {
		return new NeuralNetwork(this);
	}
	log_Error(a,y) {
	    let epsilon = 1e-15;
	    return ( ( -y*Math.log(a + epsilon) - (1-y)*Math.log(1 - a + epsilon)));
	    // return (1/len(y) * np.sum( -y*np.log(a + epsilon) - (1-y)*np.log(1 - a + epsilon)))
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
		this.wih.map_(mutate);
		this.who.map_(mutate);
		this.bh.map_(mutate);
		this.bo.map_(mutate);

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
		this.i = input.copy();
		let h_i = Matrix.multiply(this.wih,input);
		h_i.add(this.bh);
		this.h_i = h_i.copy();
		let h_o = Matrix.map_(h_i,sigmoid);
		this.h_o = h_o.copy();
		// console.log(this.h_o);
		// h_i.print();
		let o_i = Matrix.multiply(this.who,h_o);
		o_i.add(this.bo);
		let output = Matrix.map_(o_i,sigmoid);
		this.o = output.copy();
		return output;
s	}

	train_EP(a,b) {
		// transforme array en matrice
		let inputs = Matrix.fromArray(a);
		let answer = Matrix.fromArray(b);
		// console.log(inputs)
		// generate hidden output
		let hidden = Matrix.multiply(this.wih,inputs);
		hidden.add(this.bh);
		// activation function
		hidden.map_(sigmoid);
		// generate outputs
		let outputs = Matrix.multiply(this.who,hidden);
		outputs.add(this.bo);
		outputs.map_(sigmoid);

		// console.table(outputs.matrix);
		// console.table(this.feedforward_EP(a).matrix);

		//calculate error output
		let output_error = Matrix.subtract(answer,outputs);

		// caculate gradient output
		let gradients = Matrix.map_(outputs,dsigmoid);
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
		let hidden_gradient = Matrix.map_(hidden,dsigmoid);
		hidden_gradient.multiply(hidden_error);
		hidden_gradient.multiply(this.learning_rate);

		// calculate input hidden deltas
		let inputT = Matrix.transpose(inputs);
		let delta_ih = Matrix.multiply(hidden_gradient,inputT);
		this.wih.add(delta_ih);
		this.bh.add(hidden_gradient);

		// console.log('train: ',outputs.matrix[0],b[0])
		return outputs.matrix[0];
	}

	inRender(x,y) {
		let inclus = (x > width - this.w && this.w< width && y>height-this.h && y<height);
		// console.log('coucou',x,y,inclus);
		return inclus;
	}

	render() {
		if (this.affNtw) {
			fill(0,120,120,120);
			noStroke();
			rect(this.x,this.y,this.w,this.h,20);
			let h0 = this.h / (this.Inb +1);
			let h1 = this.h / (this.Hnb +1);
			let h2 = this.h / (this.Onb +1);
			stroke(255,60);
			strokeWeight(1);
			for (let i=0; i<this.Inb;i++) {
				for (let j=0; j<this.Hnb;j++) {
					let c = map(this.wih.matrix[i][j], -10, 10, 0, 255);
					stroke(255,c);
					line(this.x+this.w/4, this.y + (i+1)*h0, this.x+this.w/2, this.y +(j+1)*h1);
				}
			}
			for (let i=0; i<this.Onb;i++) {
				for (let j=0; j<this.Hnb;j++) {
					let c = map(this.wih.matrix[i][j], -10, 10, 0, 255);
					stroke(255,c);
					line(this.x+3*this.w/4, this.y + (i+1)*h2, this.x+this.w/2, this.y +(j+1)*h1);
				}
			}
			noStroke();
			if (this.h_i) {
				for (let i=0; i<this.Inb;i++) {
					let c = map(this.h_i.matrix[i][0], -1, 1, 0, 255);
					fill(c,255);
					circle(this.x+this.w/4, this.y + (i+1)*h0, 10);
				}
				for (let i=0; i<this.Hnb;i++) {
					let c = map(this.h_o.matrix[i][0], -1, 1, 0, 255);
					fill(c,255);
					circle(this.x+this.w/2, this.y + (i+1)*h1, 10);
				}
				for (let i=0; i<this.Onb;i++) {
					let c = map(this.o.matrix[i][0], -1, 1, 0, 255);
					fill(c,255);
					circle(this.x+3*this.w/4, this.y + (i+1)*h2, 10);
				}
			}
		} else {
			this.w = 30;
			this.h = 30;
			fill(0,120,120,120);
			noStroke();
			let x = width-this.w;
			let y = height-this.h;
			rect(x,y,this.w,this.h, 6);
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
	// return (1/(1+Math.exp(-x)));
	let y = 1 / (1 + Math.pow(Math.E, -x));
	return y;
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