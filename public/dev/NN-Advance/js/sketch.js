const eC = {version: 'v0.01', release:'r1', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;
let wEP,hEP;
const pEP = 50;
const RES = 100;

const NUM_POPULATION = 6;
const surface = { name: 'Layer Summary', tab: 'Model Inspection'};
const surface2 = { name: 'Layer Summary', tab: 'Train'};

// import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';


const cVert = [10,200,150];
const offset = 5;
let bgRate;

let startTime, endTime, courbe1;

let bubbles, carte= [], test = [];
let model, modelLoss, modelAcc, modelHistory, modelTrain=false;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

function preload() { // voir getdata.js pour les preloads
    // dataJson = loadJSON('./data/dataEP.json');
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

function reset() {
    bubbles = new Bubble(NUM_POPULATION,50,10,hEP*0.7);
    initTF();
}

async function train(i,o) {
    const xS = tf.tensor2d(i);
    const yS = tf.tensor2d(o);
    return await model.fit(xS, yS, {epochs: 100, shuffle: true});
}

function initTF() {
    model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape:[2], activation: 'sigmoid'}));
    model.add(tf.layers.dense({ units: 28, activation: 'sigmoid'}));
    // model.add(tf.layers.dense({ units: 16, activation: 'sigmoid'}));
    model.add(tf.layers.dense({ units: NUM_POPULATION, activation: 'softmax'}));
    const optimiser = tf.train.adam(0.01);
    model.compile({loss: 'categoricalCrossentropy', optimizer: optimiser, metrics: ['accuracy']});

    let [inputs,outputs] = bubbles.convert();

    train(inputs, outputs).then( (ret) => { 
        console.log(ret.history);
        modelHistory = ret;
        modelTrain = true;
        modelLoss = ret.history.loss.slice();
        modelAcc = ret.history.acc.slice();
        loop();
        colorie();
    } );
}

function colorie() {
    let incX = bubbles.wide/RES; 
    let incY = bubbles.wide/RES;

    let xS = [];

    carte = [];
    for (let i=0; i<RES ; i++) {
        for (let j=0; j<RES ; j++) {
            let x = (i*incX + bubbles.min);
            let y = (j*incY+incY/2 + bubbles.min);
            xS.push([(x+incX/2)/wEP, (y+incY/2)/hEP]);
            carte.push({x:x, y:y, c:[120,120,120,120]});
        }
    }
    const tfX = tf.tensor2d(xS);
    const tfY = Array.from(model.predict(tfX).dataSync());
    const newArr = [];
    while(tfY.length) newArr.push(tfY.splice(0,NUM_POPULATION));
    for (let i =0; i<(RES*RES); i++) {
        carte[i].c = couleurs[tf.argMax(newArr[i]).dataSync()[0]].slice();
        carte[i].c[3] = 50;
    }
    loop();
}

function getColor(x,y) {
    let In = [x, y];
    const inTF = tf.tensor2d([In]);
    let Out = model.predict(inTF).dataSync()
    let ret = tf.argMax(Out).dataSync();
    let c=couleurs[ret].slice();
    return c;
}

function forward() {
    if (mouseX>bubbles.min && mouseX<bubbles.max && mouseY>bubbles.min && mouseY<bubbles.max) {
        const c = getColor(mouseX/wEP,mouseY/hEP);
        c[3]=255;
        test.push({x:mouseX, y:mouseY, c:color(c)});
        loop();
        }
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------

    bubbles.show();

    for (let t of test) {
        fill(t.c);noStroke();
        circle(t.x,t.y,5);
    }

    let incX = bubbles.wide/RES; 
    let incY = bubbles.wide/RES;
    for (let c of carte) {
        fill(c.c);
        rect(c.x,c.y,incX,incY);
    }

    if (modelTrain) {
        courbe1 = new Courbe(modelLoss,bubbles.max+10,10,width-bubbles.max-20,height/4);
        courbe1.setTitre('Loss');
        courbe1.setSeuilSup(0.1);
        courbe1.color = color('#00ADB5');
        courbe1.bkColor = color('#393E46');
        courbe1.txtColor = color('#EEEEEE');
        courbe1.show();
        let courbe2 = new Courbe(modelAcc,bubbles.max+10,height/4+30,width-bubbles.max-20,height/4);
        courbe2.setTitre('Accuracy');
        courbe2.setSeuilInf(0.95);
        courbe2.color = color('#00ADB5');
        courbe2.bkColor = color('#393E46');
        courbe2.txtColor = color('#EEEEEE');
        courbe2.show();
    }

    if (modelTrain) {
        tfvis.show.layer(surface, model.getLayer(undefined, 1));    
        tfvis.show.history(surface2, modelHistory, ['loss', 'acc']);
    }
    //----
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    textSize(32);textAlign(LEFT,CENTER);
    // let x = offset+10, y= height-offset-20;
    // fill(255); noStroke();
    // etat = (!DEBUG?'🌐':'')+(FLAT?'⎯':'')+(RAINBOW?'🌈':'')+(btDensite.value?'👨‍👩‍👦‍👦':'');
    // text('⏹️  ▶️',x,y);
    // text(searchInfo,7*width/8-55,3*height/4-7);

    bgRate.anim(deltaTime);
    noLoop();
}