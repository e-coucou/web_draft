function calculELO(new_ = true) {
    for (let j of joueurs)
        { j.reset(); };
    if ( !new_) { for (let e of equipes) e.resetELO();}
    matchs = [];
    let a_ = false;
    for (let i in m_json) {
        let m = m_json[i];
        matchs.push( new Match(i,equipes[m.E1],equipes[m.E2],m.Sc1,m.Sc2,m.type, m.annee, m.poule,m.k,m.tableau));
        joueurs.sort( (a,b) => { return (b.ELO - a.ELO) ;});
        if (m.type == "Finale") {
            a_=true;
            if (new_) annees.push({a:m.annee,m:int(i)});
        }
        for (let j in joueurs) {
            joueurs[j].setClst(j,a_,m.annee);
        }
        a_ = false;
    }
    initJoueurs = joueurs.slice();
}
class Joueur {
    constructor(nom_, id_) {
        this.nom=nom_;
        this.id = id_;
        this.reset();
        this.team = [];
        this.tireur = 0;
        this.pointeur = 0;
        this.annees=[];
    }

    reset() {
        this.ELO = param.ELO.init;
        this.rank = 0;
        this.match = 0;
        this.gagne=0;
        this.perdu=0;
        this.nul=0;
        this.victoire = 0;
        this.pour=0;
        this.contre=0;
        this.victoires=[];
        this.hist=[];
        this.palmares=[];
        this.clast = [];
        this.matchs = [];
    }
    setVictoire(annee_) {
        this.victoire += 1;
        this.victoires.push(annee_);
    }
    setPointeur(annee_,j_,nom_) {
        this.pointeur += 1;
        this.annees.push(annee_);
        this.team.push({annee: annee_, coeq: j_ , cat: 'Pointeur', team: nom_, team_cat:'Tireur'});
    }
    setTireur(annee_,j_, nom_) {
        this.tireur += 1;
        this.annees.push(annee_);
        this.team.push({annee: annee_, coeq: j_ , cat: 'Tireur', team: nom_, team_cat:'Pointeur'});
}
    setClst(n_,a_,annee) {
        let n = int(n_);
        this.rank = n+1;
        this.hist.push({c:(n+1), elo:this.ELO});
        if (a_) {
            this.clast.push({a: annee, c: (n+1) , elo: this.ELO});
        }
    }
    addMatch(p_, c_, a_, eqN_,ref_) {
        this.pour += p_;
        this.contre += c_;
        this.matchs.push({id: a_, eq: eqN_, ref: ref_});
    }
    setPalmares(a_,p_,c_,id_) {
        let t = this.team.filter( a => { return (a.annee == a_);});
        // let m = matchs_[id_];
        t[0]['matchId'] = id_;
        t[0]['idEq'] = p_;
    }
    update(delta_,win_) {
        this.ELO += delta_;9
        this.match += 1;
        if (win_>0) this.gagne += 1;
        if (win_<0) this.perdu += 1;
        if (win_==0) this.nul += 1;
    }
    getColor() {
        switch (this.victoire) {
            case 0 : fill(color(couleur.dm)); break;
            case 1 : fill(color(couleur.cur)); break;
            case 2 : fill(color(couleur.sel)); break;
            case 3:
            case 4 : fill(color(couleur.txt)); break;
        }
        if (this.id == idSel) {fill(color(couleur.cur));}
    }
    show(idx, x_, y_, w_, elo=this.ELO) {
        let x= x_, y = y_, s=8;
        let dy = inter-2;
        noStroke();
        this.getColor();
        rect(x,y-dy/2,s-1,dy);
        fill(color(couleur.bk));
        rect(x+s,y-dy/2,w_-s,dy);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(max(int(dy/2),11));
        let dx = w_/12;
        x += 2*s;
        if (debug == 1) {
            text(nf(idx,2,0)+"/ "+this.nom+" ["+nf(elo,0,1)+"] "+this.gagne+"/"+this.nul+"/"+this.perdu+" ("+nf(100.*this.gagne/(this.gagne+this.perdu),0,0)+"% )", x+2*s, y);
        } else {
            textStyle(BOLD);
            text(nf(idx,2,0)+"/ "+this.nom, x, y); x+=3.5*dx;
            textAlign(CENTER,CENTER);
            fill(color(couleur.cur));
            rect(x+1,y-dy/2+1,dx-2,dy-2);
            rect(x+dx+1,y-dy/2+1,dx-2,dy-2);
            rect(x+2*dx+1,y-dy/2+1,dx-2,dy-2);
            rect(x+3*dx+1,y-dy/2+1,dx-2,dy-2);
            rect(x+4*dx+1,y-dy/2+1,dx-2,dy-2);
            rect(x+5*dx+1,y-dy/2+1,dx-2,dy-2);
            fill(color(couleur.bk));
            rect(x+6*dx+1,y-dy/2+1,dx-2,dy-2);
            // rect(x+5*dx+1,y-dy/2+1,dx-2,dy-2);
            fill(color(couleur.txt));
            text(nf(elo,0,1),x+dx/2, y);textStyle(NORMAL);fill(255);
            text(this.gagne,x+dx+dx/2, y);
            text(this.nul,x+2*dx+dx/2, y);
            text(this.perdu,x+3*dx+dx/2, y);
            textSize(10);
            text(this.pour,x+4*dx+dx/2, y);
            text(this.contre,x+5*dx+dx/2, y);
            textSize(5);
            let tmp = '';
            for (let i=0;i<this.victoire;i++) { tmp += '🏆';}
            text(tmp,x+6*dx+dx/2, y);
            tmp = '';
            for (let i=0;i<(this.tireur);i++) { tmp += '🔫';}
            for (let i=0;i<(this.pointeur);i++) { tmp += '🪩';}
            text(tmp,x+7*dx+dx/2, y);
            textSize(12);
        }
    }
    draw(idx,n,w,h, elo=this.ELO) {
        noStroke();
        let x = padding + (w / 40 * (elo-20));
        let dy = h/n;
        let y = 79 + dy*(int(idx)-0.5);
        let r = 2 + this.match/3;
        this.getColor();
        circle(x,y,r);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(12);
        let txt=this.nom.substring(0,20)+' ';
        for (let i=0;i<this.victoire;i++) {
            txt += '🏆';
        }
        text(txt,x+5,y);
        // text(this.nom.substring(0,20),x+5,y);
    }

    fiche(x_,y_,w_,matchs_) {
        let x= x_;
        let y = y_;
        let s = 10;
        noStroke();
        this.getColor();
        rect(x,y-13,s,26);
        fill(color(couleur.bk));
        rect(x+s,y-13,w_-s,26);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(16);
        let tmp='';
        for (let i=0;i<(this.victoire);i++) { tmp += '🏆';}
        text(this.rank+'/ '+this.nom+' ('+nf(this.ELO,0,1)+')',x+2*s,y);
        textAlign(RIGHT,CENTER);
        textSize(14);
        text(tmp,x+w_,y);
        textAlign(LEFT,CENTER);
        fill(color(couleur.bk));
        textSize(12);
        y += 10;
        let dy=22;
        x += s;
        text('Participations :',x,y+dy);
        for (let i in this.annees) {
            text(this.annees[i],x+90+30*i,y+dy);
        }
        dy += 18;
        text('Victoires :',x,y+dy);
        for (let i in this.victoires) {
            text(medaille[0]+this.victoires[i],x+90+50*i,y+dy);
        }
        dy += 18;
        tmp = 'Matchs : Gagnés='+this.gagne + ', Perdus='+this.perdu+', Nuls='+this.nul; 
        text(tmp,x,y+dy);
        dy += 18;
        text('Points Marqués/Encaissés : '+this.pour+' / '+this.contre+' ('+((this.pour>this.contre)?'+':'')+(this.pour-this.contre)+')',x,y+dy);
        dy += 18;
        text('Catégorie Pointeur/Tireur : '+this.pointeur+' / '+this.tireur,x,y+dy);
        dy += 18;
        tmp='Classements : ';
        text( tmp,x,y+dy); dy += 16;
        for (let c of this.clast) {
            tmp =  c.a +':'+ c.c +(c.c==1?'er (':'eme (')+ nf(c.elo,0,1) + ')  ';
            text( tmp,x+s,y+dy);
            dy += 16;
        }
        dy += 2;
        text('Palmares :',x,y+dy);
        for (let i in this.annees) {
            dy += 16;
            let t = this.team[i];
            let m = matchs_[t.matchId];
            let e1 = t.idEq, e2= (t.idEq+1) %2;
            let vs = m.equipes[e2].eq;
            let res = (m.equipes[e1].sc > m.equipes[e2].sc)?'Gagnée':'Perdue';
            let sc = '  ('+m.equipes[e1].sc+'-'+m.equipes[e2].sc+')';
            let vs_t = ' vs ('+vs.nom+') '+ vs.tireur.nom+'/'+vs.pointeur.nom;
            text(t.annee+' ('+t.team+') -'+t.cat+' avec '+t.coeq.nom,x+s,y+dy); dy+=16;
            text('"'+m.type+'" '+res+sc+vs_t,x+2*s,y+dy);
        }
        dy += 18;
        text('Matchs :',x,y+dy);
        let sc_t='', g={Poule:0, Demi:0, Finale:0}, p={Poule:0, Demi:0, Finale:0},n={Poule:0, Demi:0, Finale:0};
        for (let a of this.annees) {
            dy += 16;
            let t = this.matchs.filter( r => {return (r.id==a);});
            // console.log(t);
            sc_t = a;
            for (let i in t) {
                let m = t[i].ref;
                let e1 = t[i].eq, e2= (t[i].eq+1) %2;
                // let vs = m.equipes[e2].eq;
                // let res = (m.equipes[e1].sc > m.equipes[e2].sc)?'Gagnée':'Perdue';
                // console.log(t,m,e1,e2);
                let sc1=m.equipes[e1].sc, sc2 = m.equipes[e2].sc;
                let type =m.type;
                if (type.indexOf('Finale') != -1) type ='Finale';
                if (sc1>sc2) g[type] += 1;
                if (sc1<sc2) p[type] += 1;
                if (sc1==sc2) n[type] += 1;
                sc_t = sc_t + '  ('+sc1+'-'+sc2+')';
                // let vs_t = ' vs ('+vs.nom+') '+ vs.tireur.nom+'/'+vs.pointeur.nom;
            }
            text(sc_t,x+s,y+dy);
        }
        // console.log(g,p,n)
        dy += 32; let vs='', ds='';
        if (g.Finale>1) vs='s';
        if (p.Finale>1) ds='s';
        text('Tableau Finale : '+g.Finale+' victoire'+vs+' / '+p.Finale+' défaite'+ds,x,y+dy);dy+=16;
        vs='';ds='';
        if (g.Demi>1) vs='s';
        if (p.Demi>1) ds='s';
        text('Demi-Finale : '+g.Demi+' victoire'+vs+' / '+p.Demi+' défaite'+ds,x,y+dy);dy+=16;
        text('Poules : Gagné='+g.Poule+' / Nul='+n.Poule+' / Perdu='+p.Poule,x,y+dy);
    }
}

class Equipe {
    constructor(nom_,j1, j2, annee_) {
        this.tireur = j1;
        this.pointeur = j2;
        this.nom = nom_;
        this.ELOm = (j1.ELO + j2.ELO ) /2;
        this.tireur.setTireur(annee_,j2,this.nom);
        this.pointeur.setPointeur(annee_,j1,this.nom);
        this.annee = annee_;
    }

    resetELO() {
        this.ELOm = (this.tireur.ELO + this.tireur.ELO ) /2;
    }

    setVictoire(annee_) {
        this.pointeur.setVictoire(annee_);
        this.tireur.setVictoire(annee_);
    }

    update(delta_,win_) {
        this.tireur.update(delta_,win_);
        this.pointeur.update(delta_,win_);
        this.ELOm = (this.tireur.ELO + this.pointeur.ELO ) /2;
    }

    addMatch(p_,c_,a_,n_,ref_) {
        this.tireur.addMatch(p_,c_,a_,n_,ref_);
        this.pointeur.addMatch(p_,c_,a_,n_,ref_);
    }
    setPalmares(a_,p_,c_,id_) {
        this.tireur.setPalmares(a_,p_,c_,id_);
        this.pointeur.setPalmares(a_,p_,c_,id_);
    }
}

class Match {
    constructor(id_, E1_, E2_, sc1_, sc2_, type_, annee_,poule_="elimination",k_=0,tableau_='ignore') {
        this.id = id_;
        this.equipes = [];
        this.equipes.push({eq:E1_, sc:sc1_});
        this.equipes.push({eq:E2_, sc:sc2_});
        this.type = type_;
        this.annee = annee_;
        this.poule = poule_;
        this.k=k_;
        this.tableau = tableau_;
        this.equipes[0].eq.addMatch(sc1_,sc2_,annee_,0,this);
        this.equipes[1].eq.addMatch(sc2_,sc1_,annee_,1,this);
        this.updateELO();
    }

    updateELO() {
        let ELO1 = this.equipes[0].eq.ELOm;
        let ELO2 = this.equipes[1].eq.ELOm;
        let Kf = param.ELO.std;
        let P = param.ELO.std;
        let v=0;
        let D = (ELO1 - ELO2); let gain=0;
        D = Math.min(param.ELO.maxEcart, Math.max(-param.ELO.maxEcart,D));
        let ecart = Math.abs(this.equipes[0].sc - this.equipes[1].sc)
        let p_ = this.type.indexOf("Finale");
        if (p_ != -1) {
            Kf = param.ELO.finaliste;
            this.equipes[0].eq.setPalmares(this.annee,0,1,this.id);
            this.equipes[1].eq.setPalmares(this.annee,1,0,this.id);
        }
        if (this.type == "Demi") Kf = param.ELO.demi;
        if (this.type == "Finale") Kf = param.ELO.finale;
        if (ecart>param.ELO.bonusSeuil) P = param.ELO.bonus;

        if (this.equipes[0].sc > this.equipes[1].sc) {
            if (this.type == "Finale") this.equipes[0].eq.setVictoire(this.annee);
            gain = 1 - D/param.ELO.seuil;
            v=1;
        }
        if (this.equipes[0].sc < this.equipes[1].sc) {
            if (this.type == "Finale") this.equipes[1].eq.setVictoire(this.annee);
            gain = -(1 +  D/ param.ELO.seuil);
            v=-1;
        }
        if (this.equipes[0].sc == this.equipes[1].sc) {
            gain = - D/ param.ELO.seuil;
            v=0;
        }
        this.equipes[0].eq.update(gain*P*Kf,v);
        this.equipes[1].eq.update(-gain*P*Kf,-v);
    }
}