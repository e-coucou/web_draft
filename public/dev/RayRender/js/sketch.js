const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true;

let viewH, viewW;
let focal = 1.0;
let camera, view_u, view_v, pixel_u, pixel_v, view_HG, pixel00;



function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = 400;
    let h_ = w_ * 9.0 / 16.0;
    resizeCanvas(w_,h_,WEBGL);
}

function main() {
    viewH = 2.0;
    viewW = viewH * width/height;

    focal = 1.0;
    camera = new Vector(0,0,0);
    view_u = new Vector(viewW,0,0); // horizontal
    view_v = new Vector(0,-viewH,0); // vertival
    pixel_u = Vector.mult(view_u,1/width);
    pixel_v = Vector.mult(view_v,1/height);

    view_HG = Vector.sub( camera, new Vector(0,0,focal)).sub(Vector.mult(view_u,0.5) ).sub(Vector.mult(view_v,0.5));
    pixel00 = Vector.add(pixel_u,pixel_v).mult(0.5);
    pixel00.add(view_HG);

    render();
}

function keyPressed() {
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}

function mousePressed() {
}

function render1() {
    for (let i=0; i<width;i++) {
        for (let j=0;j<height;j++) {
            let v = new Vector(i / (width-1), j / (height-1), 0);
            let c = color(v.x()*256,v.y()*256,v.z()*256);
            stroke(c);
            point(i,j);
        }
    }
}
function ray_color(r) {
    let t = (hitSphere(new Vector(0,0,-1),0.5,r))
    if (t>0) {
        let N = Vector.norm(r.at(t).sub(new Vector(0,0,-1)));
        return (new Vector(N.x()+1, N.y()+1, N.z()+1).mult(0.5))
        // console.log('coucou')
        // return (new Vector(1,0,0));
    }
    let dirNorm = Vector.norm(r.dir);
    let a = 0.5*(dirNorm.y()+1); //console.log(a)
    let c1 = new Vector(1.0,1.0,1.0);
    let c2 = new Vector(0.5,0.7,1.0);
    return Vector.add(c1.mult((1-a)), c2.mult(a));
}
function render() {
    for (let i=-width/2; i<width/2;i++) {
        for (let j=-height/2;j<height/2;j++) {
            let tmp1 = Vector.add( Vector.mult(pixel_u,i+width/2) , Vector.mult(pixel_v,j+height/2) );
            let O = tmp1.add(pixel00);
            let d = Vector.sub(O,camera);
            let r = new Ray(O,d);
            let c = ray_color(r);
            stroke(color(c.x()*255.999, c.y()*255.999,c.z()*255.999));
            point(i,j);
        }
    }
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10,WEBGL); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    main();
}

// function draw() {
//     background(51);
// }