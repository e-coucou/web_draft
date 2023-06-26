let N = 256;
let iter = 4;
const SCALE = 2;


function IX(x,y) {
	x = constrain(x,0,N-1);
	y = constrain(y,0,N-1);
	return (x + y*N);
}

function makeArray(n) {
	let mat= new Array(n);
	for(let i=0; i<n;i++) {
		mat[i]=0.0;
	}
	return mat;
}

class Fluid {

    size;
    dt;
    diff;
    visc;
    
    s= [];
    density=[];
    
    Vx=[];
    Vy=[];

    Vx0=[];
    Vy0=[];

    constructor(dt,diffusion,viscosity) {

    this.size = N;
    this.dt = dt;
    this.diff = diffusion;
    this.visc = viscosity;
    
    this.s = makeArray(N*N);
    this.density = makeArray(N * N);
    
    this.Vx = makeArray(N * N );
    this.Vy = makeArray(N * N );
    
    this.Vx0 = makeArray(N * N );
    this.Vy0 = makeArray(N * N );
    
	}

	addDensity(x,y,amount) {
		let index = IX(x,y);
    	this.density[index] += amount;
	}

	addVelocity(x,y,amountX,amountY){
		let index = IX(x, y);
    	this.Vx[index] += amountX;
    	this.Vy[index] += amountY;
	}

	step() {
		let N = this.size;
		let visc     = this.visc;
		let diff     = this.diff;
		let dt       = this.dt;
		let Vx      = this.Vx;
		let Vy      = this.Vy;
		let Vx0     = this.Vx0;
		let Vy0     = this.Vy0;
		let s       = this.s;
		let density = this.density;

		diffuse(1, Vx0, Vx, visc, dt);
		diffuse(2, Vy0, Vy, visc, dt);

		project(Vx0, Vy0, Vx, Vy);

		advect(1, Vx, Vx0, Vx0, Vy0, dt);
		advect(2, Vy, Vy0, Vx0, Vy0, dt);

		project(Vx, Vy, Vx0, Vy0);

		diffuse(0, s, density, diff, dt);
		advect(0, density, s, Vx, Vy, dt);
	}

	renderD() {
		for(let i =0 ; i < N  ;i++) {
			for(let j=0 ; j < N ; j++) {
				let x = i * SCALE;
				let y = j * SCALE;
				let d = this.density[IX(i,j)];
				d = constrain(d-0.2,0,255);
				fill(d);
				noStroke();
				square(x, y, SCALE);
			}
		}
	}

}

function diffuse(b, x, x0, diff, dt) {
    let  a = dt * diff * (N - 2) * (N - 2);
  	lin_solve(b, x, x0, a, 1 + 6 * a);
}

function lin_solve( b,x,x0,  a,  c ) {
    let cRecip = 1.0 / c;
    for (let t = 0; t < iter; t++) {
    	for (let j = 1; j < N - 1; j++) {
    		for (let i = 1; i < N - 1; i++) {
    			x[IX(i, j)] =
    			(x0[IX(i, j)]
    				+ a*(    x[IX(i+1, j )]
    					+x[IX(i-1, j )]
    					+x[IX(i  , j+1)]
    					+x[IX(i  , j-1)]
    					)) * cRecip;
    		}
    	}
    	set_bnd(b, x);
    }
}

function project( velocX, velocY, p, div) {
        for (let j = 1; j < N - 1; j++) {
            for (let i = 1; i < N - 1; i++) {
                div[IX(i, j)] = -0.5 *(
                         velocX[IX(i+1, j  )]
                        -velocX[IX(i-1, j  )]
                        +velocY[IX(i  , j+1 )]
                        -velocY[IX(i  , j-1  )]
                    )/N;
                p[IX(i, j)] = 0;
            }
        }
    set_bnd(0, div); 
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 6);
    
        for (let j = 1; j < N - 1; j++) {
            for (let i = 1; i < N - 1; i++) {
                velocX[IX(i, j)] -= 0.5 * (  p[IX(i+1, j)]
                                                -p[IX(i-1, j)]) * N;
                velocY[IX(i, j)] -= 0.5 * (  p[IX(i, j+1)]
                                                -p[IX(i, j-1)]) * N;
            }
        }
    set_bnd(1, velocX);
    set_bnd(2, velocY);
}

function advect(b, d, d0,  velocX, velocY, dt)
{
   	let i0, i1, j0, j1;
    
    let dtx = dt * (N - 2);
    let dty = dt * (N - 2);
    
    let s0, s1, t0, t1;
    let tmp1, tmp2, x, y;
    
    let Nfloat = N;
    let ifloat, jfloat;
    let i, j;
    
    for(let j = 1, jfloat = 1; j < N - 1; j++, jfloat++) { 
    	for(let i = 1, ifloat = 1; i < N - 1; i++, ifloat++) {
    		tmp1 = dtx * velocX[IX(i, j)];
    		tmp2 = dty * velocY[IX(i, j)];
    		x    = ifloat - tmp1; 
    		y    = jfloat - tmp2;

    		if(x < 0.5) x = 0.5; 
    		if(x > Nfloat + 0.5) x = Nfloat + 0.5; 
    		i0 = floor(x); 
    		i1 = i0 + 1.0;
    		if(y < 0.5) y = 0.5; 
    		if(y > Nfloat + 0.5) y = Nfloat + 0.5; 
    		j0 = floor(y);
    		j1 = j0 + 1.0; 

    		s1 = x - i0; 
    		s0 = 1.0 - s1; 
    		t1 = y - j0; 
    		t0 = 1.0 - t1;

    		let i0i = i0;
    		let i1i = i1;
    		let j0i = j0;
    		let j1i = j1;

    		d[IX(i, j)] = 
	    		s0 * ( t0 * d0[IX(i0i, j0i)] + t1 * d0[IX(i0i, j1i)] )
    			+s1 * ( t0 * d0[IX(i1i, j0i)] + t1 * d0[IX(i1i, j1i)] );
    	}
    }
    set_bnd(b, d);
}

function set_bnd(b, x) {
    for(let i = 1; i < N - 1; i++) {
            x[IX(i, 0  )] = b == 2 ? -x[IX(i, 1  )] : x[IX(i, 1  )];
            x[IX(i, N-1)] = b == 2 ? -x[IX(i, N-2)] : x[IX(i, N-2)];
    }
    for(let j = 1; j < N - 1; j++) {
            x[IX(0  , j)] = b == 1 ? -x[IX(1  , j)] : x[IX(1  , j)];
           x[IX(N-1, j)] = b == 1 ? -x[IX(N-2, j)] : x[IX(N-2, j)];
    }
    
    x[IX(0, 0)]       = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, N-1)]     = 0.5 * (x[IX(1, N-1)] + x[IX(0, N-2)]);
    x[IX(N-1, 0)]     = 0.5 * (x[IX(N-2, 0)] + x[IX(N-1, 1)]);
    x[IX(N-1, N-1)]   = 0.5 * (x[IX(N-2, N-1)] + x[IX(N-1, N-2)]);
}
