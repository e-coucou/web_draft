function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    // console.log(fs);
    // if (!fs) { fullscreen(true);}
    // console.log(touches[0].x+'/'+touches[0].y,20,height-50);
    checkDots(touches[0].x, touches[0].y);
}
function mousePressed() {
    mouseSelection=true;
    checkDots(mouseX,mouseY);
}
function mouseMoved() {
    xM = max(padding,min(mouseX,width-2*padding));
    yM = max(padding,min(mouseY,height-2*padding));
}

function checkDots(mX, mY) {
    if ( ((frameCount-debounce) > 10) ) {
        debounce = frameCount;
        // Selection de la categorie du joueur /Tireur/Pointeur/Indifférent
        for( let n in btCategories) {
            let c = btCategories[n];
            if (c.isIn(mX,mY,mode)) {
                let id_ = selCat[n].id;
                c.setSW(setCat,id_);
                return
            }
        }
        // Selection de la couleur
        for( let n in btCouleur) {
            let c = btCouleur[n];
            if (c.isIn(mX,mY,mode)) { update_color(n); return; }
        }
        //    Boutons  +/-  de Param
        for( let n in btPM) {
            let b = btPM[n];
            if (b.isIn(mX,mY,mode)) { update_PM(n); return; }
        }
        //    Boutons  Navigation
        for( let n in btNav) {
            let b = btNav[n];
            if (b.isIn(mX,mY,mode)) { update_Nav(n); return; }
        }
        // selection switch Tournoi/Liste
        if (btTournoi.isIn(mX,mY,mode)) {
            clearButtons();
            btTournoi.setOn();
            BtTournoi();
            return;
        }
        if (btListe.isIn(mX,mY,mode)) { 
            clearButtons();
            btListe.setOn();
            mode=0;
            return;
        }
        if (btEncours.isIn(mX,mY,mode)) { 
            clearButtons();
            btEncours.setOn();
            mode=10;
            return;
        }
        // selection Bouton de retour
        // if (btRetour.isIn(mX,mY,mode)) {  mode=mode_prev; toggle=true; btTournoi.setOff(); return; }
        // slecture de la notice / read ELO explication
        if (btNotice.isIn(mX,mY,mode)) { readNotice(); return;}
        if (btELO.isIn(mX,mY,mode)) { readELO(); return; }
        //     Selection de l'année
        for( let n in btAnnee) {
            let c = btAnnee[n];
            if (c.isIn(mX,mY,mode)) { setDateSel(n); return; }
        }
        //     Selection de la phase
        for( let n in btPhase) {
            let c = btPhase[n];
            if (c.isIn(mX,mY,mode)) { setPhase(n); return; }
        }
        for( let n in btPoule) {
            let c = btPoule[n];
            if (c.isIn(mX,mY,mode)) { setPoule(n); return; }
        }
        // selection d'un joueur dans la liste
        if (mX>(padding) && mX<(width-padding) && (mode==0) ) {
            let id_ = round((mY - 85-18) / inter); // y_ + dy_
            if ( id_<0 || id_>=eJoueurs.length) {
                mode=0;
            } else {
                // id = eJoueurs[id_].id;
                id = id_;
                mode_prev = mode;
                mode = 2;
            }
        }
        // selection d'un joueur dans la liste pour l'année en cours
        dy = height*0.85/j_json.length * 2;
        if (mX>(padding) && mX<(width-padding) && mY>(65-dy/2) && (mode==6) ) {
            let id_ = 2 * round((mY - 65) / dy) + ((mX>width/2)?2:1); // y_ + dy_
            if ( id_<0 || id_>=initJoueurs.length) {
                // console.log('rien')
                return;
            } else {
                // id = eJoueurs[id_].id;
                updateSelJoueur(id_);
            }
        }
        // selection des equipes pointeurs/tireurs pour l'année en cours ..
        dy = height*0.85/(16+2);
        if (mX>(padding) && mX<(width-padding) && mY>(65-dy/2) && mY<(65+9*dy) && (mode==8) ) {
            let id_ = 2*round((mY - 65) / dy) + ((mX>width/2)?2:1) - 1; // y_ + dy_
            if ( id_<0 || id_>=16) {
                // console.log('rien')
                return;
            } else {
                // id = eJoueurs[id_].id;
                GetJoueur(id_);
            }
        }        
        // selection des scores pour l'année en cours ..
        dy = height*0.85/(22);
        let nb=matchs.filter(s => {return s.annee==enCours}).length;
        if (mX>(padding) && mX<(width-padding) && mY>(50+dy/2) && mY<(50+(nb+1)*dy) && (mode==10) ) {
            let id_ = round((mY - 50) / dy) - 1;
            if ( id_<0 || id_>=nb) {
                // console.log('rien')
                return;
            } else {
                GetScore(int(id_));
            }
        }        
        if (btZoom.isIn(mX,mY,mode)) { mode=2;clearButtons();btZoom.setOn(); return;}
        if (btEquipe.isIn(mX,mY,mode)) { updateTeam(); return;}
        if (btResetEquipe.isIn(mX,mY,mode)) { if (mode==7) {resetTeam()} else {resetTeamSel()}; return;}
        if (btRandom.isIn(mX,mY,mode)) { randomTeam(); return;}
        if (btGraphe.isIn(mX,mY,mode)) {
            mode_prev = mode;
            clearButtons();
            btGraphe.setOn();
            BtGraphe();
            return;
        }    
        if (btInfo.isIn(mX,mY,mode)) { mode_prev = mode; mode = 4; clearButtons(); btInfo.setOn(); return }
        // Selection du match par la bande colorée (meme emplacement que sel Poule)
        if (mX>(padding) && mX<(width-1*padding) && mY>54 && mY<79 && (mode==3 ||mode==0) ) {
            let id_ = floor((mX-padding) / ((width-2*padding) / matchs.length));
            updateMatch(id_);
        }
        if (btFiltre.isIn(mX,mY,mode)) {filtreJ = !(filtreJ);
            btFiltre.txt='🌐'; if (filtreJ) {btFiltre.txt='🔢';}
        }
        // if (mode == 3) {
        //     let id_ = floor((mY-82)/joueurs.length);
        //     console.log(id_,'/',mY)
        // }
    }    
}