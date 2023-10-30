class Vector2 {
    constructor(x_,y_) {
        this.x = x_;
        this.y = y_;
    }

    add(v, s=1) {
        this.x+=v.x*s;
        this.y+=v.y*s;
    }
    sub(v, s=1){
        this.x-=v.x*s;
        this.y-=v.y*s;
    }
    mult(s) {
        this.x *= s;
        this.y *= s;
    }
    dot(v) {
        return(this.x*v.x + this.y*v.y);
    }
    mag() {
        return (Math.sqrt(this.x*this.x + this.y*this.y));
    }
    norm(){
        let d= this.mag();
        this.x /= d;
        this.y /= d;
    }
    copy() {
        return new Vector2(this.x,this.y);
    }
    static sub(v1, v2, s=1) {
        return new Vector2((v1.x -v2.x)*s , (v1.y - v2.y)*s);
    }
    static dot(v1, v2) {
        return (v1.x*v2.x + v1.y * v2.y);
    }
}

