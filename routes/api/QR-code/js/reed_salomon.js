table_log = [];
table_ant = [];

calcLog = function(n) {
    let v=0;
    if (n==0) return 1;
    v = calcLog(n-1) * 2;
    if (v>255) { return (v^285); }
    return v;
}

calcLog_old = function(n) {
    let v = 0
    if (n>7) {
        v= Math.pow(2,8) ^ 285;
        for (let i = 8; i<n ; i++ ) {
            v = (v * 2);
            if (v>255) {v = v ^ 285; }
        }
        return v;
    } else {
        return Math.pow(2,n);
    }
}
logTable = function() {
    for (let i=0; i<256; i++) {
        let v = calcLog(i);
        table_log.push(v);
        table_ant[v] = i;
    }
}
class Element {
    constructor(a_,d_, type_) {
        this.degre = d_;
        if (type_ == 1) {
            this.alpha = a_;
            this.coef = table_log[a_];
        } else {
            this.coef = a_;
            this.alpha = table_ant[a_];
        }
    }
    toAlpha() {
        if (this.alpha == 0) console.log('ERREUR');
        this.alpha = table_ant[this.coef];
    }
    addAlpha(a_) {
        this.alpha = (this.alpha + a_) % 255;
    }
    toInt() {
        if(this.alpha != NaN) { this.coef = table_log[this.alpha];}
    }
    xor(e_) {
        this.coef = this.coef ^ e_.coef;
    }
} // 89 = 64 +16 + 8 + 1

class Polynome {
    constructor(p_,type_=0) {
        this.anneau = p_;
        this.poly = [];
        this.init(type_);
    }

    init(type_) {
        let deg = this.anneau.length-1;
        for (let c=0; c<=deg ; c++) {
            let e = new Element(this.anneau[c],deg-c, type_);
            // console.log(c,e);
            this.poly.push(e);
        }
    }
    pow(n_) {
        for (let att of this.poly) {
            att.degre += n_;
        }
        for (let i=n_-1; i>=0;i--) {
            let e = new Element(0,i);
            this.poly.push(e);
        }
    }
    addAlpha(a_) {
        for (let att of this.poly) {
            att.addAlpha(a_);
        }
    }

    toInt(){
        for (let att of this.poly) {
            att.toInt();
        }
    }
    xor(p_) {
        for (let id in this.poly) {
            id = Math.trunc(id);
            // if (id==0) {
            // let degre = this.poly[id].degre;
            // let target = p_.poly.find(a => { return(a.degre == degre);});
            // console.log(degre, target, p_.poly[id])
            // }
            // this.poly[id].xor(target);
            this.poly[id].xor(p_.poly[id]);
        }
    }
    reduit() {
        if (this.poly[0].coef == 0) {
            this.poly.splice(0,1);
        } else { console.log('ERREUR'); }
    }
    getCode() {
        let ret = [];
        for (let att of this.poly) {
            ret.push(att.coef);
        }
        return ret;
    }
    mult(p_) {
        let ret = [];
        for (let i of this.poly) {
            for (let j of p_.poly) {
                let alpha = i.alpha + j.alpha;
                let degre = i.degre + j.degre;
                if (alpha > 255) { alpha = (alpha % 256) + Math.floor(alpha/256);}
                if (ret[degre] == undefined) {
                    ret[degre] = [];
                    ret[degre].push(alpha);
                }
                else {
                    ret[degre].push(alpha);
                }
            }
        }
        // on calcule les coef dans le monde 
        let d=ret.length;
        let c = [];
        for (let i=d-1;i>=0;i--) {
            if (ret[i].length>1) {
                let v0 = table_log[ret[i][0]];
                let v1 = table_log[ret[i][1]];
                let v = v0 ^ v1;
                c.push(table_ant[v]);
            } else {
                c.push(ret[i][0]);
            }
        }        // console.log(c);
        return c;
    }
}

createPoly = function() {
    let P0= new Polynome ([0,0],1);
    let P1= new Polynome ([0,1],1);
    // console.log(P1);
    let P2 =  new Polynome (P1.mult(P0),1);
    // console.log(P2);

    codePoly = [];
    codePoly.push([0,0]);
    codePoly.push([0,1]);

    for (let i = 1; i<40 ; i++) {
        let tmp = new Polynome ([0,i],1);
        let ret = tmp.mult(P0);
        codePoly.push(ret);
        // console.log(ret);
        P0= new Polynome(ret,1);
    }
}

module.exports = { Polynome, logTable , createPoly};