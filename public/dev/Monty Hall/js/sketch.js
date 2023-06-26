let portes=[];
let nbPortes=3;
let etat="CHOIX";
let choix;
let ouverte;
let result, stats;
let bets = [0,0,0];
let playAlone=false;
let switchBt, keepBt, rePlayBt, aloneBt;
let nbSwitch=0, nbStay=0, nbWinStay=0, nbWinSwitch=0, nbPlay=0;

/** This function sets up our sketch. */
function setup() {
    canvas = createCanvas(360, 150);
    // noCanvas();
    for (let i=0; i< nbPortes; i++) {
        portes[i]= createDiv("");
        portes[i].parent("#porte");
        portes[i].class('porte');
        portes[i].mousePressed(choisir);
        portes[i].index=i;
    }

    canvas.parent("#canvas");

    aloneBt = createButton("Automatic");
    aloneBt.mousePressed(alone);
    aloneBt.parent("#alone");
    switchBt = createButton("Change");
    switchBt.mousePressed(change);
    switchBt.hide();
    keepBt = createButton("Garde");
    keepBt.mousePressed(garde);
    keepBt.hide();
    rePlayBt = createButton("Re-Jouer");
    rePlayBt.mousePressed(rejouer);

    result=createP();
    stats=createP();
    stats.class('stat');

    rejouer();
}

function alone() {
    playAlone = !playAlone;
}

function rejouer() {
    etat="CHOIX";
    for (let i=0; i< nbPortes; i++) {
        portes[i].prix= "🐐";
        portes[i].html("");
        portes[i].style("background-color", "#26c");
    }
    let gain = random(portes);
    gain.prix="🚙";

    rePlayBt.hide();
    result.html("");
}

function choisir(auto) {
    if (etat == "CHOIX") {
        if (auto) {
            choix=random(portes);
        } else {
            choix =this;
        }
        bets[choix.index] += 1;
        choix.style('background-color','#8ff');
        etat = "SECOND";
        openPorte();
    }
}


function openPorte() {
    let options = [];
    for (let i=0; i<nbPortes ; i++) {
        if (i != choix.index && portes[i].prix == "🐐") {
            options.push(portes[i]);
        }
    }

    ouverte=random(options);
    ouverte.html(ouverte.prix);
    ouverte.style("background-color","#F9A");
    switchBt.show();
    keepBt.show();
}

function change() {
    if (etat == "SECOND") {
        let newChoix;
        for (let i=0; i<nbPortes; i++) {
            if (i != choix.index && i != ouverte.index ) {
                newChoix = portes[i];
                break;
            }
        }
        choix = newChoix;
        nbSwitch++;
        victoire(true);
    }
}

function garde() {
    nbStay++;
    victoire(false);
}

function victoire(isSwitch) {
    etat = "FIN";
    switchBt.hide();
    keepBt.hide();
    for (let i=0; i<nbPortes; i++) {
        portes[i].html(portes[i].prix);
        portes[i].style("background-color", "#ccc")
    }

    if (choix.prix == '🚙' ) {
        result.html("GAGNE !");
        choix.style("background-color","#AFA");
        if (isSwitch) {nbWinSwitch++;} else {nbWinStay++;}
    } else {
        result.html("PERDU ...");
        choix.style("background-color","#F9A");
    }

    let statSW = nbWinSwitch/nbSwitch * 100;
    let statStay = nbWinStay/nbStay * 100;
    nbPlay += 1;

    stats.html("Switch rate: "+nf(statSW,0,1)+"%<br>"+"Stay rate: "+nf(statStay,0,1)+"%<br>Play: #"+nf(nbPlay,0,0)+"");
    rePlayBt.show();

}

function statistics() {
    let w = width/3-20;
    for (let i=0;i<3;i++) {
        noStroke();
        fill(25,200,30);
        let x = i*(w+20) +10;
        let y = height * (0.7-bets[i]/nbPlay);
        rect(x,y,w,height-y);
        textAlign(CENTER,CENTER);
        fill(255);
        textSize(32);
        text(bets[i],x+w/2,height*2/3);
    }
}

function draw() {
    background(240);
    if (nbPlay>1) { statistics();}
    if (playAlone) {
        if (etat=="CHOIX") {
            choisir('auto');
        }
        if (etat=="SECOND") {
            let i = random();
            if (i>0.49999) {
                change();
            } else {
                garde();
            }
        }
        if (etat=="FIN") {
            rejouer();
        }
    }
}
