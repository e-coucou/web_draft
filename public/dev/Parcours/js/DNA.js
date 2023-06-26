function calcFitness() {
	current = Infinity;
	for( let i=0;i<population.length;i++) {
		let d= distance(villes,population[i]);
 		let newPop = optiEP(population[i]);
		let d2= distance(villes,newPop);
		if (d2<d) {
			d=d2;
			population[i] = newPop.splice();
		}
 		if (d<optiD) {
			optiD = d;
			bestP = population[i].slice();
		}
		if (d<current) {
			current = d;
			currentP = population[i].slice();
		}
		fitness[i] = 1/(d +1);
	}
	normFitness();
}


function normFitness() {
	let sum = 0;
	for(let i=0;i<fitness.length;i++) {
		sum += fitness[i];
	}
	for(let i=0;i<fitness.length;i++) {
		fitness[i] = fitness[i] / sum;
	}
 }

 function nextGeneration() {
 	let newPop = [];

 	for(let i = 0; i<population.length;i++) {
 		// newPop[i] = population[i].slice();
 		let newOrdreA = choix(population,fitness);
 		let newOrdreB = choix(population,fitness);
 		let newOrdre = crossOver(newOrdreA,newOrdreB);
 		mutation(newOrdre,0.01);
 		newPop[i] = newOrdre; 
 	}
	cpt+=population.length;
 
 	population = newPop;
 }

function crossOver(A,B) {
	let s = floor(random(A.length));
	let e = floor(random(s+1,A.length));
	let rep = A.slice(s,e);
	for (let i=0;i<B.length;i++) {
		let add = B[i];
		if( !rep.includes(add)) {
			rep.push(add);
		}
	}
	return rep;
}
 function choix(list,prob) {
 	let id =0;
 	let r = random(1);
 	while(r>0) {
 		r = r -prob[id];
 		id++;
 	}
 	id--;
 	return list[id].slice( );
 }

 function mutation(od,rate) {
 	for(let i=0;i<total;i++) {
 		if(random(1)<rate) {
		 	let a = floor(random(od.length));
 			let b = floor(random(od.length));
	 	 	swap(od,a,b);
 		}
 	}
}
 function optiEP(arr) {
 	let od=arr.copyWithin(); console.log(od,arr);
 	for(let i=1;i<total-1;i++) {
 		if(distEP(od[i-1],od[i+1])< distEP(od[i-1],od[i])){
	 	 	swap(od,i,i+1);
 		}
 	}
 	return od;
 }
 function optiEnd(od) {
 	if(distEP(od[0],od[total-1])<distEP(od[0],od[1])) {
 		// swap(od,)
 	}
 }
 function distEP(a,b) {
 	return ((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
 }