function mousePressed() {
    // Mode 0 = Liste
    // Mode 1 = Tournoi
    // Mode 2 = Fiche
    // Mode 3 = GrapheX
    // Mode 4 = Param
    //
    if ( ((frameCount-debounce) > 10) ) {
        debounce = frameCount;
        // Selection de la categorie du joueur /Tireur/Pointeur/Indifférent
        for( let n in btCategories) {
            let c = btCategories[n];
            if (c.isIn(mouseX,mouseY,mode)) {
                let id_ = selCat[n].id;
                c.setSW(setCat,id_);
                return
            }
        }
        // Selection de la couleur
        for( let n in btCouleur) {
            let c = btCouleur[n];
            if (c.isIn(mouseX,mouseY,mode)) { update_color(n); return; }
        }
        //    Boutons  +/-  de Param
        for( let n in btPM) {
            let b = btPM[n];
            if (b.isIn(mouseX,mouseY,mode)) { update_PM(n); return; }
        }
        //    Boutons  Navigation
        for( let n in btNav) {
            let b = btNav[n];
            if (b.isIn(mouseX,mouseY,mode)) { update_Nav(n); return; }
        }
        // selection switch Tournoi/Liste
        if (btTournoi.isIn(mouseX,mouseY,mode)) { btTournoi.setSW(BtTournoi); return; }
        // selection Bouton de retour
        if (btRetour.isIn(mouseX,mouseY,mode)) {  mode=mode_prev; toggle=true; btTournoi.setOff(); return; }
        // slecture de la notice / read ELO explication
        if (btNotice.isIn(mouseX,mouseY,mode)) { readNotice(); return;}
        if (btELO.isIn(mouseX,mouseY,mode)) { readELO(); return; }
        //     Selection de l'année
        for( let n in btAnnee) {
            let c = btAnnee[n];
            if (c.isIn(mouseX,mouseY,mode)) { setDateSel(n); return; }
        }
        //     Selection de la phase
        for( let n in btPhase) {
            let c = btPhase[n];
            if (c.isIn(mouseX,mouseY,mode)) { setPhase(n); return; }
        }
        for( let n in btPoule) {
            let c = btPoule[n];
            if (c.isIn(mouseX,mouseY,mode)) { setPoule(n); return; }
        }
        // selection d'un joueur dans la liste
        if (mouseX>(padding) && mouseX<(width-padding) && mode==0) {
            let id_ = round((mouseY - 80) / inter);
            if ( id_<0 || id_>=joueurs.length) {
                mode=0;
            } else {
                id = id_;
                mode_prev = mode;
                mode = 2;
            }
        }
        if (btGraphe.isIn(mouseX,mouseY,mode)) {
            mode_prev = mode;
            btGraphe.setSW(BtGraphe);
            return;
        }    
        if (btInfo.isIn(mouseX,mouseY,mode)) { mode_prev = mode; mode = 4; return }
        // Selection du match par la bande colorée (meme emplacement que sel Poule)
        if (mouseX>(padding) && mouseX<(width-1*padding) && mouseY>54 && mouseY<79 && mode==3) {
            let id_ = floor((mouseX-padding) / ((width-2*padding) / matchs.length));
            index = id_;
            annee = matchs[id_].annee;
            for (let i in annees) {
                c = btAnnee[i];
                if (annees[i].a == annee) { c.setOn();} else { c.setOff();}
            }
                }
        // if (mode == 3) {
        //     let id_ = floor((mouseY-82)/joueurs.length);
        //     console.log(id_,'/',mouseY)
        // }
    }
}
function mouseMoved() {
    xM = max(padding,min(mouseX,width-2*padding));
    yM = max(padding,min(mouseY,height-2*padding));
}