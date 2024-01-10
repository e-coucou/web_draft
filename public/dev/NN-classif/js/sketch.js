const eC = {version: 'v0.01', release:'r1', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;
let wEP,hEP;
const pEP = 50;

const cVert = [10,200,150];
const offset = 5;
let bgRate;

let startTime, endTime;

let bubbles, NN, a, b, test=[];

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
    bubbles = new Bubble(2,100,10,hEP);
    // NN = new NeuralNetwork(2,7,1);
    // for (let j=0;j<5000;j++) {
    //     let i = int(Math.random()*bubbles.bubble.length); // console.log(i)
    //     // for (let i=0;i<a.length;i++) {
    //     let v = NN.train_EP(bubbles.bubble[i].in,bubbles.bubble[i].out);
    //     // console.log(v,NN.log_Error(v,bubbles.bubble[i].out[0]));
    //     // }
    // }
    test = [];

    initTF();
}

async function train(i,o) {
    const xS = tf.tensor2d(i);
    const yS = tf.tensor2d(o);
    return await model.fit(xS, yS, {epochs: 100, shuffle: true});
}

function initTF() {
    model = tf.sequential();
    model.add(tf.layers.dense({ units: 3, inputShape:[2], activation: 'sigmoid'}));
    model.add(tf.layers.dense({ units: 5, activation: 'sigmoid'}));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid'}));
    const optimiser = tf.train.sgd(0.1);
    model.compile({loss: 'meanSquaredError', optimizer: optimiser});

    let [inputs,outputs] = bubbles.convert();
    console.log(inputs)

    // for (let i=0; i<10; i++) {
        train(inputs, outputs).then( (ret) => { console.log(ret.history)} );
    // }
}

function forward() {
    let In = [[mouseX, mouseY]];
    const inTF = tf.tensor2d(In);
    let Out = model.predict(inTF).dataSync()[0]
    // let Out = NN.feedforward_EP(In); console.log(Out)
    // let ret = Out.matrix[0][0]>0.5;
    let ret = Out > 0.5;
    let c=couleurs[0];
    if (ret) {
        c = couleurs[1];
    }
    test.push({x:mouseX, y:mouseY, c:color(c), r: Out});
    loop();
    // console.log(ret,Out.matrix);
}
function rankings(arr){
  // add whatever parameters you deem necessary....good luck! 
  var sorted = arr.slice().sort(function(a,b){return b-a})
  var ranks = arr.slice().map(function(v){ return sorted.indexOf(v) + 1 });
  console.log(ranks[0],sorted,ranks)
  return ranks;
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------

    bubbles.show();
    // NN.render();

    for (let t of test) {
        fill(t.c);noStroke();
        circle(t.x,t.y,5);
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