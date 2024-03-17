const eC = {version: 'v1.0', release:'r0', date:'feb/22', owner: 'rky', code:'y2I', annee:'2022', maj:'mars/24'};
let mobile;
let canvas;
let fichier;
let liste_mots = []
let mot, mot_arr = [];
let propal = [],
    ligne = [],
    result = [];
let nb = 0,
    nbL = 0;
let w;
let succes = 0;
let col = 0;
let in_out = true;
let vert, gold;

let alpha;
let clavier = [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['Enter', 'Enter', 'W', 'X', 'C', 'V', 'B', 'N', 'Backspace', 'Backspace']
]

function preload() {
    fichier = loadJSON("./data/mots_off.json");
    alpha = loadJSON("./data/alphabet.json");
}

function aff_alph() {
    w_c = w / 2;
    w_h = w_c * 1.5;
    textSize(w_c * 0.4);
    textStyle(NORMAL);
    for (i in alpha) {
        // console.log(alpha[i]);
        c = alpha[i];
        fill(c.t || 45);
        stroke(90);
        strokeWeight(1);
        rect(c.c * w_c, c.l * w_h + 6.4 * w, w_c * c.w, w_h, 5);
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text(c.n, (c.c + c.w / 2) * w_c, c.l * (w_h) + w_h / 2 + 6.4 * w);
    }
}

function check_key(key, keyCode) {
    // console.log(key, keyCode);
    in_out = true;
    if (keyCode >= 65 && keyCode <= 90) {
        if (nb < 5) {
            propal[nb] = (key.toUpperCase());
            nb++;
        }
    } else if (key == 'Backspace') {
        result = [];
        if (nb > 0) {
            propal.pop();
            nb--;
        }
    } else if (key == 'Enter') {
        if (nb == 5) check_propal();
    } else if (key == 'Control') {
        console.log(mot);
    }
}

function keyTyped() {
    // check_key(key);
}

function keyPressed() {
    check_key(key, keyCode);
}

function check_mouse() {
    let w_c = w / 2;
    let w_h = w_c * 1.5;
    let h = 6.4 * w;
    let c = 0,
        l = 0;
    if (mouseY > h && mouseY < (h + 3 * w_h)) {
        l = floor((mouseY - h) / w_h);
        c = floor(mouseX / w_c);
        key = clavier[l][c];
        keyCode = clavier[l][c].charCodeAt();
        if (key == 'Enter') keyCode = 13;
        if (key == 'Backspace') keyCode = 8;
        check_key(key, keyCode);
    }
}

function touchStarted() {
    check_mouse();
    // console.log('touch');
    // return false;
}

function mousePressed() {
    check_mouse();
}

function algo_check() {
    succes = 0;
    ret = [];
    let X = {},
        Y = {};
    for (i = 0; i < 5; i++) {
        A = propal[i];
        B = mot_arr[i];
        if (!X[A]) {
            X[A] = [];
        }
        X[A].push(i);
        if (!Y[B]) {
            Y[B] = [];
        }
        Y[B].push(i);
    }
    for (x in X) {
        let nkC = X[x].length;
        let nOk = 0;
        for (i of X[x]) {
            if (Y[x]) {
                if (Y[x].length >= nkC + nOk) {
                    ret[i] = gold; //color(255, 215, 0);
                    if (!alpha[propal[i]]['t']) {
                        alpha[propal[i]]['t'] = gold; //color(255, 215, 0);
                    }
                    for (j of Y[x]) {
                        if (i == j) {
                            ret[i] = vert;
                            alpha[propal[i]]['t'] = ret[i];
                            succes++;
                        }
                    }
                } else {
                    for (j of Y[x]) {
                        if (i == j) {
                            ret[i] = vert;
                            succes++;
                            nOk++;
                        }
                    }
                }
            } else {
                ret[i] = color(75, 75, 75);
                alpha[propal[i]]['t'] = color(90, 90, 90);
            }
            nkC--;
        }
    }
    return ret;
}

function check_propal() {
    let propal_car = '';
    for (c of propal) {
        propal_car += c;
    }
    in_out = false;
    for (t in fichier) {
        if (fichier[t] == propal_car) {
            in_out = true;
        }
    }
    if (!in_out) return in_out;
    result = algo_check();
    ligne.push({
        p: propal,
        r: result,
        n: nbL
    })
    result = [];
    propal = [];
    nbL++;
    nb = 0;
    return in_out;
}

function copyright() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(8);
    text('e-coucou 2022', width - 30, height - 5);
    text('by MiniP', 5, height - 5);
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m*4/7,m);
    w = width / 5;
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(1,1); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    vx=select("#vx"); vx.html('⌖ '+eC.version+' '+eC.release+' >'+eC.maj+'<');
    cr=select("#cr"); cr.html('(ツ) © eCoucou '+eC.annee);
    windowResized();

    vert = color('#63DAC5');
    gold = color('#FFC700');

    for (l in fichier) {
        liste_mots.push(fichier[l]);
    }
    mot = random(liste_mots);
    for (l of mot) {
        mot_arr.push(l);
    }
}


function draw() {
    background(0)
    textSize(w * 0.35);
    textStyle(BOLD);
    for (l = 0; l < 6; l++) {
        stroke(90);
        if (l === nbL) { // la ligne en cours
            if (in_out) {
                strokeWeight(3);
                stroke(90);
                fill(0);
            } else {
                strokeWeight(10);
                stroke(color(180, 20, 20));
            }
        } else {
            strokeWeight(1);
            fill(0);
        }
        for (c = 0; c < 5; c++) {
            square(3 + c * (w), 5 + l * (w + 5), w - 7, 10);
        }
    }
    // la ligne validée ...
    for (k of ligne) {
        let def_color = color(90, 90, 90);
        for (i = 0; i < 5; i++) {
            stroke(0);
            strokeWeight(3);
            fill(k.r[i] || def_color);
            square(3 + i * w, k.n * (w + 5) + 5, w - 7, 10);
            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            text(k.p[i], (i + 1 / 2) * w, k.n * (w + 5) + w / 2 + 8);
        }
    }
    for (i = 0; i < nb; i++) {
        if (in_out) {
            fill(45);
        } else {
            fill(color(100, 20, 20));
        }

        square(3 + i * w, nbL * (w + 5) + 5, w - 7, 10);
        fill(255);
        textAlign(CENTER, CENTER);
        text(propal[i], (i + 1 / 2) * w, nbL * (w + 5) + w / 2 + 8);
    }
    if (succes == 5) {
        fill(vert);
        rect(w * 0.5, height - 1.8 * w, 4 * w, 1.3 * w, 20);
        fill(255);
        let msg = 'Bravo';
        switch (nbL) {
            case 1:
                msg = 'Coup de Bol!';
                break;
            case 2:
                msg = 'Excellent !';
                break;
            case 3:
                msg = 'Impressionant !';
                break;
            case 4:
                msg = 'Bravo ...';
                break;
            case 5:
                msg = 'Bof !';
                break;
            case 6:
                msg = 'Gros Nul !';
                break;
        }
        text(msg, width / 2, height - w);
        noLoop();
    } else if (nbL == 6) {
        fill('#b00020');
        rect(w * 0.5, height - 1.8 * w, 4 * w, 1.3 * w, 20);
        fill(255);
        text(mot, width / 2, height - w);
        noLoop();
    } else aff_alph();
    copyright();

    rate.html(' Exécution en '+round(deltaTime)+' ms');
}