class DNA {
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,. :;!'-_=/&@#?0123456789éùèàç";
    constructor(l_) {
        this.genes = [];
        this.n = l_;
        this.score=0;
        this.bkColor = color(0,0,0);
        for (let i=0; i<this.n ; i++) {
            this.genes.push(this.newGene());
        }
    }

    newGene() {
        // let c = floor(random(96,123));
        // if (c==96) c=32;
        // return (String.fromCharCode(c));
        let c = floor(random(this.alphabet.length));
        return this.alphabet.charAt(c);
    }

    fitness(cible) {
        let cpt=0;
        for (let i=0;i<this.n;i++) {
            if (cible.charAt(i) == this.genes[i]) cpt+=1;
        }
        this.score= (pow(cpt/this.n, 4));
        // this.score= cpt/this.n;
        return this.score;
    }

    cross(partenaire){
        let cut = floor(random(this.n));
        let newGenes = [...this.genes.slice(0,cut),...partenaire.genes.slice(cut,this.n)];
        return newGenes;
    }

    mutation(m_){
        for (let i=0;i<this.n; i++) {
            let p=random();
            if (p<m_) {
                let nG = this.newGene();
                // console.log(g, nG);
                this.genes[i]=nG;
            }
        }
    }

    show(y=100,x0=0) {
        textAlign(CENTER,CENTER);
        textSize(24);
        for (let i=0; i<this.n;i++) {
            let x = (i+1)*24 + x0;
            fill(this.bkColor);
            stroke(255);
            rect(x-10,y-15,21,30);
            fill(255);
            text(this.genes[i],x,y);
        }
    }
}