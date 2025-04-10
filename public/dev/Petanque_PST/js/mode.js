// MODE
// 0 :
// 1 :
// 2 :
// 3 :
// 4 :
// 5 :
// 6 :

const eC_Etat = ['',' [🔫]',' [🪩]'];
let eqs = [];

function drawParam() {
    // a compléter ...
    let x = 30, x1 = width/2;
    let y = 80;
    let dy = height*0.8/couleur_arr.length;
    textAlign(LEFT,CENTER); fill(color(couleur.bk)); textSize(dy/2.9); textStyle(NORMAL);
    switch(mode) {
        case 4:
            text('Score initial ELO :',x,y); text(param.ELO.init+' pts',x1,y); y += dy;
            text('Limitation du gain >',x,y); text(param.ELO.seuil+' pts',x1,y); y += dy;
            text('Coef. match normal :',x,y); text(nf(param.ELO.std,0,2)+' pts',x1,y); y += dy;
            text('Coef. en "demi" :',x,y); text(nf(param.ELO.demi,0,2)+' pts',x1,y); y += dy;
            text('Coef. phases finales :',x,y); text(nf(param.ELO.finaliste,0,2)+' pts',x1,y); y += dy;
            text('Coef. pour la FINALE :',x,y); text(nf(param.ELO.finale,0,2)+' pts',x1,y); y += dy;
            text('Majoration si écart > :',x,y); text(param.ELO.bonusSeuil+' pts',x1,y); y += dy;
            text('Coef. de Majoration :',x,y); text(nf(param.ELO.bonus,0,2)+' pts',x1,y); y += dy;
            y=80;
            for (let b in btPM) {
                b = int(b);
                btPM[b].redim(width-((b%2)?0.5:1.5)*dy , 80+(int(b/2)*dy) , dy/4);
                btPM[b].show(mode);
            }
            break;
        case 5:
            y = 80; x1 = 3*width/4;
            let y_ = y;
            textSize(dy/2.5);
            for (let i in couleur_arr) {
                i = int(i);
                fill(color(couleur_arr[i].bk));rect(x1-80,y-7,15,14);text('Palette '+i+((i==couleur_sel)?'   ➡️':''),x,y);
                fill(color(couleur_arr[i].dm));rect(x1-60,y-7,15,14); 
                fill(color(couleur_arr[i].cur));rect(x1-40,y-7,15,14);
                fill(color(couleur_arr[i].sel));rect(x1-20,y-7,15,14);
                fill(color(couleur_arr[i].txt));rect(x1,y-7,15,14);
                y += dy;
            }
            y = y_;
            for (let i in btCouleur) {
                b=btCouleur[i];
                b.redim(width-1.1*dy,y,dy/2);
                fill(color(couleur_arr[i].dm));
                rect(b.x0 , b.y0 , b.w0, b.h0 ,4);
                y += dy;
            }
            break;
        case 6:
            {
                y = 20, x=0;
                dy = height*0.85/j_json.length * 2;
                let w_ = (width-2*padding)/2;
                let t = j_json.filter(a => {return a.eC==1;}).length;
                let p = j_json.filter(a => {return a.eC==2;}).length;
                fill(color(couleur.bk));
                if ((p!=8) || (t!=8)) { fill(color(couleur.err));}
                rect(padding,5,width-2*padding,30);
                fill(color(couleur.txt));
                textAlign(CENTER,CENTER);
                text('Sélection des Pointeurs ['+p+'] et des Tireurs ['+t+']',width/2,y);
                textSize(dy/2.5); textAlign(LEFT,CENTER);
                y += 45;
                let c=0, s=8;
                j_json.forEach(e => {
                    let joueur = initJoueurs.filter(j=>{ return j.id==e.id;})[0];
                    e.rk = joueur.rank;
                    if (e.id>0) {
                        let m = e.eC;
                        switch (m) {
                            case 0:
                            case undefined:
                                m=0;
                                fill(color(couleur.dm));
                                rect(x+s+c*w_,y-dy/2,w_-s,dy-2);
                                fill(0);
                                break;
                            case 1:
                                fill(color(couleur.cur));
                                rect(x+s+c*w_,y-dy/2,w_-s,dy-2);
                                fill(color(couleur.txt));
                                // fill(color(couleur.bk));
                                break;
                            case 2:
                                fill(color(couleur.sel));
                                rect(x+s+c*w_,y-dy/2,w_-s,dy-2);
                                fill(255)
                                break;
                        }
                        text(e.nom+eC_Etat[m],x+12 + c*width/2,y);
                        if (c===1) {
                            y += dy;
                            c = 0;
                        } else {
                            c = 1;
                        }
                    }
                });
            }
            break;
        case 7:
            {
                y = 20, x=0;
                dy = height*0.85/(16+2);
                let w_ = (width-2*padding)/2;
                let t = j_json.filter(j => {return j.eC==1}).sort((a,b)=>{return (a.rk-b.rk);});
                let p = j_json.filter(j => {return j.eC==2}).sort((a,b)=>{return (a.rk-b.rk);});
                fill(color(couleur.bk));
                if ((p.length!=8) || (t.length!=8)) { fill(color(couleur.err));}
                rect(padding,5,width-2*padding,30);
                fill(color(couleur.txt));
                textAlign(CENTER,CENTER);textSize(dy/2.5); 
                text('Constitutions ALEATOIRE des Equipes',width/2,y);
                textAlign(LEFT,CENTER);
                y += 45;
                let c=0, s=8;
                p.forEach(j => {
                    let joueur = initJoueurs.filter(e=>{ return j.id==e.id;})[0];
                    fill(color(couleur.cur));
                    rect(x+s,y-dy/2,w_-s,dy-2);
                    fill(255);
                    text(' (🪩) '+j.nom+' ['+joueur.rank+']',x+12,y);
                    y += dy;
                })
                y = 65;
                t.forEach(j => {
                    let joueur = initJoueurs.filter(e=>{ return j.id==e.id;})[0];
                    fill(color(couleur.cur));
                    rect(x+s+w_,y-dy/2,w_-s,dy-2);
                    fill(255);
                    text('(🔫) '+j.nom+' ['+joueur.rank+']',x+12 + width/2,y);
                    y += dy;
                })

                let y_=y;
                let texte = 'Composition possible ... pour '+enCours;
                textAlign(CENTER,CENTER);
                if ((p.length!=8) || (t.length!=8)) { 
                    fill(color(couleur.err)); texte = 'COMPOSITION IMPOSSIBLE !';                
                } else {
                    textSize(dy/2.5);
                    y = y + dy + 10;
                    eqs.forEach(j => {
                        fill(color(couleur.sel));
                        rect(w_/3,y-dy/2,w_*4/3,dy-2);
                        fill(255);
                        text(j.j1.nom+" / "+j.j2.nom, width/2,y);
                        y += dy;
                    })
                    fill(color(couleur.bk));
                }
                rect(padding,y_+2-dy/2,width-2*padding,dy);
                fill(color(couleur.txt));
                text(texte,width/2,y_+2);
            }
            break;
        case 8:
            {
                y = 20, x=0;
                dy = height*0.85/(16+2);
                let w_ = (width-2*padding)/2;
                tEC = j_json.filter(j => {return j.eC==1}).sort((a,b)=>{return (a.rk-b.rk);});
                pEC = j_json.filter(j => {return j.eC==2}).sort((a,b)=>{return (a.rk-b.rk);});
                fill(color(couleur.bk));
                if ((pEC.length!=8) || (tEC.length!=8)) { fill(color(couleur.err));}
                rect(padding,5,width-2*padding,30);
                fill(color(couleur.txt));
                textAlign(CENTER,CENTER);textSize(dy/2.5); 
                text('Constitutions des Equipes',width/2,y);
                textAlign(LEFT,CENTER);
                y += 45;
                let c=0, s=8;
                pEC.forEach(j => {
                    let joueur = initJoueurs.filter(e=>{ return j.id==e.id;})[0];
                    fill(color(couleur.cur));
                    if (j.eCSel === 1) {fill(color(couleur.sel));}
                    rect(x+s,y-dy/2,w_-s,dy-2);
                    fill(255);
                    text(' (🪩) '+j.nom+' ['+joueur.rank+'] /'+j.id,x+12,y);
                    y += dy;
                });
                y = 65;
                tEC.forEach(j => {
                    let joueur = initJoueurs.filter(e=>{ return j.id==e.id;})[0];
                    fill(color(couleur.cur));
                    if (j.eCSel === 1) {fill(color(couleur.sel));}
                    rect(x+s+w_,y-dy/2,w_-s,dy-2);
                    fill(255);
                    text('(🔫) '+j.nom+' ['+joueur.rank+'] / '+j.id,x+12 + width/2,y);
                    y += dy;
                });
                let y_=y;
                let texte = 'Composition en cours ... '+enCours;
                textAlign(CENTER,CENTER);
                if ((pEC.length!=8) || (tEC.length!=8)) { 
                    fill(color(couleur.err)); texte = 'COMPOSITION IMPOSSIBLE !';                
                } else {
                    textSize(dy/2.5);
                    y = y + dy + 10;
                    eqs.forEach(j => {
                        fill(color(couleur.sel));
                        rect(w_/3,y-dy/2,w_*4/3,dy-2);
                        fill(255);
                        text(j.j1.nom+" / "+j.j2.nom, width/2,y);
                        y += dy;
                    })
                    fill(color(couleur.bk));
                }
                rect(padding,y_+2-dy/2,width-2*padding,dy);
                fill(color(couleur.txt));
                text(texte,width/2,y_+2);            }
            break;
        case 9:
            text('Saisie',x,y); text(param.ELO.init+' pts',x1,y); y += dy;
            break;

    }
    // y = 100;
}

function drawListe() {
    joueurs.sort( (a,b) => { return (b.hist[index].elo - a.hist[index].elo);});
    let w_ = width-2*padding;
    let dx = w_/12;
    let x_ = padding + 2*8 +3.5*dx;
    let y_ = 85;
    let dy_=18;
    inter = int((height-140)/initJoueurs.length);
    noFill();
    stroke(color(couleur.bk));
    rect(x_+1,y_-dy_/2+1,dx-2,dy_-2);
    rect(x_+1*dx,y_-dy_/2+1,dx-2,dy_-2);
    rect(x_+2*dx,y_-dy_/2+1,dx-2,dy_-2);
    rect(x_+3*dx,y_-dy_/2+1,dx-2,dy_-2);
    rect(x_+4*dx,y_-dy_/2+1,dx-2,dy_-2);
    rect(x_+5*dx,y_-dy_/2+1,dx-2,dy_-2);
    textAlign(CENTER,CENTER);textStyle(NORMAL);
    textSize(int(inter/2.7));
    fill(color(couleur.bk));
    text('ELO',x_+1+dx/2, y_);
    text('G',x_+dx+dx/2, y_);
    text('N',x_+2*dx+dx/2, y_);
    text('P',x_+3*dx+dx/2, y_);
    // textSize(10);
    text('po',x_+4*dx+dx/2, y_);
    text('co',x_+5*dx+dx/2, y_);
    // text('---'+inter+'----',100,height-50);
    eJoueurs = joueurs.filter(a=>{return a.id!=0;});
    if (filtreJ) {
        eJoueurs = joueurs.filter(a=>{let b= ( a.annees.filter(v=>{let t= (v==annee);return t;}));return b[0]});
    }
    // if (eJoueurs.length > 0) {
    //     console.log(eJoueurs)
    //     inter = int((height-140)/eJoueurs.length);
    // }
    for (let i in eJoueurs) {
        let idx = int(eJoueurs[i].hist[index].c);
        let elo = eJoueurs[i].hist[index].elo;
        // iDs[i] = idx;
        if (eJoueurs[i].id != 0) {
            eJoueurs[i].show(idx, padding, inter*(i)+y_+dy_, w_,elo,int(i)+1);
        } else {
            let x= padding, y = inter*(i)+y_+dy_, s=8, dy=inter-2;
            fill(color(couleur.bk));
            rect(x+s,y-dy/2,w_-s,dy);
            fill(255);
            textAlign(LEFT,CENTER);
            textSize(max(int(dy/2),11));
        }
    }    
    drawDateBar();
}

function drawDateBar() {
    let x = padding, y = padding+50;
    let dx = (width-2*padding) / matchs.length , dy=15;
    noStroke();
    for (let i=0; i<matchs.length; i++) {
        if (i==index) {
            fill(color(couleur.sel));
        } else {
            if (matchs[i].type=="Poule") fill(color(couleur.bk));
            if (matchs[i].type=="Demi") fill(color(couleur.dm));
            if (matchs[i].type.indexOf("Finale") != -1) fill(color(couleur.cur));
        }
        rect(x+i*dx,y,dx,dy);
    }
}
function showMatch(id_) {
    let x = padding;
    let y = height-85;
    let m = matchs[id_];
    let e1 = m.equipes[0].eq;
    let e2 = m.equipes[1].eq;
    let mid = width/2, dt = 24;
    let s2 = (width*3/4) * 0.07 +1;
    let w2 = (width-2*padding)/2  - s2;
    fill(color(couleur.bk));
    textAlign(CENTER,CENTER);
    text(m.type,mid,y);
    let sc1 = m.equipes[0].sc, sc2=m.equipes[1].sc;
    drawScore(e1,e2,sc1,sc2,0,y,mid,s2,dt,w2);
}
function drawGraphe() {
    fill(color(couleur.bk));
    rect(padding,79,width-2*padding,height-175);
    eJoueurs = joueurs.filter(a=>{return a.id!=0;});
    if (filtreJ) {
        eJoueurs = joueurs.filter(a=>{let b= ( a.annees.filter(v=>{let t= (v==annee);return t;}));return b[0]});
    }
    for (let i in eJoueurs) {
        let idx = int(eJoueurs[i].hist[index].c);
        let elo = eJoueurs[i].hist[index].elo;
        if (eJoueurs[i].id != 0) {
            eJoueurs[i].draw(idx,initJoueurs.length,width-2*padding,height-175,elo);
        }
    }
    drawDateBar();
    showMatch(index);
}

function drawEncours() {
    y = 20, x=0;
    fill(color(couleur.sel));
    rect(padding,5,width-2*padding,50);
    fill(color(couleur.txt));
    textAlign(CENTER,CENTER);textSize(25); 
    text('TOURNOIS en COURS : '+enCours,width/2,y+12.5);
    fill(color(couleur.txt));
    rect(padding,79,width-2*padding,height-175);
    let m_sel = matchs.filter(s => {return s.annee==enCours})
    y = 50;
    dy = height*0.85/(22);
    let s2 = width * 0.07 +1;
    let w2 = width/2 - s2 -padding;
    // let dt = h / p.length / 3;
    let mid = width/2;
    textSize(dy/2.5);
    for (let i in m_sel) {
        i = int(i);
        let m = m_sel[i];
        // console.log(m)
        let e1 = m.equipes[0].eq;
        let e2 = m.equipes[1].eq;
        let sc1 = m.equipes[0].sc, sc2=m.equipes[1].sc;
        drawScore(e1,e2,sc1,sc2,i,y,mid,s2,dy,w2);
    }
}