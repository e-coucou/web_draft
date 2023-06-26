let H = [1,-1,1,1];
let H0 = H.slice();
let m = 2;


function setup() {
    canvas = createCanvas(700, 700);
}

function mousePressed() {
    H=nextH();
}
function nextH() {
    let nb = H.length;
    let Hn = [];
    for(let b=0; b<2 ; b++) {
        for (let j=0; j<m ; j++) {
            for (let a=0; a<2;a++) {
                for (let i=0; i<m ; i++) {
                    let idx = j*m+ i;
                    Hn.push(H0[a+b*2] * H[idx]);
                }
            }
        }
    }
    return Hn;
}

function draw() {
    background(255);
    let nb = H.length;
    m = Math.sqrt(nb);
    let wh = width / m;
    stroke(120);
    for (let i=0; i<nb ; i++) {
        let c = color(0);
        if (H[i] === -1) {c = color(255);}
        let x = (i % m) * wh;
        let y = Math.floor(i / m) * wh;
        fill(c);
        rect(x,y,wh,wh);
    }
}