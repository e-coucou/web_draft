let img;
let shape = [];
let sequence = [];
let cols=4, rows=4;

let w,h;
let fw,fh;

function preload() {
    img = loadImage("./photos/P1001095.png");
}

function swap(i,j,arr) {
    [arr[i],arr[j]] = [arr[j], arr[i]];
}

function melange(arr) {
    for (let i=0; i<1000; i+=1) {
        let r1 = floor(random(0,cols));
        let r2 = floor(random(0,rows));
        move(r1,r2,arr);
    }
}

function findBlanc(arr) {
    for (let i=0; i<arr.length; i+=1) {
        if (arr[i] == -1) { return i; }
    }
}

function isVoisin(i,j,x,y) {
    if (x!=i && y!=j) {
        return false;
    }
    if (abs(i-x) == 1 || abs(j-y) == 1) {
        return true;
    }
    return false;
}

function move(i, j , arr) {
    let b = findBlanc(arr);
    let bRow = floor(b/rows);
    let bCol = b % cols;

    if (isVoisin(i,j,bCol,bRow)) {
        // console.log("yes");
        // console.log(i,j,bCol,bRow,b,i+j*cols);
        swap(b,i+j*cols,arr);
    }
}

function mousePressed() {
    let i = floor(mouseX / fw);
    let j = floor(mouseY / fh);
    move(i,j,sequence);
}


function setup() {
    canvas = createCanvas(400,400);
    w = img.width / cols;
    h = img.height / rows;
    fw = width/cols;
    fh = height/rows;

    for (let j=0; j<rows; j+=1) {
        for (let i=0; i<cols; i+=1) {
            let x = i * w;
            let y = j * h;
            let im = createImage(w, h);
            im.copy(img,x,y,w,h,0,0,w,h);
            shape.push(im);
            sequence.push(i+j*cols);
        }
    }
    sequence[cols*rows-1] = -1;
    melange(sequence);
}

function isOk() {
    for (let i=0; i<sequence.length-1; i+=1) {
        if (i!=sequence[i]) {
            return false;
        }
    }
    return true;
}

function draw() {

    // image(img, 0, 0, width, height);
    background(0);
    let i=0;
    for (let n of sequence) {
        // console.log(n);
        let x = (i % cols) * fw;
        let y = floor(i/rows) * fh;
        stroke(51);
        strokeWeight(2);
        noFill();
        rect(x,y,fw,fh);
        if (n != -1) {
            image(shape[n],x,y,fw,fh);
        }
        i += 1;
    }
    if (isOk()) {
        console.log('RESOLU');
        createDiv("RESOLU");
        noLoop();  
    }
}