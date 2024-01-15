class Mnist {
    constructor(csv) {
        this.csv = csv;
        this.label;
        this.data = [];
        this.img = createImage(28,28);

        this.init();
    }

    init() {
        let l = (int(this.csv.arr[0]));
        let iT = Array.from(tf.oneHot([l], 10).dataSync());
        this.label = iT;

        this.img.loadPixels();
        for (let i=1;i<this.csv.arr.length;i++) {
            let v = int(this.csv.arr[i]);
            this.data.push(v/255);
            let x = int((i-1)%28);
            let y = int((i-1)/28);
            this.img.set(x,y,v);
        }
        this.img.updatePixels();
    }
}

class dataSet {
    constructor(data,x,y,w,h) {
        this.x=x;
        this.y=y;
        this.w=w;
        this.origine=data;
        this.dataSet=[];
        this.inc=30;
        this.lw = int(w/this.inc);
        this.lh = int(h/this.inc);
        this.page=0;
    }
    build(n) {
        this.n=n;
        for (let i=0; i<this.n;i++) {
            let mn = new Mnist(this.origine[i]);
            this.dataSet.push({label:mn.label, data:mn.data, img:mn.img, ok: true});
        }
        this.maxPage = int(n / this.lw / this.lh);
        this.origine = ''; //clear memory 
    }

    predict(model) {
        tf.tidy( () => {
            for (let mn of this.dataSet) {
                let xS = tf.tensor2d([mn.data]);
                let pred = tf.argMax(model.predict(xS).dataSync()).dataSync()[0];
                let label = tf.argMax(mn.label).dataSync()[0];
                mn.ok=true;
                if (label != pred) mn.ok = false;
            }
        });
    }

    pageUP() {
        if (this.page > 0) this.page--;
    }

    pageDOWN() {
        if (this.page < this.maxPage) this.page++;
    }

    value(x,y) {
        let idS = this.page * this.lw * this.lh;
        if (x>this.x && x<(this.x+this.inc*this.lw) && y>this.y && y<(this.y+this.inc*this.lh)) {
            let id =int((x-this.x)/this.inc)%this.lw + int((y-this.y)/this.inc)*this.lw + idS;
            if (id<this.dataSet.length) {
                const label = tf.argMax(this.dataSet[id].label).dataSync()[0];
                return [this.dataSet[id],label];
            } else return [null, null];
        } else return [null,null];
    }

    show() {
        let i=0,j=0;
        let idS = this.page * this.lw * this.lh;
        for (let id=idS; id<this.dataSet.length;id++) {
            let mn = this.dataSet[id];
            noFill();stroke(50);
            if ( !mn.ok) stroke(255,0,0); 
            rect(this.x+i*this.inc,this.y+j*this.inc,this.inc-1,this.inc-1);
            image(mn.img,this.x+1+i*this.inc,this.y+1+j*this.inc);
            i++;
            if (i>=this.lw) {j++; i=0};
            if (j>=this.lh) break;
        }
    }
}