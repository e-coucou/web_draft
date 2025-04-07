function addPatterns(x,y,s=7,c=false) {
    for (let i=0;i<s;i++) {
        for (let j=0 ; j<s;j++) {
            let v =0;
            if ((i==1 ||i==(s-2)) && (j>0 && j<(s-1))) v=1;
            if ((j==1 ||j==(s-2)) && (i>0 && i<(s-1))) v=1;
            if (c) {
                if (grille[i+x][j+y] != -1) return -1;
            } else{
                grille[i+x][j+y] = v;
            }
        }
    }
}

function dot(x,y,col,check=false) {
    if (check) {
        if (grille[x][y] != -1) return false;
    }
    grille[x][y] = col;
    return true;
}
function addSeparators(x1,y1,x2,y2) {
    for (let i=0;i<8;i++) {
        dot(i+x1,y1,1);
        dot(x2,i+y2,1);
    }
}

function addLocator() {
    let loc = loc_json[version];
    for (let i=1;i<loc.length;i++) {
        let lx = loc[i];
        if (lx != 0) {
            for (let j=1;j<loc.length;j++) {
                let ly = loc[j];
                if (ly != 0) {
                    if( addPatterns(lx-2,ly-2,5,true) != -1) {
                        addPatterns(lx-2,ly-2,5);
                    }
                }
            }
        }
    }
}

function addTiming() {
    for (let i=0;i<dim;i++) {
        dot(i,6,i%2,true);
        dot(6,i,i%2,true);
    }
}

function addReserved() {
    grille[8][(4*version)+9] = 0; //dark dot
    for (let i=0;i<9;i++) {
        dot(i,8,2,true);
        dot(8,i,2,true);
    }
    for (let i=1;i<9;i++) {
        dot(dim-i,8,2,true);
        dot(8,dim-i,2,true);
    }
    if (version>6) {
        for (let i=0;i<6;i++) {
            for(let j=0;j<3;j++) { 
                dot(i,dim-9-j,2,true);
                dot(dim-9-j,i,2,true);
            }
        }
    }
}

function mask(x,y,v,n) {
    let r;
    switch (n) {
        case 0 : r = (x+y)%2; break;
        case 1 : r = y % 2; break;
        case 2 : r = x % 3; break;
        case 3 : r = (x+y) % 3; break;
        case 4 : r = (floor(y/2) + floor(x/3)) % 2; break;
        case 5 : r = ((x*y) % 2) + ((x*y) % 3); break;
        case 6 : r = ( ((x*y) % 2) + ((x*y) % 3) ) % 2; break;
        case 7 : r = ( ((x+y) % 2) + ((x*y) % 3) ) % 2; break;
    }
    if (r==0) { return (v+1)%2;} else {return v;}
}

function addData(mask_) {
    console.log('addData',mask_);
    let x = dim-1, y=dim-1;
    let dir = { x:-1 , y:0 , d:-1};
    function move() {
        let wd=1000;
        while( (grille[x][y] != -1) && (wd>0)) {
            x+=dir.x; y+=dir.y;
            if (dir.x==-1) { dir.x=1} else {dir.x = -1}
            if (abs(dir.y)==1) { dir.y=0} else {dir.y = dir.d}
            if (y<0) {
                y=0; dir.d=1;x -= 2;
                if (x==6) x -=1;
            }
            if (y>=dim) {
                y=dim-1; dir.d=-1;x -= 2;
                if (x==6) x -=1;
                // return;
            }
            if (x<0) x=0;
            wd--;
        }
    }
    // for (let i=0;i<base;i++) {
    //     v = code.blockBin[i];
    for (let v of code.blockBin) {
        if (grille[x][y] == -1) {
            let r = mask(x,y,v,mask_);
            dot(x,y,(r+1)%2,false);
            move();
        } else {
            console.log('ca devrait pas arriver');
        }
    }
    console.log(grille);
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
function addString(info_) {
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
        // console.log('first',mess.length,mess);
    }
    let l = 10 - mess.length;
    for (let i=0;i<l;i++) {
        mess = [0, ...mess];
    }
    info_.push(...mess);
    info_ = bitWise(info_,mask);
    // info_ = qrInfo.mask;
    // console.log('table',info_);
    let pattern = [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[7,8],[8,8],[8,7],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]];
    for (let i=0;i<info_.length;i++) {
        let x = pattern[i][0];
        let y = pattern[i][1];
        dot(x,y,(info_[i]+1)%2,false);
    }
    for (let i =0;i<7;i++) {
        dot(8,dim-i-1,(info_[i]+1)%2,false);
    }
    for (let i =7;i<15;i++) {
        dot(dim-15+i,8,(info_[i]+1)%2,false);
    }
    // Code pour version sup ou egale à 7
    if (version>6) {
        pad = [0,0,0,0,0,0,0,0,0,0,0,0];
        let tmp = new Binary(version,6); tmp.encode();
        info_ = tmp.code.slice();
        mess = info_.slice();
        // console.log(mess)
        mess.push(...pad);
        mess = removeZ(mess);
        while (mess.length>12) {
            let lPad = mess.length - poly7_.length;
            let poly = padZero(poly7_, lPad);
            mess = bitWise(mess,poly);
            mess = removeZ(mess);
            // console.log('first',mess.length,mess);
        }
        let l = 12 - mess.length;
        for (let i=0;i<l;i++) {
            mess = [0, ...mess];
        }
        // console.log('error',mess);
        info_.push(...mess);
        // info_ = bitWise(info_,mask);
        // console.log('info >7 ', info_);
        let b=0;
        for (let i=5;i>=0;i--) {
            for (let j = (dim-9); j>(dim-12);j--) {
                dot(i,j,(info_[b]+1)%2,false);
                dot(j,i,(info_[b]+1)%2,false);
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