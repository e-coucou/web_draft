class Point {
	constructor(x,y,parent) {
		this.x =x;
		this.y = y;
		this.parent = parent;
	}
}


class Rectangle {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h; 
		this.divided = false;
	}
	contains(point) {
		return(point.x >= this.x-this.w && point.x <= this.x + this.w && point.y >= this.y -this.h && point.y <= this.y +this.h);
	}
	intersect(range) {
		return !(range.x- range.w > this.x + this.w || range.x + range.w < this.x - this.w ||
			range.y- range.h > this.y + this.h || range.y + range.h < this.y - this.h);
	}
}

class Quadtree {
	constructor(boundary,n) {
		this.boundary = boundary;
		this.capacity = n;
		this.points = [];
	}

	insert(point) {
		if (!this.boundary.contains(point)) {
			return false;
		}
		if (this.points.length < this.capacity) {
			this.points.push(point);
			return true;
		} else {
			if (!this.divided) {
				this.subdivide();
			}
			if (this.NE.insert(point)) {return true; } else if 
				(this.NW.insert(point)) {return true;} else if 
				(this.SE.insert(point)) {return true; } else if 
				(this.SW.insert(point)) {return true;}
		}
	}
	subdivide() {
		let x = this.boundary.x;
		let y = this.boundary.y;
		let w = this.boundary.w;
		let h = this.boundary.h;
		let NW = new Rectangle(x-w/2,y-h/2,w/2,h/2);
		this.NW = new Quadtree(NW,this.capacity);
		let NE = new Rectangle(x+w/2,y-h/2,w/2,h/2);
		this.NE = new Quadtree(NE,this.capacity);
		let SW = new Rectangle(x-w/2,y+h/2,w/2,h/2);
		this.SW = new Quadtree(SW,this.capacity);
		let SE = new Rectangle(x+w/2,y+h/2,w/2,h/2);
		this.SE = new Quadtree(SE,this.capacity);
		this.divided = true;
	}

	query(range,found) {
		if(!found) found = [];
		if (!this.boundary.intersect(range)) {
			return found;
		} else {
			for (let p of this.points) {
				if (range.contains(p)) {
					found.push(p.parent);
				}
			}
			if (this.divided) {
				this.NE.query(range,found);
				this.NW.query(range,found);
				this.SE.query(range,found);
				this.SW.query(range,found);
			}
		}
		return found;
	}

	show() {
		push()
		rectMode(CENTER);
		stroke(255);
		strokeWeight(1);
		noFill();
		rect(this.boundary.x,this.boundary.y, this.boundary.w*2,this.boundary.h*2);
		if(this.divided) {
			this.NE.show();
			this.NW.show();
			this.SE.show();
			this.SW.show();
		}
		stroke(255,240,240);
		strokeWeight(3);
		for( let p of this.points) {
			point(p.x,p.y);
		}
		pop();
	}
}