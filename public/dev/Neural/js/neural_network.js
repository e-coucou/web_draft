class NeuralNetwork {
	constructor (Inb,Hnb,Onb) {
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
		this.learnbing_rate = 0.2;
	}
	
	setLR(lr) {
		this.learnbing_rate = lr;
	}
	feedforward_EP(a) {
		let input = Matrix.fromArray(a);
		let h_i = Matrix.multiply(this.wih,input);
		h_i.add(this.bh);
		let h_o = Matrix.map(h_i,sigmoid);
		// h_i.print();
		let o_i = Matrix.multiply(this.who,h_o);
		o_i.add(this.bo);
		let output = Matrix.map(o_i,sigmoid);
		
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
		gradients.multiply(this.learnbing_rate);

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
		hidden_gradient.multiply(this.learnbing_rate);

		// calculate input hidden deltas
		let inputT = Matrix.transpose(inputs);
		let delta_ih = Matrix.multiply(hidden_gradient,inputT);
		this.wih.add(delta_ih);
		this.bh.add(hidden_gradient);

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