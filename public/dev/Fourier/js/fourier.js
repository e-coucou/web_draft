class Complex {
	constructor(re,im) {
		this.re = re;
		this.im = im;
	}

	mul(c) {
		const re = this.re*c.re - this.im*c.im;
		const im = this.re*c.im + this.im*c.re;

		return new Complex(re,im);
	}

	add(c) {
		this.re += c.re;
		this.im += c.im; 
	}
}

function dft(x) {
	let X = []; 
	const N =  x.length;
	for (let k = 0; k<N;k++) {
		let sum = new Complex(0,0);
		for(let n=0;n<N;n++) {
			const Phi = (TWO_PI*k *n) / N;
			const c = new Complex(cos(Phi), -sin(Phi));
			sum.add(x[n].mul(c));
		}
		sum.re = sum.re / N;
		sum.im = sum.im / N;

		let amp = sqrt(sum.re*sum.re+sum.im*sum.im);
		let phase = atan2(sum.im,sum.re);
		let freq = k;
		X[k] = {re:sum.re , im: sum.im, freq, amp, phase };
	}
	return X;
}