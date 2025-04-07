const { Encodeur, Binary } = require("./encodeur");


class Grille {
    constructor(dim, version, loc) {
        this.dim = dim;
        this.version = version;
        this.grille = [];
        this.loc = loc;
        this.x = this.dim-1;
        this.y = this.dim-1;
        this.dir = { x:-1 , y:0 , d:-1};

        this.clearGrid();
    }
    clearGrid() {
        this.grille=[];
        for (let i=0; i<this.dim ; i++ ) {
            let ligne=[];
            for (let j=0; j<this.dim ; j++) {
                ligne.push(-1);
            }
            this.grille.push(ligne);
        }
    }
    addPatterns(x,y,s=7,c=false) {
        for (let i=0;i<s;i++) {
            for (let j=0 ; j<s;j++) {
                let v =0;
                if ((i==1 ||i==(s-2)) && (j>0 && j<(s-1))) v=1;
                if ((j==1 ||j==(s-2)) && (i>0 && i<(s-1))) v=1;
                if (c) {
                    if (this.grille[i+x][j+y] != -1) return -1;
                } else{
                    this.grille[i+x][j+y] = v;
                }
            }
        }
    }
    addSeparators(x1,y1,x2,y2) {
        for (let i=0;i<8;i++) {
            this.dot(i+x1,y1,1);
            this.dot(x2,i+y2,1);
        }
    }
    dot(x,y,col,check=false) {
        if (check) {
            if (this.grille[x][y] != -1) return false;
        }
        this.grille[x][y] = col;
        return true;
    }
    addLocator() {
//        let loc = loc_json[version];
        for (let i=1;i<this.loc.length;i++) {
            let lx = this.loc[i];
            if (lx != 0) {
                for (let j=1;j<this.loc.length;j++) {
                    let ly = this.loc[j];
                    if (ly != 0) {
                        if( this.addPatterns(lx-2,ly-2,5,true) != -1) {
                            this.addPatterns(lx-2,ly-2,5);
                        }
                    }
                }
            }
        }
    }
    addTiming() {
        for (let i=0;i<this.dim;i++) {
            this.dot(i,6,i%2,true);
            this.dot(6,i,i%2,true);
        }
    }
    addReserved() {
        this.grille[8][(4*this.version)+9] = 0; //dark dot
        for (let i=0;i<9;i++) {
            this.dot(i,8,2,true);
            this.dot(8,i,2,true);
        }
        for (let i=1;i<9;i++) {
            this.dot(this.dim-i,8,2,true);
            this.dot(8,this.dim-i,2,true);
        }
        if (this.version>6) {
            for (let i=0;i<6;i++) {
                for(let j=0;j<3;j++) { 
                    this.dot(i,this.dim-9-j,2,true);
                    this.dot(this.dim-9-j,i,2,true);
                }
            }
        }
    }
    move() {
        let wd=1000;
        while( (this.grille[this.x][this.y] != -1) && (wd>0)) {
            this.x+=this.dir.x; this.y+=this.dir.y;
            if (this.dir.x==-1) { this.dir.x=1} else {this.dir.x = -1}
            if (Math.abs(this.dir.y)==1) { this.dir.y=0} else {this.dir.y = this.dir.d}
            if (this.y<0) {
                this.y=0; this.dir.d=1;this.x -= 2;
                if (this.x==6) this.x -=1;
            }
            if (this.y>=this.dim) {
                this.y=this.dim-1; this.dir.d=-1;this.x -= 2;
                if (this.x==6) this.x -=1;
            }
            if (this.x<0) this.x=0;
            wd--;
        }
    }
    addData(mask_, blockBin) {
        this.x = this.dim-1;
        this.y = this.dim-1;
        this.dir = { x:-1 , y:0 , d:-1};
        for (let v of blockBin) {
            if (this.grille[this.x][this.y] == -1) {
                let r = mask(this.x,this.y,v,mask_);
                this.dot(this.x,this.y,(r+1)%2,false);
                this.move();
//            } else {
//                console.log('ca devrait pas arriver');
            }
        }
    }    
    addString(info_) {
        // info_=[0,1,1,0,0] //test
        let poly_ = [1,0,1,0,0,1,1,0,1,1,1];
        let poly7_ = [1,1,1,1,1,0,0,1,0,0,1,0,1];
        let pad = [0,0,0,0,0,0,0,0,0,0];
        let mask = [1,0,1,0,1,0,0,0,0,0,1,0,0,1,0]; // test
        let mess = info_.slice();
        mess.push(...pad);
        mess = removeZ(mess);
        while (mess.length>10) {
            let lPad = mess.length - poly_.length;
            let poly = padZero(poly_, lPad);
            mess = bitWise(mess,poly);
            mess = removeZ(mess);
        }
        let l = 10 - mess.length;
        for (let i=0;i<l;i++) {
            mess = [0, ...mess];
        }
        info_.push(...mess);
        info_ = bitWise(info_,mask);
        let pattern = [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[7,8],[8,8],[8,7],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]];
        for (let i=0;i<info_.length;i++) {
            let x = pattern[i][0];
            let y = pattern[i][1];
            this.dot(x,y,(info_[i]+1)%2,false);
        }
        for (let i =0;i<7;i++) {
            this.dot(8,this.dim-i-1,(info_[i]+1)%2,false);
        }
        for (let i =7;i<15;i++) {
            this.dot(this.dim-15+i,8,(info_[i]+1)%2,false);
        }
        // Code pour version sup ou egale à 7
        if (this.version>6) {
            pad = [0,0,0,0,0,0,0,0,0,0,0,0];
            let tmp = new Binary(this.version,6); tmp.encode();
            info_ = tmp.code.slice();
            mess = info_.slice();
            mess.push(...pad);
            mess = removeZ(mess);
            while (mess.length>12) {
                let lPad = mess.length - poly7_.length;
                let poly = padZero(poly7_, lPad);
                mess = bitWise(mess,poly);
                mess = removeZ(mess);
            }
            let l = 12 - mess.length;
            for (let i=0;i<l;i++) {
                mess = [0, ...mess];
            }
            info_.push(...mess);
            let b=0;
            for (let i=5;i>=0;i--) {
                for (let j = (this.dim-9); j>(this.dim-12);j--) {
                    this.dot(i,j,(info_[b]+1)%2,false);
                    this.dot(j,i,(info_[b]+1)%2,false);
                    b++;
                }
            }
            // b=0;
            // for (let i=5;i>=0;i--) {
            //     for (let j = (dim-9); j>(dim-12);j--) {
            //         dot(j,i,(info_[b]+1)%2+2,false);
            //         b++;
            //     }
            // }
        }
    }
}

// Fct Standard ---
//
function mask(x,y,v,n) {
    let r;
    switch (n) {
        case 0 : r = (x+y)%2; break;
        case 1 : r = y % 2; break;
        case 2 : r = x % 3; break;
        case 3 : r = (x+y) % 3; break;
        case 4 : r = (Math.floor(y/2) + Math.floor(x/3)) % 2; break;
        case 5 : r = ((x*y) % 2) + ((x*y) % 3); break;
        case 6 : r = ( ((x*y) % 2) + ((x*y) % 3) ) % 2; break;
        case 7 : r = ( ((x+y) % 2) + ((x*y) % 3) ) % 2; break;
    }
    if (r==0) { return (v+1)%2;} else {return v;}
}
function removeZ(arr) {
    while (arr[0] == 0) {
        arr.splice(0,1);
    }
    return arr;
}
function padZero(arr,l) {
    for (let i =0;i<l ; i++) {
        arr.push(0);
    }
    return arr;
}
function bitWise(arr,div) {
    for (let i=0; i<arr.length; i++) {
        arr[i] = arr[i] ^ div[i];
    }
    return arr;
}

module.exports = {Grille};