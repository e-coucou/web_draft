const eC = {version: 'v0.01', release:'r1', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;
let wEP,hEP;
const pEP = 50;
const RES=100;

// import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';


const cVert = [10,200,150];
const offset = 5;
let bgRate;

let startTime, endTime;

let bubbles, NN, a, b, test=[], carte= [], carteNN = [];

let model;

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
    bubbles = new Bubble(3,50,10,hEP);
    NN = new NeuralNetwork(2,8,3);
    for (let j=0;j<1000;j++) {
        let i = int(Math.random()*bubbles.bubble.length); // console.log(i)
        // for (let i=0;i<a.length;i++) {
        let v = NN.train_EP(bubbles.bubble[i].in,bubbles.bubble[i].out);
        // console.log(v,NN.log_Error(v,bubbles.bubble[i].out[0]));
        // }
    }
    test = [];

    initTF();
}

async function train(i,o) {
    const xS = tf.tensor2d(i);
    const yS = tf.tensor2d(o);
    return await model.fit(xS, yS, {epochs: 50, shuffle: true});
}

function initTF() {
    model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape:[2], activation: 'sigmoid'}));
    model.add(tf.layers.dense({ units: 48, activation: 'relu'}));
    // model.add(tf.layers.dense({ units: 8, activation: 'sigmoid'}));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax'}));
    const optimiser = tf.train.adam(0.01);
    model.compile({loss: 'categoricalCrossentropy', optimizer: optimiser, metrics: ['accuracy']});

    let [inputs,outputs] = bubbles.convert();
    console.log(inputs)

    // for (let i=0; i<10; i++) {
        train(inputs, outputs).then( (ret) => { console.log(ret.history)} );
    // }
}

function colorieNN() {
    let incX = wEP/RES; 
    let incY = hEP/RES;

    carteNN = [];
    for (let i=0; i<RES ; i++) {
        for (let j=0; j<RES ; j++) {
            let x = (i*incX);
            let y = (j*incY+incY/2);
            let [c,cNN] = getColor((x+incX/2)/wEP, (y+incY/2)/hEP);
            cNN[3]=50;
            carteNN.push({x:x, y:y, c:cNN});
        }
    }
    loop();
}

function colorie() {
    let incX = wEP/RES; 
    let incY = hEP/RES;

    let xS = [];

    carte = [];
    for (let i=0; i<RES ; i++) {
        for (let j=0; j<RES ; j++) {
            let x = (i*incX);
            let y = (j*incY+incY/2);
            xS.push([(x+incX/2)/wEP, (y+incY/2)/hEP]);
            carte.push({x:x, y:y, c:[120,120,120,120]});
        }
    }
    const tfX = tf.tensor2d(xS);
    const tfY = Array.from(model.predict(tfX).dataSync());
    const newArr = [];
    while(tfY.length) newArr.push(tfY.splice(0,3));
    for (let i =0; i<(RES*RES); i++) {
        // console.log(newArr[i])
        // console.log(tf.argMax(newArr[i]).dataSync()[0])
        carte[i].c = couleurs[tf.argMax(newArr[i]).dataSync()[0]].slice();
        carte[i].c[3] = 50;
    }
    loop();
}

function getColor(x,y) {
    let In = [x, y];
    const inTF = tf.tensor2d([In]);
    let Out = model.predict(inTF).dataSync()
    let OutNN = NN.feedforward_EP(In);
    // let ret = Out.matrix[0][0]>0.5;
    let ret = tf.argMax(Out).dataSync();
    let retNN = tf.argMax(OutNN.matrix).dataSync();
    let c=couleurs[ret].slice();
    let cNN=couleurs[ret].slice();
    return [c,cNN];
}
function forward() {
    const [c,cNN] = getColor(mouseX/wEP,mouseY/hEP);
    c[3]=255;
    test.push({x:mouseX, y:mouseY, c:color(c)});
    loop();
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------

    bubbles.show();
    NN.render();

    for (let t of test) {
        fill(t.c);noStroke();
        circle(t.x,t.y,5);
    }

    let incX = wEP/RES; 
    let incY = hEP/RES;
    for (let c of carte) {
        fill(c.c);
        rect(c.x,c.y,incX,incY);
    }
    for (let c of carteNN) {
        fill(c.c);
        rect(c.x,c.y,incX,incY);
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