class Merlin {
    constructor(dim, w = width, c=0) {
        this.N = dim;
        this.Carre=[];
        this.Pressed=[];
        this.Init = [];
        this.Game = false;
        this.w = w;
        this.c = c;
        this.nb = 0;
        this.keySol=[];
        this.init();
    }

    rePlay() {
        this.nb=0;
        this.Carre = [...this.Init];
        this.Pressed.fill(0);
    }

    solve() {
        let n = Math.pow(2, this.Carre.length);
        let mess=[];
        this.keySol.fill(0);
        for (let i=0; i<n ; i++ ) {
            mess = [];
            this.Carre = [...this.Init];
            for (let c=0;c<this.Carre.length;c++) {
                let v = Math.pow(2,c);
                // console.log(v,i,i%v,c)
                if ((i&v)==v) {
                    mess.push(c);
                    this.joue(c);
                }
            }
            if (this.game()) {
                console.log('Successfull : ',i);
                this.Solution=i;
                for (let k of mess) {
                    this.keySol[k]=1;
                }
            }
        }
        this.Carre = [...this.Init];
        this.Pressed.fill(0);
        this.nb=0;
    }

    init() {
        this.Carre=[];
        this.Pressed=[];
        this.keySol = [];
        for (let i=0;i<this.N;i++) {
            // this.Carre[i]=[];
            for (let j=0;j<this.N;j++) {
                // this.Carre[i][j] = (random()>0.5)
                this.Carre.push(random()>0.8);
                this.Pressed.push(0);
                this.keySol.push(0);
            }
        }
        this.Init = [...this.Carre];
        this.nb = 0;
        this.game();
    }

    getID(x,y) {
        let w = this.w/this.N;
        let id = int(x / w) + (int(y/w))*this.N;
        return id;
    }

    switch(id) {
        if ((id>=0) & (id<this.Carre.length) ) {
            this.Carre[id] = ! this.Carre[id];
        }
    }

    joue(id) {
        this.nb++;
        this.Pressed[id] += 1;
        this.switch(id);
        this.switch(id+this.N);
        this.switch(id-this.N);
        if ((id%this.N) != 0) {
            this.switch(id-1);
        }
        if ((id%this.N) != (this.N-1)) {
            this.switch(id+1);
        }
    }

    play(x,y) {
        if ( ! this.Game ) {
            let id = this.getID(x,y);
            if (id>=0 & id<this.Carre.length) {
                this.joue(id);
            }
        }
        return (this.game());
    }

    game() {
        let test = this.Carre.every(a=>{return a==true});
        this.Game = test;
        return test;
    }
    show() {
        let w = this.w/this.N;
        let padding = w*0.1;
        noStroke();
        textSize(w/15);
        textAlign(CENTER,CENTER);
        for (let id=0;id<this.Carre.length;id++) {
            let x = int(id%this.N)*w +padding/2 + this.c;
            let y = int(id/this.N)*w +padding/2;
            fill("#6200EE");
            if (this.Carre[id]) {
                fill("#63DAC5");
                if (this.Game) {
                    fill("#b00020");
                }
            }
            rect(x,y,w-padding,w-padding,padding);
            fill("#f0e7fa");
            if (this.Pressed[id] > 0) {
                text("[#"+this.Pressed[id]+"]",x+w*0.8,y+w*0.8);
            }
            if (this.keySol[id] == 1) {
                circle(x+w*0.1,y+w*0.1,w*0.1);
            }

        }
        fill("#f0e7fa");
        if (this.nb>this.Carre.length) fill("#b00020");
        noStroke();
        textSize(w/5);
        textAlign(LEFT,CENTER);
        text("#"+this.nb,10,this.w+this.c);
    }
}