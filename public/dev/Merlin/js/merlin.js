class Merlin {
    constructor(dim, w = width, c=0) {
        this.N = dim;
        this.Carre=[];
        this.Solver=[];
        this.Pressed=[];
        this.Init = [];
        this.Game = false;
        this.w = w;
        this.c = c;
        this.nb = 0;
        this.keySol=[];
        this.showSol=false;
        this.init();
    }

    reSize(w, c) {
        this.w = w;
        this.c = c;
    }
    rePlay() {
        this.nb=0;
        this.Carre = [...this.Init];
        this.Pressed.fill(0);
    }

    switchSol() {
        this.showSol = ! this.showSol;
    }
    solve() {
        let n = Math.pow(2, this.Carre.length);
        let mess=[];
        this.keySol.fill(0);
        let oldKey = [...this.Pressed], oldNB = this.nb;
        for (let i=0; i<n ; i++ ) {
            mess = [];
            this.Solver = [...this.Init];
            for (let c=0;c<this.Solver.length;c++) {
                let v = Math.pow(2,c);
                if ((i&v)==v) {
                    mess.push(c);
                    this.joue(c,this.Solver);
                }
            }
            if (this.game(this.Solver)) {
                this.Solution=i;
                for (let k of mess) {
                    this.keySol[k]=1;
                }
                this.bestSol=this.keySol.reduce((a,v)=>{return a=a+v;},0);
            }
        }
        // this.Carre = [...this.Init];
        this.Pressed = [...oldKey];
        this.nb=oldNB;
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
        this.solve();
        this.showSol=false;
    }

    getID(x,y) {
        let w = this.w/this.N;
        let padding = w*0.1;
        if (x>(this.c+padding/2) & x<(width-this.c)) {
            let id = int((x-padding/4-this.c) / w) + (int(y/w))*this.N;
          return id;
        } else return -1;
    }

    switch(id,carre) {
        if ((id>=0) & (id<this.Carre.length) ) {
            carre[id] = ! carre[id];
        }
    }

    joue(id,carre=this.Carre) {
        this.nb++;
        this.Pressed[id] += 1;
        this.switch(id,carre);
        this.switch(id+this.N,carre);
        this.switch(id-this.N,carre);
        if ((id%this.N) != 0) {
            this.switch(id-1,carre);
        }
        if ((id%this.N) != (this.N-1)) {
            this.switch(id+1,carre);
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

    game(carre=this.Carre) {
        let test = carre.every(a=>{return a==true});
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
                    fill("#ff8022");
                }
            }
            rect(x,y,w-padding,w-padding,padding);
            fill("#f0e7fa");
            if (this.Pressed[id] > 0) {
                text("[#"+this.Pressed[id]+"]",x+w*0.8,y+w*0.8);
            }
            if (this.keySol[id] == 1 & this.showSol) {
                if (this.Pressed[id]%2 == 1) {
                    fill("#3700B3")
                }
                circle(x+w*0.1,y+w*0.1,w*0.1);
            }

        }
        fill("#f0e7fa");
        if (this.nb>this.Carre.length) fill("#b00020");
        noStroke();
        textSize(w/10);
        textAlign(LEFT,CENTER);
        text("#"+this.nb+"/"+this.bestSol,10,this.w+this.c);
    }
}