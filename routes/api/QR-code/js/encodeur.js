const { Polynome, logTable, createPoly } = require("./reed_salomon");

const caracteres = [{l:1,h:9,A:{l:9},N:{l:10},B:{l:8}},{l:10,h:26,A:{l:11},N:{l:12},B:{l:16}},{l:27,h:40,A:{l:13},N:{l:14},B:{l:16}}];
const padding = [0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,3,3,3,3,3,3,4,4,4,4,4,4,4,3,3,3,3,3,3,3,0,0,0,0,0,0];

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
            num = Math.trunc( num /2);
            b = num % 2
            this.code[v] = b;
        }
    }
    print() {
        console.log(this.value,this.code);
    }
}

class Encodeur {
    constructor(text_, mode, version, m_len) {
        this.message = text_;
        this.version = version;
        this.message_l = m_len;
        this.mode_ = mode;
        this.messPoly = [];
        this.sub=[];
        this.code = [];
        this.carCount = []; //[0,0,0,0,0,1,0,1,1]; // caractere count : nombrer de caractere a codee sur 9 bit en aloha11
        this.codeWorks = [];
        this.pad = [[1,1,1,0,1,1,0,0],[0,0,0,1,0,0,0,1]];
        this.block =[];
        this.blockBin= [];
        switch (this.mode_) {
            case 'N' : this.mode=[0,0,0,1]; break;
            case 'A' : this.mode=[0,0,1,0]; break;
            case 'B' : this.mode=[0,1,0,0]; break;
            case 'K' : this.mode=[1,0,0,0]; break;
            case 'E' : this.mode=[0,1,1,1]; break;
        }
        let tmp = caracteres.find(a=>{ return (this.version>=a.l  && this.version<= a.h);});
        this.l = tmp[this.mode_].l;
    }
    setEC(code) {
        this.QRType = code;
    }
    split() {
        this.sub=[];
        let l = Math.trunc(this.message.txt.length / 2);
        for (let n=0;n<=l;n++) {
            this.sub.push(this.message.txt.substring(2*n, 2*n+2));
        }
    }
    splitNum() {
        let l = Math.trunc(this.message.txt.length / 3);
        this.sub=[];
        for (let n=0;n<=l;n++) {
            this.sub.push(this.message.txt.substring(3*n, 3*n+3));
        }
        console.log(l,this.sub);
    }
    encode() {
        this.codeWorks.push(...this.mode);
        let crCount;
        // a modifier compter les caractzres
        switch (this.mode_) {
            case 'N': 
                this.carCount = new Binary(this.message_l,this.l);
                this.carCount.encode();
                this.codeWorks.push(...this.carCount.code);
                this.splitNum(); // code.print();
                for (let p of this.sub) {
                    let l = this.l;
                    if (p < 100) l=7;
                    if (p < 10)  l=4;
                    let b = new Binary(p,l);
                    b.encode(); 
                    b.print();
                    this.codeWorks.push(...b.code);
            }
            break;
            case 'A':
                this.carCount = new Binary(this.message_l,this.l);
                this.carCount.encode();
                this.codeWorks.push(...this.carCount.code);
                this.split(); // code.print();
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
                break;
            case 'B' :
                // console.log("le message ... ",this.message);
                // message_l=this.message.bytes.length;
                this.carCount = new Binary(this.message_l,this.l);
                this.carCount.encode();
                this.codeWorks.push(...this.carCount.code);
                for (let v of this.message.bytes) {
                    this.code.push(v);
                    let b = new Binary(v,8);
                    b.encode();
                    this.codeWorks.push(...b.code);
                }
                // console.log(this.code);
                break;
            case 'E': break;

        }
        // console.log('correction   ',this.codeWorks.length)
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
        // console.log('Blocks : ',bl);

        //step
        for (let i=0; i<bl.length ; i++ ) {
            let polyMess = new Polynome(bl[i]);
            // console.log(polyMess)
            let iter =  polyMess.poly.length;
            // polyMess.pow(poly_.length-1); //console.log('crypt ',poly_.length);
            polyMess.pow(qrType.ec); //console.log('crypt ',poly_.length);
            // preparation des polynomes
            // console.log('compute steps',i, iter, poly_.length,polyMess);
            for (let i=0; i<iter ; i++) {
                // for (let i=0; i<iter ; i++) {
                    let polyGen = new Polynome(poly_,1); //console.log('gen',polyGen.poly[0].coef)
                polyGen.pow(iter); // console.log(i,polyGen.poly.length,polyMess.poly.length,polyGen,polyMess)
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
        // console.log(error);
        // interleave CodeWorks
        let m = Math.max(this.QRType.dG1, this.QRType.dG2);
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
        // console.log(this.block);
        for (let b of this.block) {
            let e = new Binary(b,8); 
            e.encode();
            this.blockBin.push(...e.code);
        }
        // ajouter ici les bit manquants
        let pad = [];
        for (let i=0;i<padding[this.version];i++) {
            pad.push(0);
        }
        // console.log('pad',pad);
        this.blockBin.push(...pad);
        // this.show(this.blockBin);
    }
    show(arr) {
        let str='';
        for (let c of arr) {
            str += c;
        }
        console.log(str);
    }
}


module.exports = { Encodeur, Binary };