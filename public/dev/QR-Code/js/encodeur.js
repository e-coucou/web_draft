class Binary {
    constructor(val_, n_=11) {
        this.value = val_;
        this.code = [];
        this.n = n_;
        for ( ;n_>0;){
            this.code.push(0);
            n_ -=1;
        }
    }
    encode() {
        let num = this.value;
        let b = num % 2;
        this.code[this.n-1] = b;
        for ( let v=this.n-2 ; num>1 ;v--) {
            num = int( num /2);
            b = num % 2
            this.code[v] = b;
        }
    }
    print() {
        console.log(this.value,this.code);
    }
}

class Encodeur {
    constructor(text_) {
        this.message = text_;
        this.messPoly = [];
        this.sub=[];
        this.code = [];
        this.mode = [0,0,1,0]; // Alphanumeric mode
        this.carCount = []; //[0,0,0,0,0,1,0,1,1]; // caractere count : nombrer de caractere a codee sur 9 bit en aloha11
        this.codeWorks = [];
        this.pad = [[1,1,1,0,1,1,0,0],[0,0,0,1,0,0,0,1]];
        this.block =[];
        this.blockBin= [];
    }
    setEC(code) {
        this.QRType = code;
    }
    split() {
        let l = round(this.message.length / 2);
        for (let n=0;n<l;n++) {
            this.sub.push(this.message.substring(2*n, 2*n+2));
        }
    }
    encode() {
        this.codeWorks.push(...this.mode);
        // a modifier compter les caractzres
        let crCount=this.message.length;
        this.carCount = new Binary(crCount,9);
        this.carCount.encode();
        this.codeWorks.push(...this.carCount.code);
        for (let p of this.sub) {
            if (p.length==2) {
                let v = 45 * alphabet[p[0]] + alphabet[p[1]];
                this.code.push(v);
                let b = new Binary(v); 
                b.encode(); 
                // b.print();
                this.codeWorks.push(...b.code);
            } else {
                let v = alphabet[p[0]];
                this.code.push(v);
                let b = new Binary(v,6); 
                b.encode();
                // b.print();
                this.codeWorks.push(...b.code);
            }
        }
        console.log('correction   ',this.codeWorks.length)
        this.codeWorks.push(...[0,0,0,0]);
        let l = this.codeWorks.length; let d = 8 - l%8; let a = [] ; for (let i =0; i<d;i++) { a.push(0);};
        this.codeWorks.push(...a);
        let p = (qrType.d*8-this.codeWorks.length)/8;
        for (let i=0;i<p;i++) {
            this.codeWorks.push(...this.pad[i%2]);
        }
        // this.binaire();
    }
    print() {
        for (let p of this.sub) {
            console.log(p);
        }
    }
    binaire(v_) {
        let b=v_.length/8;
        for (let i=0;i<b;i++) {
            let m='';
            for (let j=0;j<8;j++) {
                m+=v_[i*8+j];
            }
            console.log(i,m);
        }
    }
    convertDec() {
        let b=this.codeWorks.length/8;
        for (let i=0;i<b;i++) {
            let v=0;
            for (let j=0;j<8;j++) {
                if (this.codeWorks[i*8+j] == 1) { v += Math.pow(2,7-j);}
            }
            this.messPoly.push(v);
        }
        // console.log(this.messPoly);
    }
    errorCode(){
        let poly_ = codePoly[this.QRType.ec];
        // split du message
        let bl = [];
        let error = [];
        let st = 0;
        for (let i=0 ;i<this.QRType.G1;i++) {
            let a = this.messPoly.slice(st,st+this.QRType.dG1);
            bl.push(a);
            st += this.QRType.dG1;
        }
        // st=0;
        for (let i = 0;i<this.QRType.G2;i++) {
            let a = this.messPoly.slice(st,st+this.QRType.dG2);
            bl.push(a);
            st += this.QRType.dG2;
        }
        console.log('Blocks : ',bl);

        //step
        for (let i=0; i<bl.length ; i++ ) {
            let polyMess = new Polynome(bl[i]);
            console.log(polyMess)
            let iter =  polyMess.poly.length;
            // polyMess.pow(poly_.length-1); //console.log('crypt ',poly_.length);
            polyMess.pow(qrType.ec); //console.log('crypt ',poly_.length);
            // preparation des polynomes
            // console.log('compute steps',i, iter, poly_.length,polyMess);
            for (let i=0; i<iter ; i++) {
                // for (let i=0; i<iter ; i++) {
                    let polyGen = new Polynome(poly_,1); //console.log('gen',polyGen.poly[0].coef)
                polyGen.pow(iter); console.log(i,polyGen.poly.length,polyMess.poly.length,polyGen,polyMess)
                polyMess.poly[0].toAlpha();
                let v = polyMess.poly[0].alpha; //console.log(polyMess.poly[0].coef,v);
                polyGen.addAlpha(v);
                polyGen.toInt();
                polyMess.xor(polyGen);
                polyMess.reduit();
            }
            let e = polyMess.getCode();
            // console.log(i,e);
            error.push(e);
        }
        console.log(error);
        // interleave CodeWorks
        let m = max(this.QRType.dG1, this.QRType.dG2);
        for (let i=0; i<m; i++) {
            for (let j=0; j<bl.length;j++) {
        
                let v = bl[j][i];
                if ( v != undefined) { this.block.push(v); }
            }
        }
        // interleave Error
        for (let i=0; i<this.QRType.ec; i++) {
            for (let j=0; j<bl.length;j++) {
                let v = error[j][i];
                if ( v != undefined) { this.block.push(v); }
            }
        }
        console.log(this.block);
        for (let b of this.block) {
            let e = new Binary(b,8); 
            e.encode();
            this.blockBin.push(...e.code);
        }
        // ajouter ici les bit manquants
        let pad = [];
        for (let i=0;i<padding[version];i++) {
            pad.push(0);
        }
        console.log('pad',pad);
        this.blockBin.push(...pad);

        this.show(this.blockBin);
    }
    show(arr) {
        let str='';
        for (let c of arr) {
            str += c;
        }
        console.log(str);
    }
}