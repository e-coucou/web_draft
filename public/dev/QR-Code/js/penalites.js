function condition_1() {
    let cnt=0;
    for (let i=0;i<dim;i++) {
        let v00=grille[i][0];
        let v10=grille[0][i];
        let c0=1, c1=1;
        for (let j=1;j<dim;j++) {
            let v01=grille[i][j];
            let v11=grille[j][i];
            if (v01!=v00) {
                if (c0>4) cnt+=c0-2;
                v00 = v01;
                c0 = 0;
            } else c0++;
            if (v11!=v10) {
                if (c1>4) cnt+=c1-2;
                v10 = v11;
                c1 = 0;
            } else c1++;
        }
    }
    // console.log(cnt);
    return cnt;
}

function condition_2() {
    let cnt=0;
    for (let i=0; i<dim-1 ; i++) {
        for (let j=0; j<dim-1;j++) {
            let v0=grille[i][j];
            let v1=grille[i][j+1];
            let v2=grille[i+1][j+1];
            let v3=grille[i+1][j];
            if (v0==v1 && v0==v2 && v0==v3) cnt += 3;
        }
    }
    // console.log(cnt);
    return cnt;
}

function condition_3() {
    const p0 = '01000101111';
    const p1 = '11110100010';
    let cnt = 0;
    for (let i =0; i<dim;i++) {
        for (let j=0;j<dim-11;j++) {
            let v='', h='';
            for (let k=0;k<11;k++) {
                v+=grille[i][j+k];
                h+=grille[j+k][i];
            }
            if (v==p0  || v==p1) {
                cnt+=40;
                // console.log(v);
            }
            if (h==p0  || h==p1) {
                cnt+=40;
                // console.log(h);
            }
        }
    }
    // console.log(cnt);
    return cnt;
}
function condition_4() {
    let cnt=0;
    let d=0;
    for (let i =0; i<dim;i++) {
        for (let j=0;j<dim-11;j++) {
            d += grille[i][j];
        }
    }
    let p = int(100 * d / dim /dim);
    let m = abs(50 - round(p/5) * 5)/5;
    let M = abs(50 - (round(p/5)+1) * 5)/5;
    cnt = min(m,M)*10;
    // console.log(cnt,d,p,m,M);
    return cnt;
}

function evaluate() {
    let cnt = condition_1();
    cnt += condition_2();
    cnt += condition_3();
    cnt += condition_4();
    return cnt;
}

function optimise() {
    let best =Infinity,sel=0;
    for (let i=0;i<8;i++) {
        createQR(i);
        tmp = evaluate();
        // console.log(tmp);
        if (tmp<best) { best = tmp; sel = i ;} 
    }
    return (sel);
}

function bestVersion() {
    let valide = qrcode.filter(a => { return (a.d > message_l && a.t==type); });
    version = valide[0].v;
    setVersion();
    type = valide[0].t;
    encodeMess();
    level = int(optimise());
    selVersion.selected(version);
    selType.selected(type);
    selLevel.selected(level);
    console.log(version, type, level);
    loop();
}