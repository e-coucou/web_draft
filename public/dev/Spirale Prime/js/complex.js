class Complex {
    constructor(reel,imaginaire) {
        this.re = reel;
        this.im = imaginaire;
    }

    add(o) {
        const ret = new Complex(this.re+o.re, this.im+o.im);
        return ret;
    }
    sub(o) {
        const ret = new Complex(this.re-o.re, this.im-o.im);
        return ret;
    }
    scalar(s) {
        const ret = new Complex(this.re*s, this.im*s);
        return ret;
    }
    mul(o) {
        const ret = new Complex(this.re*o.re - this.im*o.im, this.re*o.im + this.im*o.re);
        return ret;
    }
    sqrt() {
        let r = Math.sqrt(this.re*this.re+this.im*this.im);
        let a = atan2(this.im,this.re);
        r = Math.sqrt(r);
        a = a/2;
        return (new Complex(r*Math.cos(a), r*Math.sin(a)));
    }
}