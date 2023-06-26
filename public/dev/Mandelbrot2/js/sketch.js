const ITER = 255;
let z = {
    r: 0,
    i: 0
};
let c = {
    r: 0,
    i: 0
};
let histo = [];
let inc = 1;

function f(r_, i_, c_) {
    let re = r_ * r_ - i_ * i_;
    let im = 2 * r_ * i_;
    re += c_.r;
    im += c_.i;
    return {
        r: re,
        i: im
    }
}

function keyPressed() {
    if (key === 'p') {
        inc += 1;
    } else if (key === 'm') {
        inc -= 1;
    } else if (key === 'f') {
        for (x = 0; x < width; x = x + inc) {
            for (y = 0; y < height; y = y + inc) {
                let re = map(x, 0, width, -3, 1);
                let im = map(y, 0, height, -2, 2);
                z.r = 0;
                z.i = 0;
                c.r = re;
                c.i = im;
                let n = 0;
                while (n < ITER) {
                    z = f(z.r, z.i, c);
                    if (abs(z.r + z.i) > 10) {
                        break;
                    }
                    n++;
                }
                coul = map(n, 0, ITER, 0, 1);
                coul = map(pow(coul, 1 / 8), 0, 1, 0, 100);
                fill(100 - coul, 0, 0);
                noStroke();
                circle(x, y, 1);
            }
        }
    }
}

function mousePressed() {
    let re = map(mouseX, 0, width, -3, 1);
    let im = map(mouseY, 0, height, -2, 2);
    z.r = 0;
    z.i = 0;
    c.r = re;
    c.i = im;
    update();
}

function update() {
    background(0);
    for (p of histo) {
        let x = map(p.c.r, -3, 1, 0, width)
        let y = map(p.c.i, -2, 2, 0, height)
        fill(p.a, 100, 0);
        noStroke();
        circle(x, y, 5);
    }
    noFill();
    stroke(10, 0, 150);
    circle(3 * width / 4, height / 2, width / 2);
    let n = 0;
    while (n < ITER) {
        let x = map(z.r, -3, 1, 0, width)
        let y = map(z.i, -2, 2, 0, height)
        fill(100);
        noStroke();
        circle(x, y, 4);
        z = f(z.r, z.i, c);
        let x1 = map(z.r, -3, 1, 0, width)
        let y1 = map(z.i, -2, 2, 0, height)
        stroke(150);
        strokeWeight(2);
        line(x, y, x1, y1);
        if (abs(z.r + z.i) > 100) {
            break;
        }
        n++;
    }
    coul = map(n, 0, ITER, 0, 100);
    histo.push({
        'c': {
            r: c.r,
            i: c.i
        },
        'a': coul
    });
}

function setup() {
    canvas = createCanvas(800, 800);
    colorMode(RGB, 100);
    background(0);
}

function draw() {

}