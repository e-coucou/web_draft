function addMatiere(m,sub) {
    if (sub) {
        let s = matieres.find((a) => {return (a.id==m.code);});
        if (s == undefined) {
            matieres.push(new Matiere(m.produit, m.code ));
        }
    } else {
        let s = matieres.find((a) => {return (a.id==m.cp_code);});
        if (s == undefined) {
            matieres.push(new Matiere(m.composant, m.cp_code ));
        }
    }
}

class Matiere {
    constructor(nom_,id_) {
        this.nom = nom_;
        this.id = id_;
        // this.qur = qur_;
        // this.qus = qus_;
        // this.lot = lot_;
        this.ssComp = [];
    }
}