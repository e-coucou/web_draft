const iconPhase = [' 🐣', ' 🍺', ' 🏆'];
const medaille = ['🥇 ','🥈 ','🥉 ','','','','','🎖️ '];
let score1,score2;

function drawScore(e1, e2, sc1, sc2, i, y, mid, s2, dt, w2) {
    if (sc1>=sc2) {
        fill(color(couleur.sel));
    } else { fill(160) ;}
    rect(mid-s2+2 , y+(i+1)*dt-dt/2 , s2-3 , dt-2);
    if (sc2>=sc1) {
        fill(color(couleur.sel));
    } else { fill(160) ;}
    rect(mid+2 , y+(i+1)*dt-dt/2 , s2-3 , dt-2);
    fill(color(couleur.bk));
    rect(mid-w2-s2,y+(i+1)*dt-dt/2,w2,dt-2);
    rect(mid+s2,y+(i+1)*dt-dt/2,w2,dt-2);
    let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
    let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
    fill(255);
    textAlign(CENTER,CENTER);
    text(sc1,mid-s2/2,y+(i+1)*dt);
    text(sc2,mid+s2/2,y+(i+1)*dt);
    textAlign(RIGHT,CENTER);
    text(e1_t,mid-s2*1.1,y+(i+1)*dt);
    textAlign(LEFT,CENTER);
    text(e2_t,mid+s2*1.1,y+(i+1)*dt);
}
function ClstPoule(data) {
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
    // console.log(data);
    if (r.length > 0) {
        if (annee<2024) {
            r.sort((a,b) => {return b.p - a.p;});
            r.sort((a,b) => {return b.d - a.d;});
            r.sort((a,b) => {return b.s - a.s;});
        } else {
            r.sort((a,b) => {return b.s - a.s;});
            for (let i = 0;i<3;i++)
            r = newClt(data,r,i,i+1);
        }
    }
    return r;
}
function newClt(data,r,x,y) {
    if (r[x].s == r[y].s) {
        // console.log('inverser 1/2', r[0].n, r[1].n, r[1]);
        let m = data.filter(a=> { return ((a.equipes[0].eq.nom == r[x].n && 
            a.equipes[1].eq.nom == r[y].n) || (a.equipes[1].eq.nom == r[x].n && 
            a.equipes[0].eq.nom == r[y].n) 
        )})[0];
        s1 = m.equipes.filter(a=> { return ((a.eq.nom == r[x].n))})[0].sc;
        s2 = m.equipes.filter(a=> { return ((a.eq.nom == r[y].n))})[0].sc;
        if (s1<s2) {
            tmp = r[x];
            r[x] = r[y];
            r[y] = tmp;
        }
    }
    return r;
}
function clastFinale(data){
    let clt = [];
    for (let m of data) {
        let p = round(random());
        let t1= (p)?(m.equipes[0].eq.tireur.nom +'/' + m.equipes[0].eq.pointeur.nom):(m.equipes[0].eq.pointeur.nom +'/' + m.equipes[0].eq.tireur.nom)
        p = round(random());
        let t2= (p)?(m.equipes[1].eq.tireur.nom +'/' + m.equipes[1].eq.pointeur.nom):(m.equipes[1].eq.pointeur.nom +'/' + m.equipes[1].eq.tireur.nom)
        let e1 = '('+m.equipes[0].eq.nom +') ' + t1;
        let e2 = '('+m.equipes[1].eq.nom +') ' + t2;
        let sc1 = m.equipes[0].sc;
        let sc2 = m.equipes[1].sc;
        let k = m.k;
        if (sc1>sc2) {
            clt.push({nom:e1, sc:sc1, pt:k+1});
            clt.push({nom:e2, sc:sc2, pt:k});
        } else {
            clt.push({nom:e1, sc:sc1, pt:k});
            clt.push({nom:e2, sc:sc2, pt:k+1});
        }
    }
    return clt;
}
function drawPoule(x,y,w,h_,data) {
    let p = data.filter( r => { return ( r.type.indexOf(phase) != -1 && r.poule==poule); });
    let s2 = w * 0.07 +1;
    let w2 = w/2 - s2 -padding;
    let dt = h_ / p.length / 3;
    let mid = w/2;
    fill(200); noStroke();
    textAlign(LEFT,CENTER);
    textSize(min(14,dt/3)); //dt/2.5);
    if (phase=='Finale') {y += 5;} else {y+=35;}
    fill(255);
    for (let i in p ) {
        i = int(i);
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        if (phase == 'Finale') {
            textAlign(CENTER,CENTER);
            fill(color(couleur.bk));
            text(p[i].type,mid,y+(i+1)*dt-dt/4-2);
            y+=dt/3;
        }
        if (phase == 'Demi') {
            textAlign(CENTER,CENTER);
            fill(color(couleur.bk));
            text(p[i].tableau,mid,y+(i+1)*dt-dt/4-2);
            y+=dt/3;
        }
        let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
        drawScore(e1,e2,sc1,sc2,i,y,mid,s2,dt,w2);
    }
    if (phase=="Finale") {
        let img=[];
        if (p.length>0) {
            img = img_finale.filter( a => { return a.a==p[0].annee});
        }
        if (img[0] != undefined)  { tint(255,100); image(img[0].i,padding,y+4.5*dt,w,w/10*7); tint(255,255);}
        let r = clastFinale(p);
        r.sort((a,b) => { return b.pt-a.pt;})
        y+=5*dt;
        fill(color(couleur.bk));
        textAlign(CENTER,CENTER);
        textSize(min(16,dt/2.5));
        textStyle(BOLD);
        for (let i in r) {
            let e = r[i];
            text(medaille[i]+e.nom + '  ' ,mid,y);
            y+=25;
        }
        textSize(min(14,dt/3)); textStyle(NORMAL);
    }
    if (phase=='Demi') { 
        image(img_saint_tropez,mid-46, 2*height/3,92,114);
    }
    if (phase=="Poule") {
        let r = ClstPoule(p);
        y += 8*dt;
        let dx = width/10;
        textAlign(CENTER,CENTER);
        fill(color(couleur.bk));
        text('Classement : '+poule,mid,y); y +=25;
        fill(0);
        textAlign(CENTER,CENTER);
        text('Pts',6.5*dx,y);
        text('P',7.5*dx,y);
        text('C',8.5*dx,y);
        text('diff',9.5*dx,y); y-=5;
        for (let i=0; i<r.length;i++ ) {
            let e = equipes.filter(a => { return (a.annee==annee && a.nom==r[i].n);})[0];
            // text(r[i].n+' : '+r[i].s+'pts '+r[i].p+' '+r[i].c+' ',r[i].d,x,y+i*18);
            fill(color(couleur.bk));
            rect(2,y+(i+1)*dt-dt/2,w-4,dt-2);
            textAlign(LEFT,CENTER);
            fill(255);
            text(r[i].n+' : '+e.tireur.nom+'/'+e.pointeur.nom,x,y+(i+1)*dt);
            fill(color(couleur.cur));
            rect(6*dx,y+(i+1)*dt-dt/2+2,dx-2,dt-6);
            rect(7*dx,y+(i+1)*dt-dt/2+2,dx-2,dt-6);
            rect(8*dx,y+(i+1)*dt-dt/2+2,dx-2,dt-6);
            rect(9*dx,y+(i+1)*dt-dt/2+2,dx-2,dt-6);
            textAlign(CENTER,CENTER);
            fill(255);textStyle(BOLD);
            text(r[i].s,6.5*dx,y+(i+1)*dt);
            fill(color(couleur.txt));textStyle(NORMAL);
            text(r[i].p,7.5*dx,y+(i+1)*dt);
            text(' -'+r[i].c,8.5*dx,y+(i+1)*dt);
            text('('+r[i].d+')',9.5*dx,y+(i+1)*dt);
        }
        if (poule=='Gassin') {
            image(img_gassin,mid-23,height - 150,46,57);
        }
        if (poule=='Ramatuelle') {
            image(img_ramatuelle,mid-23,height - 150,46,57);
        }
    }
}

function drawTournois(x_, y_ , w_, h_ ,a_) {
    let x = x_+padding;
    let m = matchs.filter( r => { return ( r.annee == a_);});
    if (phase=="Poule") {
        for (c of btPoule) { c.show(mode);}
        image(img_gassin,width/5,60,13,14);
        image(img_ramatuelle,4*width/5-padding,60,13,14);
        // if (p=='Ramatuelle') { image(img_ramatuelle,x-dx/2+7,y-8,13,14);}
    } else { poule='';}
        drawPoule(x,y_,w_,h_,m);
}

function ClstEncour() {
    ClstEncourPoule('Gassin',0);
    ClstEncourPoule('Ramatuelle',1);
    let id_f = 99-1;
    ClstEncourDemi('Principal',0,id_f)
    id_f = 99-3
    ClstEncourDemi('Honneur',0,id_f)
}

function updateMatchs(a) {
    let m_a = matchs.filter(j=>{return j.annee==a; });
    let updates = {};
    m_a.forEach(Elt => {
        let m =m_json[int(Elt.id)];
        m.E1 = int(Elt.equipes[0].eq.id);
        m.E2 = int(Elt.equipes[1].eq.id);
        updates['/'+Elt.id] = m;
        
    });
    console.log(updates);
    dbMatchs.update(updates);
}

function ClstEncourPoule(poule_,eq_) {
    let p = matchs.filter( r => { return ( r.type.indexOf('Poule') != -1 && r.poule==poule_ && r.annee==enCours); });
    let r =ClstPoule(p);
    // console.log(r)
    let id_ = 99 - 7;
    let i = 0;
    r.forEach(b=>
        {
            let eq = equipes.filter(a=> { return(a.nom==b.n && a.annee==enCours)})[0];
            if (eq_ != 1) {
                matchs[id_+i].equipes[eq_].eq=eq;
            } else {
                let i_ = i - (i%2) + (i+1)%2;
                matchs[id_+i_].equipes[eq_].eq=eq;
            }
            i+=1;
        }
    )

}

function ClstEncourDemi(tableau_,eq_,id_) {
    let q = matchs.filter( r => { return ( r.type.indexOf('Demi') != -1 && r.tableau.indexOf(tableau_) != -1 && r.annee==enCours); });
    q.forEach(
        (m,id) => {
            if (m.equipes[0].sc > m.equipes[1].sc) {
                matchs[id_+1].equipes[id].eq=m.equipes[0].eq;
                matchs[id_].equipes[id].eq=m.equipes[1].eq;
            } else {
                matchs[id_+1].equipes[id].eq=m.equipes[1].eq;
                matchs[id_].equipes[id].eq=m.equipes[0].eq;
            }
        }
    )

}