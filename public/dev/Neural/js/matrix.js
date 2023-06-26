class Matrix {
constructor(rows,cols) {
	this.rows=rows;
	this.cols=cols;
	this.matrix = [];

	for(let i =0;i<this.rows;i++) {
		this.matrix[i] = [];
		for(let j=0;j<this.cols;j++) {
			this.matrix[i][j] = 0;
		}
	}
}

static multiply(a,b) {
	if (a.cols !== b.rows) {
		console.log("cols A don't match rows B");
		return undefined;
	} else {
		let result = new Matrix(a.rows,b.cols);
		for(let i =0;i<result.rows;i++) {
			for(let j=0;j<result.cols;j++) {
				var sum = 0;
      			for (var k = 0; k < a.cols; k++) {
       				sum += a.matrix[i][k] * b.matrix[k][j];
     			}
   				result.matrix[i][j] = sum;
     		}
		}
		return result;
	}
}
multiply(n) {
  if (n instanceof Matrix) {
	for(let i =0;i<this.rows;i++) {
		for(let j=0;j<this.cols;j++) {
			this.matrix[i][j] *= n.matrix[i][j];
		}
	}
  } else {
	for(let i =0;i<this.rows;i++) {
		for(let j=0;j<this.cols;j++) {
			this.matrix[i][j] *= n;
		}
	}
  }
}
static subtract(a,b) {
	let result = new Matrix(a.rows,a.cols);
	for(let i =0;i<a.rows;i++) {
		for(let j=0;j<a.cols;j++) {
			result.matrix[i][j] = a.matrix[i][j]-b.matrix[i][j];
		}
	}
	return result;
}

add(n) {
	if (n instanceof Matrix) {
		for(let i =0;i<this.rows;i++) {
			for(let j=0;j<this.cols;j++) {
				this.matrix[i][j] += n.matrix[i][j];
			}
		}
	} else {
		for(let i =0;i<this.rows;i++) {
			for(let j=0;j<this.cols;j++) {
				this.matrix[i][j] += n;
			}
		}
	}
}

randomize() {
	for(let i =0;i<this.rows;i++) {
		for(let j=0;j<this.cols;j++) {
			this.matrix[i][j] = (Math.random()*20-10);
		}
	}
}

static transpose(a) {
	let result = new Matrix(a.cols,a.rows);
	for (let i=0; i<a.rows;i++) {
		for (let j=0;j<a.cols;j++) {
			result.matrix[j][i] = a.matrix[i][j];
		}
	}
	return result;
}

map(fct) {
	for(let i =0;i<this.rows;i++) {
		for(let j=0;j<this.cols;j++) {
			let v = this.matrix[i][j];
			this.matrix[i][j] = fct(v);
		}
	}
}
static map(a,fct) {
	let result = new Matrix(a.rows,a.cols);
	for(let i =0;i<result.rows;i++) {
		for(let j=0;j<result.cols;j++) {
			let v = a.matrix[i][j];
			result.matrix[i][j] = fct(v);
		}
	}
	return result;
}

static fromArray(a) {
	let result = new Matrix(a.length,1);
	for (let i=0;i<a.length;i++) {
		result.matrix[i][0] = a[i];
	}
	// result.print();
	return result;
}


print() {
	console.table(this.matrix);
}

} // end of class 