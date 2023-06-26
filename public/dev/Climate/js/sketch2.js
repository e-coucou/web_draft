let data;
let mois = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let w = 800, h = 800;
let minus_un = 80,zero=160, plus_un = 240;
let year, m, m_end;
let bleu, rouge, blanc;
let p_val=0;
let Plan;
let rot=0;

function preload() {
    data = loadTable('./data/temperature.csv','csv','header');
}
function setup() {
    canvas = createCanvas(w,h,WEBGL);
    canvas.parent('Climate');

    // textFont(Georgia);
    Plan = createGraphics(w,h);


    console.log(data.getRowCount());
    console.log(data.getColumnCount());
    // console.log(data.getRow('1880'));
    bleu = color(0,0,255);
    rouge = color(255,0,0);
    blanc = color(255);
        year = 0;
    m=0;
    console.log(bleu);
    // ortho(-20, 20, 20, -20, 0, 10);
        // frameRate(10);
        ambientLight(200,200,0);
        directionalLight(255,255,255,0,0,1);
    }

function draw() {
    background(51);
    rotateX(rot);
    noFill();
    stroke(255);
    strokeWeight(1);
    Plan.background(51);
    Plan.textAlign(CENTER,CENTER);
    Plan.textSize(16);
    Plan.stroke(255);
    Plan.noFill();
    Plan.circle(w/2,h/2,minus_un*2);
    Plan.circle(w/2,h/2,plus_un*2);
    Plan.stroke(0,255,0);
    Plan.circle(w/2,h/2,zero*2);
    Plan.fill(255);
    Plan.noStroke();
    Plan.text('-1°',w/2+minus_un+15,h/2);
    Plan.text('+1°',w/2+plus_un+15,h/2);
    Plan.text('0°',w/2+zero+15,h/2);
    Plan.textSize(64);
    let row = data.getRow(year);
    Plan.text(row.get('Year'),w/2,h/2);
    Plan.textSize(26);
    for (let i =0; i<12;i++) {
        let angle = i * PI / 6 - PI/2 +PI/6;
        let x0 = w/2 + (plus_un + 40) * cos(angle);
        let y0 = h/2 + (plus_un + 40) * sin(angle);
        Plan.push();
        Plan.translate(x0,y0);
        Plan.rotate(angle+PI/2);
        Plan.text(mois[i],0,0);
        Plan.pop();
    }
    noFill();
    texture(Plan);
    noStroke();
    push();
    if (year<143) {
        translate(0,0,-144*1.5);
    } else {
        translate(0,0,-144*1.5+rot*300);
    }
    plane(w,h);
    pop();
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
            if (m_end<12) { strokeWeight(5); c=color(255);}
            fill(c);
            stroke(c);
            if (m_end<12) { strokeWeight(5); c=color(255);}
            let r = map(d,0,1,zero,plus_un);
            let r0 = map(p_val,0,1,zero,plus_un);
            let x = 0 + r * cos(angle);
            let y = 0 + r * sin(angle);
            let x0 = 0 + r0 * cos(angle-PI/6);
            let y0 = 0 + r0 * sin(angle-PI/6);
            if ((i+a)>0) {
                line(x0,y0,a*2.5-(144*1.25),x,y,a*2.5-(144*1.25));
            }
            p_val = d;
        }
    }
    m++;
    if (m>12) {
        year++;
        if (year>143) {
            year=143;
            // if (rot<PI/2) { rot += 0.01;}
        }
        m=0;
    }
    if (year>=143) {
        if (rot<PI/2) { rot += 0.002;} else {noLoop();}
    }
    // noLoop();
}