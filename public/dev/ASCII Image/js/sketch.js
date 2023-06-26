const text_convert = "Ñ@#W$9876543210?!abc;:+=-,_     ";
let img;

function preload() {
    img = loadImage("./img/ecureuil2.jpg")
} 
function luminace(r,g,b) {
    return (0.3*r + 0.59*g+ 0.11*b);
}

function setup() {
    canvas = createCanvas(500,500);
    textAlign(CENTER,CENTER);

}

function draw() {
    background(0);
    // image(img,0,0,width,height);

    let w = width / img.width;
    let h = height / img.height;
    textSize(w);
    const len = text_convert.length;
    img.loadPixels();
    for (let j=0; j<height ; j+=1) {
        for (let i=0; i<height ; i+=1) {
            const index = (i + j*img.width) * 4;
            const r = img.pixels[index + 0];
            const g = img.pixels[index + 1];
            const b = img.pixels[index + 2];
            let bg = luminace(r,g,b);
            // let bg = (r+g+b)/3;
            const idxText = floor(map(bg,0,255,len,0));
            const char = (text_convert.charAt(idxText));
            noStroke();
            // fill(bg);
            fill(255);
            // square(w*i, h*j, w);
            text(char,w*(i+0.5), h*(j+0.5));
        }
    }
}