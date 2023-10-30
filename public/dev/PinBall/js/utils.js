let sim = 20;
let scale,simW, simH;

function initSim() {
    scale = width / sim;
    simW = width / scale;
    simH = height / scale;
}
function cX(x) {
    return x * scale;
}
function cY(y) {
    return (simH - y)*scale;
}

function invX(x) {
    return x / scale;
}
function invY(y) {
    return simH - y / scale;
}