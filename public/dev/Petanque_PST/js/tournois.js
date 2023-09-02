function drawPhase() {
    let dx = (width - 2* padding) / Object.keys(t_json).length ;
    let x = dx/2 + padding, y = 40;
    textAlign(CENTER,CENTER);
    for (let i in t_json) {
        let t=t_json[i];
        if (t.type==phase) {
            fill(color(couleur.cur));
            rect(x-dx/2+1,y-12,dx-2,24);
            fill(color(couleur.bk));
        } else {
            fill(color(couleur.bk));
            rect(x-dx/2+1,y-12,dx-2,24);
            fill(255);
        }
        text(t.type,x,y);
        x += dx;
    }
}
function selPoule() {
    let dx = (width - 2* padding) / 2 ;
    let x = dx/2 + padding, y = 67;
    textAlign(CENTER,CENTER);
    for (let p of poules) {
        if (p==poule) {
            fill(color(couleur.cur));
            rect(x-dx/2+1,y-12,dx-2,24);
            fill(color(couleur.bk));
        } else {
            fill(color(couleur.bk));
            rect(x-dx/2+1,y-12,dx-2,24);
            fill(255);
        }
        text(p,x,y);
        x += dx;
    }
}
function drawClstPoule(data) {
    let clt = [];
    for (let i =0; i<data.length;i++) {
        for (let j=0;j<2;j++) {
            let e = data[i].equipes[j].eq.nom;
            let p = data[i].equipes[j].sc;
            let c = data[i].equipes[(j+1)%2].sc;
            let d = p - c;
            let g = 1;
            if (p>c) g=3;
            if (p<c) g=0;
            let a = {n:e, p:p, c:c , s:g, d:d};
            clt.push(a);
        }
    }
    // console.log(a);
    let u1 = [...new Set(clt.map(a => a.n ))];
    let b = [];
    u1.forEach( a => {  let res =  clt.filter( c => {return (c.n==a)}) ; b.push(res); } );
    let r =[];
    for (let i=0; i<b.length ; i++) {
        let p = b[i].reduce((a,b) =>{ return a+b.p}, 0);
        let c = b[i].reduce((a,b) =>{ return a+b.c}, 0);
        let s = b[i].reduce((a,b) =>{ return a+b.s}, 0);
        let d = b[i].reduce((a,b) =>{ return a+b.d}, 0);
        r.push({n:u1[i], p:p , c:c, s:s, d:d})
    }
    r.sort((a,b) => {return b.p - a.p;});
    r.sort((a,b) => {return b.d - a.d;});
    r.sort((a,b) => {return b.s - a.s;});
    return r;

}
function drawPoule(x,y,w,h_,data) {
    let p = data.filter( r => { return ( r.type.indexOf(phase) != -1 && r.poule==poule); });
    let s2 = w * 0.07 +1;
    let w2 = w/2 - s2 -padding;
    let dt = h_ / p.length / 3;
    let mid = w/2;
    fill(200); noStroke();
    textAlign(LEFT,CENTER);
    textSize(12); //dt/2.5);
    y += 35;
    fill(255);
    for (let i in p ) {
        i = int(i);
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        if (phase == 'Finale') {
            textAlign(CENTER,CENTER);
            fill(color(couleur.bk));
            text(p[i].type,mid,y+(i+1)*dt-10);
            y+=30;
        }
        fill(120,180,120);
        let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
        if (sc1>=sc2) {
            fill(color(couleur.sel));
        } else { fill(160) ;}
        rect(mid-s2+2,y+(i+1)*dt-dt/2,s2-4,dt-2);
        if (sc2>=sc1) {
            fill(color(couleur.sel));
        } else { fill(160) ;}
        rect(mid+3,y+(i+1)*dt-dt/2,s2-4,dt-2);
        fill(color(couleur.bk));
        rect(mid-w2-s2,y+(i+1)*dt-dt/2,w2,dt-2);
        rect(mid+s2,y+(i+1)*dt-dt/2,w2,dt-2);
        let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
        let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
        fill(255);
        textAlign(CENTER,CENTER);
        text(sc1,mid-s2/2,y+(i+1)*dt);
        text(sc2,mid+s2/2,y+(i+1)*dt);
        // text('-',x+mid,y+(i+1)*20);
        textAlign(RIGHT,CENTER);
        text(e1_t,mid-s2,y+(i+1)*dt);
        textAlign(LEFT,CENTER);
        text(e2_t,mid+s2,y+(i+1)*dt);
    }
    if (phase=="Poule") {
        let r = drawClstPoule(p);
        y += 250;
        textAlign(CENTER,CENTER);
        fill(color(couleur.bg));
        text('Classement : '+poule,mid,y); y +=20;
        textAlign(LEFT,CENTER);
        for (let i=0; i<r.length;i++ ) {
            let e = equipes.filter(a => { return (a.annee==annee && a.nom==r[i].n);})[0];
            // text(r[i].n+' : '+r[i].s+'pts '+r[i].p+' '+r[i].c+' ',r[i].d,x,y+i*18);
            fill(color(couleur.bk));
            rect(2,y+(i+1)*dt-dt/2,w-4,dt-2);
            fill(255);
            text(r[i].n+' : '+e.tireur.nom+'/'+e.pointeur.nom+'  '+r[i].s+'pts +'+r[i].p+' -'+r[i].c+' ('+r[i].d+')',x,y+(i+1)*dt);
        }
    }
}

function drawTournois(x_, y_ , w_, h_ ,a_) {
    let x = x_+padding;
    let m = matchs.filter( r => { return ( r.annee == a_);});
    drawPhase();
    if (phase=="Poule") {
        selPoule();
    } else { poule='';}
    drawPoule(x,y_,w_,h_,m);
}