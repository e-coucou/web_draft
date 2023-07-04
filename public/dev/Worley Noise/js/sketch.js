let d;
let img;
let points=[];
let DIM =5;


function setup() {
    canvas = createCanvas(400,400);
    canvas.parent("#canvas");
    d = pixelDensity();
    console.log('Densité : ',d);
    img = createImage(width,height);
    initPoints(DIM);
}

function initPoints(n) {
    points = [];
    for (let i=0; i<n ; i++) {
        let x = floor(random(width));
        let y = floor(random(height));
        let z = floor(random(width));
        points.push(createVector(x,y,z));
    }
}

function draw() {
    background(255);
    image(img,0,0,width,height);

    loadPixels();
    for (let x=0; x<width; x++) {
        for (let y=0; y< height; y++) {
            let distances = [];
            let z= (frameCount % width);
            for (let p of points) {
                let dst = dist(x,y,z,p.x,p.y,p.z);
                distances.push(dst);
            }
            let tri = sort(distances);
            let n = 0;
            let noise = tri[n];
            r = (floor(map(tri[0], 0, width/4, 0, 155)));
            g = (floor(map(tri[1], 0, width/4, 0, 155)));
            b = (floor(map(tri[2], 0, width/4, 0, 155)));
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                  // loop over
                    let id = 4 * ((y * d + j) * width * d + (x * d + i));
                    // let id = 4 * (x + y * width);
                    pixels[id] = r;
                    pixels[id+1] = g;
                    pixels[id+2] = b;
                    pixels[id+3] = 255;
                }
            }
        }
    }
    updatePixels();

    // stroke(0,255,255);
    // strokeWeight(8);
    // for (let p of points) {
    //     point(p.x,p.y);
    //     p.x += random(-2,2);
    //     p.y += random(-2,2);
    // }

    // noLoop();
}