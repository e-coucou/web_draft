p5.disableFriendlyErrors = true;

let video;
let pScale = 1;

let scale =10;
let symbols = []; // je génère les lignes verticales mais je ne garde pas la structure juste 
let symbolSize = scale;
let supp_limite = 1;

function setup () {
	createCanvas(600,600);
	pixelDensity(1);
	video = createCapture(VIDEO);
	video.size(width/pScale, height/pScale);
  video.hide();

  let x;
  for (let i = 0; i<width/scale;i++) {
    let streamSize = random(10,30);
    let x = i*scale;
    let y = random(-100,0);
    let speed = random(3,10);
    let first = (round(random(0,4)) == 1);
    for (let n=0;n<streamSize;n++) {
      symbol=new Car(x,y,speed,first);
      symbol.setCar();
      symbols.push(symbol);
      y -= symbolSize;
      first=false;
    }
  }
  textSize(symbolSize);
}

function draw() {
	background(0,230);
	video.loadPixels();
//	image(video,0,0,width,height);

// // Bullage
//   const stepSize = round(constrain(mouseX / 8, 2, 32));
//   for (let y = 0; y < height; y += stepSize) {
//     for (let x = 0; x < width; x += stepSize) {
//       const i = y * width + x;
//       const darkness = (255 - video.pixels[i * 4]) / 255;
//       const radius = stepSize * darkness;
//       ellipse(x, y, radius, radius);
//     }
//   }

// Video Matrix

//	video.updatePixels();
  symbols.forEach((symbol) => {

    if (symbol.y <0 || symbol.y>height) {

    } else {
      // let index = (symbol.x + 4 *symbol.y) * scale;
      let index = (video.width - Math.ceil(symbol.x) + 1 + (Math.ceil(symbol.y) * video.width)) * 4;
      let r,g,b;
      r = video.pixels[index++];
      g = video.pixels[index++];
      b = video.pixels[index++];
      let bright = (r+g+b)/3;
      let gBright = map(g,0,255,100,255);

      if (!r || !g || !b) {
        fill(50,50,50);
      } else {
       fill(100,g,100,gBright);
      }
      symbol.render();
      // text(symbol.value,symbol.x,symbol.y);
    }
    symbol.rain();
    symbol.setCar();
  });
}


//-----------------
// LA MATRIX
//-
function Car(x,y,speed,first) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.value;
  this.first = first;
  this.change = round(random(2,20));

  this.setCar = function() {
    if(frameCount % this.change == 0) {
      this.value = String.fromCharCode(0x30A0 + round(random(0,96)));
    }
  }

  this.rain = function() {
    this.y = this.y >= (height/supp_limite) ? 0 :  this.y+this.speed;
  }
  this.render = function(symbol) {
      text(this.value,this.x,this.y);
  }
}

function Stream() {
  this.symbols = [];
  this.nbsymbols = round(random(5,50));
  this.speed = random(3,10);

  this.genCar = function(x,y) {
    let first = (round(random(0,4)) == 1);
    for(let i=0;i<this.nbsymbols;i++){
      symbol=new Car(x,y,this.speed,first);
      symbol.setCar();
      this.symbols.push(symbol);
      y -= symbolSize;
      first=false;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(180,255,180);
      } else {
        fill(0,255,70,random(50,200));
      }
      text(symbol.value,symbol.x,symbol.y);
      symbol.rain();
      symbol.setCar();
    } );
  }
}