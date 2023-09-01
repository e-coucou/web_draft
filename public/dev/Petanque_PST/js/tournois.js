function drawPhase() {
    let dx = (width - 2* padding) / Object.keys(t_json).length ;
    let x = dx/2 + padding, y = 40;
    textAlign(CENTER,CENTER);
    for (let i in t_json) {
        let t=t_json[i];
        if (t.type==phase) {
            fill(color(couleur.sel));
        } else {
            fill(color(couleur.bk));
        }
        rect(x-dx/2+1,y-12,dx-2,24);
        fill(255);
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
            fill(color(couleur.sel));
        } else {
            fill(color(couleur.bk));
        }
        rect(x-dx/2+1,y-12,dx-2,24);
        fill(255);
        text(p,x,y);
        x += dx;
    }
}

function drawPoule(x,y,w,h_,type_,data) {
    let p = data.filter( r => { return ( r.type.indexOf(type_) != -1 && r.poule==poule); });
    let s2 = w * 0.1;
    let w2 = w/2 - s2 -padding;
    let dt = h_ / p.length / 3;
    let mid = w/2;
    if (type_=="Poule") {
        selPoule();
    } else { poule='';}
    fill(200); noStroke();
    textAlign(LEFT,CENTER);
    textSize(15); //dt/2.5);
    // text(poule,x,y);
    y += 35;
    fill(255);
    // console.log(p);
    for (let i in p ) {
        i = int(i);
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        // text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*dy);
        if (type_ == 'Finale') {
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
    // fill(200);
    // textAlign(CENTER,CENTER);
    // text('Demi Finale',x+w/2,y); y += 10;
    // p = m.filter( r => { return ( r.type == "Demi"); });
    // fill(255);
    // for (let i=0;i<p.length;i++ ) {
    //     let e1 = p[i].equipes[0].eq;
    //     let e2 = p[i].equipes[1].eq;
    //     let mid = w/2, dt = 25;
    //     fill(120,180,120);
    //     let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
    //     if (sc1>=sc2) {
    //         fill(color(couleur.sel));
    //         rect(x+mid-dt+1,y+(i+1)*20-10,dt-4,18);
    //     }
    //     if (sc2>=sc1) {
    //         fill(color(couleur.sel));
    //         rect(x+mid+3,y+(i+1)*20-10,dt-4,18);
    //     }
    //     fill(color(couleur.bk));
    //     rect(x+mid-190,y+(i+1)*20-10,170,18)
    //     rect(x+mid+20,y+(i+1)*20-10,170,18)
    //     let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
    //     let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
    //     fill(255);
    //     textAlign(CENTER,CENTER);
    //     text(sc1,x+mid-dt/2,y+(i+1)*20);
    //     text(sc2,x+mid+dt/2,y+(i+1)*20);
    //     text('-',x+mid,y+(i+1)*20);
    //     textAlign(RIGHT,CENTER);
    //     text(e1_t,x+mid-dt,y+(i+1)*20);
    //     textAlign(LEFT,CENTER);
    //     text(e2_t,x+mid+dt,y+(i+1)*20);
    // }

    // let r = pouleClst(p);
    // y += 150;
    // text('classement',x,y); y +=20;
    // for (let i=0; i<r.length;i++ ) {
    //     // text(r[i].n+' : '+r[i].s+'pts '+r[i].p+' '+r[i].c+' ',r[i].d,x,y+i*18);
    //     text(r[i].n+' : '+r[i].s+'pts +'+r[i].p+' -'+r[i].c+' ('+r[i].d+')',x,y+i*18);
    // }

}

function drawTournois(x_, y_ , w_, h_ ,a_) {
    let x = x_+padding;
    let m = matchs.filter( r => { return ( r.annee == a_);});
    drawPhase();
    // drawPoule(x,y_,w_,h_,'Poule','Gassin',m);
    drawPoule(x,y_,w_,h_,'Poule',m);
    // drawPoule(x,y_,w_,h_,'Demi','',m);
    // drawPoule(x,y_,w_,h_,'Finale','',m);
    // x = w + padding - x_;
    // y = y_;
    // fill(200);
    // textAlign(RIGHT,CENTER)
    // text('RAMATUELLE',x,y); y += 25;
    // fill(255);
    // p = m.filter( r => { return ( r.type == "Poule" && r.poule=="Ramatuelle"); });
    // for (let i in p ) {
    //     let e1 = p[i].equipes[0].eq;
    //     let e2 = p[i].equipes[1].eq;
    //     text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*22);
    // }
    // r = pouleClst(p);
    // y += 150;
    // text('classement',x,y); y +=20;
    // for (let i=0; i<r.length;i++ ) {
    //     text(r[i].n+' : '+r[i].s+'pts +'+r[i].p+' -'+r[i].c+' ('+r[i].d+')',x,y+i*18);
    // }
    // x = padding;
    // y = y_;
    // fill(200);
    // textAlign(CENTER,CENTER);
    // text('Demi Finale',x+w/2,y); y += 10;
    // p = m.filter( r => { return ( r.type == "Demi"); });
    // fill(255);
    // for (let i=0;i<p.length;i++ ) {
    //     let e1 = p[i].equipes[0].eq;
    //     let e2 = p[i].equipes[1].eq;
    //     let mid = w/2, dt = 25;
    //     fill(120,180,120);
    //     let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
    //     if (sc1>=sc2) {
    //         fill(color(couleur.sel));
    //         rect(x+mid-dt+1,y+(i+1)*20-10,dt-4,18);
    //     }
    //     if (sc2>=sc1) {
    //         fill(color(couleur.sel));
    //         rect(x+mid+3,y+(i+1)*20-10,dt-4,18);
    //     }
    //     fill(color(couleur.bk));
    //     rect(x+mid-190,y+(i+1)*20-10,170,18)
    //     rect(x+mid+20,y+(i+1)*20-10,170,18)
    //     let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
    //     let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
    //     fill(255);
    //     textAlign(CENTER,CENTER);
    //     text(sc1,x+mid-dt/2,y+(i+1)*20);
    //     text(sc2,x+mid+dt/2,y+(i+1)*20);
    //     text('-',x+mid,y+(i+1)*20);
    //     textAlign(RIGHT,CENTER);
    //     text(e1_t,x+mid-dt,y+(i+1)*20);
    //     textAlign(LEFT,CENTER);
    //     text(e2_t,x+mid+dt,y+(i+1)*20);
    // }
    // // Les finales
    // y = y_ + 130;
    // x = padding;
    // p = m.filter( r => { return ( r.type != "Demi"  && r.type != "Poule" ); });
    // let mid = w/2, dt = 25;
    // for (let i=0; i<p.length ; i++ ) {
    //     let j = p.length-i-1;
    //     let e1 = p[i].equipes[0].eq;
    //     let e2 = p[i].equipes[1].eq;
    //     fill(120,180,120);
    //     fill(200);
    //     textAlign(CENTER,CENTER);
    //     text(p[i].type,x+mid,y+(3*j)*17);
    //     let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
    //     if (sc1>=sc2) {
    //         fill(color(couleur.sel));
    //         rect(x+mid-dt+1,y+(3*j+1)*17-10,dt-4,20);
    //     }
    //     if (sc2>=sc1) {
    //         fill(color(couleur.sel));
    //         rect(x+mid+3,y+(3*j+1)*17-10,dt-4,20);
    //     }
    //     let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
    //     let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
    //     fill(color(couleur.bk));
    //     rect(x+mid-190,y+(3*j+1)*17-10,170,20)
    //     rect(x+mid+20,y+(3*j+1)*17-10,170,20)
    //     fill(255);
    //     textAlign(CENTER,CENTER);
    //     text('-',x+mid,y+(3*j+1)*17);
    //     text(sc1,x+mid-dt/2,y+(3*j+1)*17);
    //     text(sc2,x+mid+dt/2,y+(3*j+1)*17);
    //     textAlign(RIGHT,CENTER);
    //     text(e1_t,x+mid-dt,y+(3*j+1)*17);
    //     textAlign(LEFT,CENTER);
    //     text(e2_t,x+mid+dt,y+(3*j+1)*17);
    // }
}