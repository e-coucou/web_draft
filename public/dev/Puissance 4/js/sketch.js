let size_w=7;
let size_h=6;
let grid = [];
let w,h;
let DEBUG = false;
let maxNiv = 6;

let homme = 'O';
let AI = 'X';
let scores = {O:-10, X:10, PAT:2};

let iter, infoScore=[];

function play(i) {
    for(let j=size_h-1; j>=0; --j) {
        if(grid[j][i]==='') {
            return(j);
        }
    }
    return null;
}
function egal(tab) {
    v = tab.length -1;
    switch(v) {
        case 3 :
            [a,b,c,d]= tab;
            return (a==b && a==c && a==d && a!= '');
            break;
        case 2 :
            [a,b,c]= tab;
            return (a==b && a==c && a!= '');
            break;

        }
}
function AIPlay() {
	let Pick, localPick;
	let bestScore = -Infinity;
    infoScore = [];
    iter = 0;
    for (let i=0;i<size_w;i++) {
        let j = play(i);
        let localScore = -100;
        if (DEBUG) console.log(i,j, '-------');
        if ( j != null) {
            grid[j][i] = AI;
            let score = minimax(grid, maxNiv, -Infinity, Infinity, false);
            grid[j][i] = '';
            if (score > bestScore) {
                bestScore = score;
                Pick = {i,j};
            }
            if (score > localScore) {
                localScore = score;
                localPick = {i,j};
            }
            if (DEBUG) console.log(i,j,'---', bestScore, localScore,Pick);
        }
        infoScore.push({s: localScore, p:localPick });
    }
	grid[Pick.j][Pick.i] = AI;
	player = homme;
    console.log(iter, bestScore);
}


function minimax(grid,niv, alpha, beta ,isMax) {
    iter++;
	let res = victoire();
	if (res != null) {
		return scores[res];
	}
    if (niv==0) { 
        res = victoire(2);
        if (res != null) {
            return scores[res]*0.1;
        }
        return 0;
    }

    if (isMax) {
        let maxScore = -Infinity;
        for (let i=0 ; i<size_w; i++) {
            let j = play(i);
            if ( j != null) {
                grid[j][i] = AI;
                let score = minimax(grid, niv-1,alpha, beta, false);
                grid[j][i] = '';
                maxScore = max(score, maxScore);
                alpha = max(score, alpha);
                if (DEBUG) console.log('MAX',score,maxScore,alpha, beta,i,j);
                if (beta <= alpha) { break;}
            }
        }
        return maxScore;// +niv/10;
    } else {
        let minScore = Infinity;
        for (let i=0 ; i<size_w ; i++) {
            let j = play(i);
            if (j != null) {
                grid[j][i] = homme;
                let score = minimax(grid, niv-1, alpha, beta, true);
                grid[j][i] = '';
                minScore = min(minScore, score);
                beta = min (score, beta);
                if (DEBUG) console.log('min',score,minScore,alpha, beta,i,j);
                if (beta <= alpha) { break;}
            }
        }
        return minScore;// - niv/10;
    }
}

function victoire(v=3) {// 4 alignées
    let gagnant = null;
    // les horizontales ...
    for ( let j =0; j < size_h ; j++) {
        for (let i=0; i< size_w-v ; i++) {
            let tab=[];
            for (let k=0; k<=v; k++) {
                tab.push(grid[j][i+k]);
            }
            res = egal(tab);
            if (res) {
                gagnant = grid[j][i];            
            }
        }
    }    
    // les verticales ...
    for ( let i =0; i< size_w ; i++) {
        for (let j=0; j<size_h-v ; j++) {
            let tab=[];
            for (let k=0; k<=v; k++) {
                tab.push(grid[j+k][i]);
            }
            res = egal(tab);
            if (res) {
                gagnant = grid[j][i];  
            }
        }
    }
    // les diagonales
    for ( let i =0; i< size_w-v ; i++) {
        for (let j=0; j<size_h-v ; j++) {
            let tab=[];
            for (let k=0; k<=v; k++) {
                tab.push(grid[j+k][i+k]);
            }
            res = egal(tab);
            if (res) {
                gagnant = grid[j][i]; 
            }
        }
    }
    for ( let i =0; i < size_w-v ; i++) {
        for (let j=size_h-1; j>=v ; --j) {
            let tab=[];
            for (let k=0; k<=v; k++) {
                tab.push(grid[j-k][i+k]);
            }
            res = egal(tab);
            if (res) {
                gagnant = grid[j][i];            
            }
        }
    }
    let options=[];
    for (let o=0; o<size_w;o++) {
        if (play(o) != null ) options.push(o);
    }
    if (gagnant==null && options.length==0) { gagnant = 'PAT';}
    return gagnant;
}

function mousePressed() {
    let i = floor(mouseX / w);
    let j = play(i);
    if (j!=null) {
        grid[j][i] = homme;
    }
    // next();
    AIPlay();
    // let j = floor(mouseY / h);
}

function next() {
    let options=[];
    for (let o=0; o<size_w;o++) {
        if (play(o) != null ) options.push(o);
    }
    let i = (random(options));
    let j = play(i);
    if (j!=null) {
        grid[j][i] = AI;
    }
}

function setup() {
    canvas = createCanvas(700,600);
    canvas.parent("#canvas");
    for (let j=0; j<size_h; j++) {
        let ligne = [];
        for (let i=0; i<size_w; i++) {
            ligne.push('');
        }
        grid.push(ligne);
    }
    w = width / size_w;
    h = height / size_h;
}

function show() {
    fill(0);
    stroke(0);
    strokeWeight(2);
    for (let i=0; i<=size_w ; i++) {
        line(i*w, 0, i*w, height);
        line(0, i*h , width, i*h);
    }
    noStroke();
    for (let j=0; j<size_h; j++) {
        for (let i=0; i<size_w; i++) {
            let r=w/1.5;
            switch (grid[j][i]){
                case 'O': fill(255,0,0);
                    break;
                case 'X': fill(255,255,255);
                    break;
                default: 
                    fill(220,255,220,80);
                    r=w/2;
                    break;
            }
            circle((i+0.5)*w, (j+0.5)*h, r);
        }
    }
    textAlign(CENTER,CENTER);
    textSize(12);
    fill(40,100,10,100);
    // fill(51);
    for (let s=0; s<size_w ; s++) {
        let p = infoScore[s];
        if (p) {
            if (p.p) {
            text(nf(p.s,0,1), (p.p.i+0.5) * w, (p.p.j + 0.5) * h);}
        }
    }
}

function draw() {
    background(200);
    show();
    let g = victoire();
    if (g != null) {
        console.log(g);
        noLoop();
    }
}