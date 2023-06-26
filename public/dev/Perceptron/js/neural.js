class Perceptron {
	constructor(n) {
		this.weights = [];
		this.c=0.01;

		for (let i=0;i<n;i++) {
			this.weights[i] = random(-1,1);
		}
	}

	activate(sum) {
		if (sum>0) { return 1;
		} else { return -1;}
	}

	feedforward(inputs) {
		let sum = 0;
		for (let i=0; i<this.weights.length;i++) {
			sum += inputs[i] * this.weights[i] ;
		}
		return this.activate(sum);
	}

	train(inputs, desired) {
		let guess = this.feedforward(inputs);
		let error = desired - guess;
		for (let i=0; i<this.weights.length;i++) {
			this.weights[i] += this.c * inputs[i]*error;
		}
	}
}


// Trainer pour une ligne

class Trainer {
	constructor(x,y,a,n) {
		this.inputs = [];
		this.answer;

		this.inputs[0] = x;
		this.inputs[1] = y;
		for (let i =2 ; i<n;i++) {
			this.inputs[i] = 1;
		}	
		this.answer = a;
	}
}