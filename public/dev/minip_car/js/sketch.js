const eC = {version: 'v1.0', release:'r0', date:'dec/24', owner: 'rky', code:'y2I', annee:'2024', maj:'dec/24'};
let mobile,vx,cr;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

let phareAvant, phareArriere,Direction,Vitesse;
let url = 'http://192.168.1.67/ep?cmd=';
let toto;
let phares, feux, vit, dir;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

// function preload() {
//     // voir getdata.js pour les preloads
//     // dataJson = loadJSON('./data/dataEP.json');
//     // img = loadImage('./img/joconde.jpg');
//     fCSV = loadTable('./data/programme.csv','csv');
// }

function windowResized() {
    resizeCanvas(innerWidth-30,innerHeight-30);
    phares.setPos(100,height*0.3,60,20);
    feux.setPos(100,height*0.4,60,20);
    vit.setPos(width/2+width/4,20,width/4,height-40);
    dir.setPos(width/8,height/2,width/2-width/6,height/2-40);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(1,1); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    // rate = select("#rate");
    vx=select("#vx"); vx.html('⌖ '+eC.version+' '+eC.release+' >'+eC.maj+'<');
    cr=select("#cr"); cr.html('(ツ) © eCoucou '+eC.annee);

    phares = new Switch(110,height*0.27,60,20,false,'Phares');
    feux = new Switch(110,height*0.43,60,20,false,'Feux');
    vit = new Slider(width/2,20,width/2,height-40,true);
    dir = new Slider(width/8,height/2,width/2-width/6,height/2-40, false);
    windowResized();

    // phareArr(); phareAv();direction();
}

function phareAv() {
    sendCmd("avant",phareAvant.value());
}
function phareArr() {
    sendCmd("arriere",phareArriere.value());
}
function direction() {
    sendCmd("dir",Direction.value());
}

function sendCmd(cmd, val) {
    urlCMD = url+cmd+"&value="+val;
    httpGet(urlCMD, function(response) {
        toto = response;
    });
}

function mouse_(x,y) {
    if (phares.onSwitch(x,y)) {
        phares.flipflop();
        sendCmd("avant",phares.state*100)
    }
    if (feux.onSwitch(x,y)) {
        feux.flipflop();
        sendCmd("arriere",feux.state*100)
    }
}
function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    // console.log(fs);
    // if (!fs) { fullscreen(true);}
    mouse_(touches[0].x, touches[0].y);
}

// function mousePressed() {
//     mouse_();
// }
function mouseClicked() {
    mouse_(mouseX,mouseY);
}

function draw() {
    // background(0);

    textAlign(LEFT,CENTER);
    noStroke();fill(255);textSize(width*0.05)
    text("MiniP's car",width/12,height/10);

    phares.show();
    feux.show();
    vit.onSlider(mouseX,mouseY);
    if (vit.updt) { 
        sendCmd("speed",int(vit.val*2-100));
        vit.reset();
    }
    vit.show();
    dir.onSlider(mouseX,mouseY);
    if (dir.updt) { 
        sendCmd("dir",int(dir.val*2-100));
        dir.reset();
    }
    dir.show();

    // textAlign(CENTER,CENTER);
    // textSize(8); fill("#FFF");noStroke();
    // text('(ツ) © eCoucou '+eC.annee, width-40, height-6);

// noLoop();
}

//------------------------------------------------------------

class Switch {
    constructor(x,y,w,h,t=false,name='switch') {
        this.x = x;
        this.y = y;
        this.w = h*2;
        this.h = h;
        this.state = t;
        this.name = name;
    }

    setPos(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = h*2;
        this.h = h;
    }

    flipflop() {
        this.state = !(this.state);
    }

    onSwitch(x,y) {
        if (x>(this.x-this.h) && x<(this.x+this.h) && y>(this.y-this.h/2) && y<(this.y+this.h/2)) {
            return true;
        }
        return false;
    }

    show() {
        ellipseMode(CENTER);
        rectMode(CENTER);
        let offset = this.h/2;;
        if (this.state) {
            fill(40,200,60);
            rect(this.x,this.y,this.w,this.h,this.h);
            fill(255);
            circle(this.x+offset,this.y,this.h-2);
        } else {
            offset *= -1;;
            fill(100,80,80);
            rect(this.x,this.y,this.w,this.h,this.h);
            fill(255);
            circle(this.x+offset,this.y,this.h-2);
        }
        textAlign(LEFT,CENTER),
        textSize(width*0.03);
        noStroke();fill(255);
        text(this.name,this.x+this.w+5,this.y);

    }
}

class Slider {
    constructor(x,y,w,h,t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.in = false;
        this.pos = createVector(x+w/2,y+h/2);
        this.t = t; //vertical
        this.val = 50.;
        this.reset();
        this.c=createVector(this.x+this.h+this.w/2,this.y+this.h/2);
        if (!t) {
            this.c=createVector(this.x+this.w/2,this.y+this.w+this.h/2);
        }
    }

    setPos(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.pos = createVector(x+w/2,y+h/2);
        this.c=createVector(this.x+this.h+this.w/2,this.y+this.h/2);
        if (!this.t) {
            this.c=createVector(this.x+this.w/2,this.y+this.w+this.h/2);
        }
    }

    reset() {
        this.updt = false;
    }

    onSlider(x,y) {
        this.in = false;
        this.reset();
        if (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h) {
            this.in = true;
            this.updt=true;
            if (this.t) {
                let v = (y - this.y)/this.h*100.;
                v = round(v/10.)/10.;
                this.val = v * 100.;
                this.pos.y = this.y + v * this.h;
                let xp = this.c.x-sqrt(this.h*this.h-pow((0.5-v)*this.h,2));
                this.pos.x = xp;
//                this.pos.x = this.x + this.w/2;
            } else {
                this.pos.y = this.y + this.h/2;
                let v = (x - this.x)/this.w*100.;
                v = round(v/10.)/10.;
                this.val = v * 100.;
                this.pos.x = this.x + v * this.w;
                this.pos.y  = this.c.y-sqrt(this.w*this.w-pow((0.5-v)*this.w,2));
//                this.pos.y = this.y + this.h/2;
            }
        }
    }

    show() {
        rectMode(CORNER);
        noFill();
        stroke(200,20);strokeWeight(0.23*height);
        // rect(this.x,this.y,this.w,this.h);
        if (this.t) {
            circle(this.c.x,this.c.y,this.h*2);
            strokeWeight(1);stroke(220,30);
            circle(this.c.x,this.c.y,this.h*2);
        } else {
            circle(this.c.x,this.c.y,this.w*2);
            strokeWeight(1);stroke(220,30);
            circle(this.c.x,this.c.y,this.w*2);
        }
        fill(30,200,120);
        noStroke();
        if (this.in) {
            strokeWeight(4);
            stroke(30,150,100);
        } else { noStroke();}
        circle(this.pos.x,this.pos.y,0.2*height);
    }
}