const eC = {version: 'v0.01', release:'r1', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};

// import * as su from './suduku.js';

let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;
let wEP,hEP;
const pEP = 50;
const RES = 100;
let message;

const NUM_POPULATION = 6;
const surface = { name: 'Layer Summary', tab: 'Model Inspection'};
const surface2 = { name: 'Layer Summary', tab: 'Train'};

// import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';


const cVert = [10,200,150];
const offset = 5;
let bgRate;

let startTime, endTime, courbe1;

let suduku, carte= [], test = [];
let model, modelLoss, modelAcc, modelHistory, modelTrain=false;
let train_set, test_set, train_csv, test_csv;
let Valeur = {v:'x',c:[255,0,0],r:0};

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

function preload() { // voir getdata.js pour les preloads
    // dataJson = loadJSON('./data/dataEP.json');
    train_csv = loadTable('./data/bloc_ttf_calendar_prices.csv','csv','header');
    // test_csv = loadTable('./data/mnist_test.csv','csv','header');
}

function tfVisualisation() {
    tfvis.visor().toggle();
}

function windowResized() {
    let wm = innerWidth * 1;
    let hm = innerHeight * 0.92;
    resizeCanvas(wm-0,hm-0);
    bgRate = new barGraph(width-60,height-40,45,12,0,100);
    wEP = width-2*offset;
    hEP = height - 2*offset - pEP;
    let x = offset+10, y= height-offset-20;
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    windowResized();
    reset();
}

function prediction() {
    const [val,r] = train_set.value(mouseX,mouseY);
    if (val != null) {
            const xS = tf.tensor2d([val.data]);
            let pred = tf.argMax(model.predict(xS).dataSync()).dataSync()[0];
            Valeur.v = pred;
            Valeur.r = r;
            if (r==pred) {Valeur.c=[0,255,0];} else {Valeur.c=[255,0,0];}
    }
}

function reset() {

    train_set = new dataSet(train_csv.rows,20,10,wEP-20,hEP);

    rate.html('Construction du DataSet ...');
    start();
    train_csv = '';
    train_set.build(10000);
    let tps=end();
    console.log('conversion: ',tps);
    message = 'DataSet construit en '+tps+'ms';
    rate.html(message);
    start();
    initTF();
    trainModel();
}

async function train(i,o) {
    const xS = tf.tensor2d(i);
    const yS = tf.tensor2d(o);
    let ret = await model.fit(xS, yS, {epochs: 10, shuffle: true});
    tf.dispose(xS);
    tf.dispose(yS);
    return ret;
}

function initTF() {
    model = tf.sequential();
    // model.add(tf.layers.flatten({inputShape:[28,28]}));
    model.add(tf.layers.dense({ units: 92, inputShape:[784], activation: 'relu'}));
    model.add(tf.layers.dense({ units: 32, activation: 'relu'}));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax'}));
    const optimiser = tf.train.adam(0.01);
    model.compile({loss: 'categoricalCrossentropy', optimizer: optimiser, metrics: ['accuracy']});
}

function trainModel() {
    let inputs =[],outputs = [];
    for (let mn of train_set.dataSet) {
        inputs.push(mn.data);
        outputs.push(mn.label);
    }

    train(inputs, outputs).then( (ret) => { 
        console.log(ret.history);
        modelHistory = ret;
        modelTrain = true;
        modelLoss = ret.history.loss.slice();
        modelAcc = ret.history.acc.slice();
        let tps = end()
        console.log('Train: ',tps);
        message = 'Apprentissage: en :'+tps+'ms';
        rate.html(message);
        train_set.predict(model);
        loop();
    } );
}

function draw() {
    background(0);
    rate.html(message);
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------

    // suduku.show();

    train_set.show()

    // if (modelTrain) {
    //     courbe1 = new Courbe(modelLoss,bubbles.max+10,10,width-bubbles.max-20,height/4);
    //     courbe1.setTitre('Loss');
    //     courbe1.setSeuilSup(0.1);
    //     courbe1.color = color('#00ADB5');
    //     courbe1.bkColor = color('#393E46');
    //     courbe1.txtColor = color('#EEEEEE');
    //     courbe1.show();
    //     let courbe2 = new Courbe(modelAcc,bubbles.max+10,height/4+30,width-bubbles.max-20,height/4);
    //     courbe2.setTitre('Accuracy');
    //     courbe2.setSeuilInf(0.95);
    //     courbe2.color = color('#00ADB5');
    //     courbe2.bkColor = color('#393E46');
    //     courbe2.txtColor = color('#EEEEEE');
    //     courbe2.show();
    // }

    if (modelTrain) {
        tf.tidy( () => {
            tfvis.show.layer(surface, model.getLayer(undefined, 1));    
            tfvis.show.history(surface2, modelHistory, ['loss', 'acc']);
        });
    }
    //----
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    textSize(32);textAlign(LEFT,BOTTOM);
    let x = offset+10, y= height-15;
    fill(color(Valeur.c)); noStroke();
    text(Valeur.v,x+10,y);
    textSize(12);
    text('(valeur attendue : '+Valeur.r+')',x+80,y);
    // etat = (!DEBUG?'🌐':'')+(FLAT?'⎯':'')+(RAINBOW?'🌈':'')+(btDensite.value?'👨‍👩‍👦‍👦':'');
    // text('⏹️  ▶️',x,y);
    // text(searchInfo,7*width/8-55,3*height/4-7);

    bgRate.anim(deltaTime);
    noLoop();
}