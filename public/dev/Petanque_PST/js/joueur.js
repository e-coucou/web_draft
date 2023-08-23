const K = 3;
const P = 1.5;
const I = 100;

class Joueur {
    constructor(nom_, id_) {
        this.nom=nom_;
        this.id = id_;
        this.ELO = I;
        this.match = 0;
        this.tireur = 0;
        this.pointeur = 0;
    }

    update(delta_) {
        this.ELO += delta_;
    }
}

class Equipe {
    constructor(nom_,j1, j2) {
        this.tireur = j1;
        this.pointeur = j2;
        this.nom = nom_;
        this.ELOm = (j1.ELO + j2.ELO ) /2;
    }

    update(delta_) {
        this.tireur.update(delta_);
        this.pointeur.update(delta_);
    }
}

class Match {
    constructor(id_, E1_, E2_, sc1_, sc2_, type_, annee_) {
        this.id = id_;
        this.Equipe1 = E1_;
        this.Equipe2 = E2_;
        this.Sc1 = sc1_;
        this.Sc2 = sc2_;
        this.type = type_;
        this.annee = annee_;
        this.updateELO();
    }

    updateELO() {
        let ELO1 = this.Equipe1.ELOm;
        let ELO2 = this.Equipe2.ELOm;
        let gain = Math.abs(ELO1 - ELO2) + K;
        let ecart = Math.abs(this.Sc1 - this.Sc2)
        if (this.type == "Finale") gain *= 2;
        if (this.Sc1 > this.Sc2) {
            if (ecart>6) { 
                this.Equipe1.update(gain*P);
                this.Equipe2.update(-gain*P);
            } else {
                this.Equipe1.update(gain);
                this.Equipe2.update(-gain);
            }
        }
        if (this.Sc1 < this.Sc2) {
            if (ecart>6) { 
                this.Equipe1.update(-gain*P);
                this.Equipe2.update(gain*P);
            } else {
                this.Equipe1.update(-gain);
                this.Equipe2.update(gain);
            }
        }
    }
}