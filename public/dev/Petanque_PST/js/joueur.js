const Ke = 1.5;
const I = 40;
const Kr = 10.;

class Joueur {
    constructor(nom_, id_) {
        this.nom=nom_;
        this.id = id_;
        this.ELO = I;
        this.rank = 0;
        this.match = 0;
        this.tireur = 0;
        this.pointeur = 0;
        this.gagne=0;
        this.perdu=0;
        this.nul=0;
        this.victoire = 0;
        this.pour=0;
        this.contre=0;
        this.annees=[];
        this.victoires=[];
        this.hist=[];
        this.palmares=[];
        this.clast = [];
        this.team = [];
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
            case 0 : fill(10,120,10); break;
            case 1 : fill(10,200,10); break;
            case 2 : fill(10,255,10); break;
        }
        if (this.id == idSel) {fill(color(couleur.cur));}
    }
    show(idx, x_, y_, w_, elo=this.ELO) {
        let x= x_, y = y_;
        noStroke();
        this.getColor();
        rect(x-7,y-9,6,18);
        fill(10,70,10);
        rect(x,y-9,w_,18);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(12);
        if (debug == 1) {
            text(nf(idx,2,0)+"/ "+this.nom+" ["+nf(elo,0,1)+"] "+this.gagne+"/"+this.nul+"/"+this.perdu+" ("+nf(100.*this.gagne/(this.gagne+this.perdu),0,0)+"% )", x, y);
        } else {
            text(nf(idx,2,0)+"/ "+this.nom+" ["+nf(elo,0,1)+"] ", x, y);
        }
    }
    draw(idx,n,w,h, elo=this.ELO) {
        noStroke();
        let x = padding + (w / 40 * (elo-20));
        let dy = h/n;
        let y = padding + dy*(int(idx)-0.5);
        let r = 2 + this.match/4;
        this.getColor();
        circle(x,y,r);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(10);
        text(this.nom.substring(0,20),x+5,y);
    }

    fiche(x_,y_,w_,matchs_) {
        let x= x_;
        let y = y_+35;
        noStroke();
        this.getColor();
        rect(x,y-13,5,26);
        fill(10,50,10);
        rect(x+5,y-13,w_-5,26);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(16);
        text(this.rank+'/ '+this.nom+' ('+nf(this.ELO,0,1)+')',x+7,y);
        fill(10,50,10);
        textSize(12);
        let dy=22;
        text('Participations :',x,y+dy);
        for (let i in this.annees) {
            text(this.annees[i],x+90+30*i,y+dy);
        }
        dy += 18;
        text('Victoires :',x,y+dy);
        for (let i in this.victoires) {
            text(this.victoires[i],x+90+30*i,y+dy);
        }
        dy += 18;
        let tmp = 'Matchs : Gagnés='+this.gagne + ', Perdus='+this.perdu+', Nuls='+this.nul; 
        text(tmp,x,y+dy);
        dy += 18;
        text('Points Marqués/Encaissés : '+this.pour+' / '+this.contre+' ('+((this.pour>this.contre)?'+':'')+(this.pour-this.contre)+')',x,y+dy);
        dy += 18;
        text('Catégorie Pointeur/Tireur : '+this.pointeur+' / '+this.tireur,x,y+dy);
        dy += 18;
        tmp='Classements : ';
        for (let c of this.clast) {
            tmp = tmp + c.a +':'+ c.c +(c.c==1?'er (':'eme (')+ nf(c.elo,0,1) + ')  ';
        }
        text( tmp,x,y+dy);
        dy += 18;
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
            text(t.annee+' ('+t.team+') -'+t.cat+' avec '+t.coeq.nom+' "'+m.type+'" '+res+sc+vs_t,x+5,y+dy);
        }
        dy += 18;
        text('Matchs :',x,y+dy);
        let sc_t='';
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
                sc_t = sc_t + '  ('+m.equipes[e1].sc+'-'+m.equipes[e2].sc+')';
                // let vs_t = ' vs ('+vs.nom+') '+ vs.tireur.nom+'/'+vs.pointeur.nom;
            }
            text(sc_t,x+5,y+dy);
        }
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
    constructor(id_, E1_, E2_, sc1_, sc2_, type_, annee_,poule_="elimination") {
        this.id = id_;
        this.equipes = [];
        this.equipes.push({eq:E1_, sc:sc1_});
        this.equipes.push({eq:E2_, sc:sc2_});
        this.type = type_;
        this.annee = annee_;
        this.poule = poule_;
        this.equipes[0].eq.addMatch(sc1_,sc2_,annee_,0,this);
        this.equipes[1].eq.addMatch(sc2_,sc1_,annee_,1,this);
        this.updateELO();
    }

    updateELO() {
        let ELO1 = this.equipes[0].eq.ELOm;
        let ELO2 = this.equipes[1].eq.ELOm;
        let Kf = 1.;
        let P = 1.;
        let v=0;
        let D = (ELO1 - ELO2); let gain=0;
        D = Math.min(5, Math.max(-5,D));
        let ecart = Math.abs(this.equipes[0].sc - this.equipes[1].sc)
        let p_ = this.type.indexOf("Finale");
        if (p_ != -1) {
            Kf = 1.1;
            this.equipes[0].eq.setPalmares(this.annee,0,1,this.id);
            this.equipes[1].eq.setPalmares(this.annee,1,0,this.id);
        }
        if (this.type == "Demi") Kf = 1.;
        if (this.type == "Finale") Kf = 1.2;
        if (ecart>6) P = Ke;

        if (this.equipes[0].sc > this.equipes[1].sc) {
            if (this.type == "Finale") this.equipes[0].eq.setVictoire(this.annee);
            gain = 1 - D/Kr;
            v=1;
        }
        if (this.equipes[0].sc < this.equipes[1].sc) {
            if (this.type == "Finale") this.equipes[1].eq.setVictoire(this.annee);
            gain = -(1 +  D/ Kr);
            v=-1;
        }
        if (this.equipes[0].sc == this.equipes[1].sc) {
            gain = - D/ Kr;
            v=0;
        }
        this.equipes[0].eq.update(gain*P*Kf,v);
        this.equipes[1].eq.update(-gain*P*Kf,-v);
}
}