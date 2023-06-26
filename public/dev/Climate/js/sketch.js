let data;
let mois = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let w = 800, h = 800;
let minus_un = 100,zero=200, plus_un = 300;
let year, m, m_end;
let bleu, rouge, blanc;
let p_val=0;

function preload() {
    data = loadTable('./data/temperature.csv','csv','header');
}
function setup() {
    canvas = createCanvas(w,h);
    canvas.parent('Climate');

    console.log(data.getRowCount());
    console.log(data.getColumnCount());
    // console.log(data.getRow('1880'));
    bleu = color(0,0,255);
    rouge = color(255,0,0);
    blanc = color(255);
        year = 0;
    m=0;
    console.log(bleu);
    frameRate(10);
}

function draw() {
    background(51);
    noFill();
    stroke(255);
    strokeWeight(1);
    textAlign(CENTER,CENTER);
    textSize(10);
    circle(w/2,h/2,minus_un*2);
    text('-1°',w/2+minus_un+15,h/2);
    circle(w/2,h/2,plus_un*2);
    text('+1°',w/2+plus_un+15,h/2);
    stroke(0,255,0);
    circle(w/2,h/2,zero*2);
    stroke(255);
    text('0°',w/2+zero+15,h/2);
    textSize(40);
    let row = data.getRow(year);
    text(row.get('Year'),w/2,h/2);
    textSize(20);
    stroke(120);
    for (let i =0; i<12;i++) {
        let angle = i * PI / 6 - PI/2 +PI/6;
        let x0 = w/2 + 350 * cos(angle);
        let y0 = h/2 + 350 * sin(angle);
        push();
        translate(x0,y0);
        rotate(angle+PI/2);
        text(mois[i],0,0);
        pop();
    }
    for (let a=0; a<=year;a++) {
        strokeWeight(1);
        if (a==year) {
            m_end=m;
        } else {
            m_end=12;
        }
        for (let i =0; i<m_end;i++) {
            let angle = i * PI / 6 - PI/2 +PI/6;
    
            let d = parseFloat(data.getString(a,i+1));
            let avg = (d+p_val)*0.5;
            let c;
            if (avg<0) {
                c = lerpColor(blanc,bleu,abs(d));
            } else {
                c = lerpColor(blanc,rouge,d);
            }
            // console.log(d);
            if (m_end<12) { strokeWeight(5); c=color(255);}
            fill(c);
            stroke(c);
            if (m_end<12) { strokeWeight(5); c=color(255);}
            let r = map(d,0,1,zero,plus_un);
            let r0 = map(p_val,0,1,zero,plus_un);
            let x = w/2 + r * cos(angle);
            let y = h/2 + r * sin(angle);
            let x0 = w/2 + r0 * cos(angle-PI/6);
            let y0 = w/2 + r0 * sin(angle-PI/6);
            if ((i+a)>0) {
                line(x0,y0,x,y);
            }
                // circle(x,y,3);
            // console.log(typeof (data.getString(1,i)));
            p_val = d;
        }
    }
    m++;
    if (m>12) {
        year++;
        if (year>143) {
            year=143;
        }
        m=0;
    }
    // noLoop();
}