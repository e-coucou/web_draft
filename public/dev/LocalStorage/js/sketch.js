let r,g,b;
let rSlider, gSlider,bSlider;

function setup() {
    canvas =createCanvas(400,400);
    rSlider = createSlider(0,255,0);
    gSlider = createSlider(0,255,0);
    bSlider = createSlider(0,255,0);

    rSlider.changed(changeC);
    gSlider.changed(changeC);
    bSlider.changed(changeC);
}

function changeC() {
    r=rSlider.value();
    g=gSlider.value();
    b=bSlider.value();
}

function draw() {
    background(r,g,b);
}