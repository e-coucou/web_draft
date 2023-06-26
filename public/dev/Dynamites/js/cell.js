function cell(i,j,w) {
	this.i = i;
	this.j = j;
	this.x=i*w;
	this.y=j*w;
	this.w=w-1;
	this.bombe= false;
	this.open=false;
	this.cpt = 0;
	this.flag = false;
}

cell.prototype.show = function () {

	stroke(0);
	if (this.flag) {
		fill('#007F7F');
	} else { 
		fill('#6BFAAE');
	}
	rect(this.x,this.y,this.w,this.w);
	if (this.open) {
		if (this.bombe) {
			fill(gagne?'#2C5BD1':'#B50563');
			circle(this.x+this.w/2,this.y+this.w/2,this.w/2);
		} else {
			fill(233);
			rect(this.x,this.y,this.w,this.w);
			fill(0);
			if (this.cpt>0) {
				textAlign(CENTER,CENTER);
				text(this.cpt,this.x+this.w/2,this.y+this.w/2);
			}
		}
	}
}

cell.prototype.ouvre = function() {
	this.open = true;
	reste--;
	if (reste==nbBombe) { win();}
	if (this.cpt==0) {
		this.ouvreAdj();
	}
}

cell.prototype.ouvreAdj = function() {
	for (let xo=-1;xo<2;xo++){
		for (let yo=-1;yo<2;yo++) {
			let i = this.i + xo;
			let j = this.j + yo;
			if (i>-1 && i<colonnes && j >-1 && j<lignes) {
				let voisin = grid[i][j];
				if (!voisin.bombe && !voisin.open) {
					voisin.ouvre();
				}
			}
		}
	}	
}

cell.prototype.cptAdj = function() {
	let sum = 0;
	
	if (this.bombe) return -1;

	for (let xo=-1;xo<2;xo++){
		for (let yo=-1;yo<2;yo++) {
			let i = this.i + xo;
			let j = this.j + yo;
			if (i>-1 && i<colonnes && j >-1 && j<lignes) {
				if (grid[i][j].bombe) {
					sum++; 
					// console.log(i,j,sum);
				}
			}
		}
	}

	return sum;
}

cell.prototype.val = function(x,y) {
	return (x>this.x && x<this.x+this.w && y>this.y && y< this.y +this.w);
}