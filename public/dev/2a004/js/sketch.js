let canvas;
let dim = 4;
let cols, rows;
let grid = [],
    next = [];
let shape = [];
let canon = [];
let genAuto = false;
let nbCells;

function preload() {
    canon = loadJSON('canon.json');
}

function addShape(_o, sh) {
    console.log(sh);
    for (var i in sh) {
        let p = sh[i];
        let id = _o + p.c + p.r * cols;
        grid[id] = 1;
    }
}

function init_grid(c, r) {
    let g = [];
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < r; j++) {
            let id = i + j * c;
            g[id] = 0;
        }
    }
    return g;
}

function xy2id(_x, _y) {
    let c = floor(_x / dim);
    let r = floor(_y / dim)
    let id = c + r * cols;
    console.log(id);
    shape.push({
        c: c,
        r: r
    })
    return id;
}

function mousePressed() {
    grid[xy2id(mouseX, mouseY)] = 1;
}

function keyPressed() {
    if (key === ' ') {
        saveJSON(shape, 'canon.json');
    } else if (key == 'l') {
        addShape(0, canon);
    } else if (key == 'n') {
        nextGen();
    } else if (key == 'a') {
        nextAuto();
    }
}

function nextAuto() {
    genAuto = !genAuto;
    console.log(genAuto);
}

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('sketch-XXX');
    colorMode(HSB);
    cols = width / dim;
    rows = height / dim;
    nbCells = cols * rows;
    grid = init_grid(cols, rows);
}

function nextGen() {
    next = [];
    for (let id = 0; id < nbCells; id++) {
        let v = nbV(id);
        // let v = nbVoisin(i, j);
        next[id] = 0;
        switch (v) {
            case 0, 1, 4, 5, 6, 7, 8:
                next[id] = 0;
                break;
            case 2:
                next[id] = grid[id];
                break;
            case 3:
                next[id] = 1;
        }
    }
    grid = next;
}

function nbV(_id) {
    let nb = 0;
    for (let j = -cols; j < cols + 1; j += cols) {
        for (let i = -1; i < 2; i++) {
            const id = _id + j + i;
            // if (id >= 0 && id < grid.length) {
            nb = nb + grid[id] || 0;
            // }
        }
    }
    return nb - grid[_id];
}

function nbVoisin(c, r) {
    let nb = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const id = c + i + (r + j) * cols;
            if (id >= 0 && id < grid.length) {
                nb += grid[id];
            }
        }
    }
    return nb - grid[c + r * cols];
}

function draw() {
    background(0);
    if (genAuto) nextGen();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const id = i + j * cols;
            if (grid[id]) {
                fill(255);
            } else {
                fill(31)
            }
            rect(i * dim, j * dim, 2 * dim);
        }
    }

}