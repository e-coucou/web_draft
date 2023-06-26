let pop;
let dim, mutation;
let iter=0;
let maxFitness=0;
let message,idMess;
let graphe;

function setup() {
    canvas = createCanvas(innerWidth*0.97,410);
    canvas.parent("#canvas");

    dim = createSlider(0,2000,700,10);
    dim.parent("#population");
    dim.changed(init);

    mutation = createSlider(0,0.05,0.003,0.001);
    mutation.parent("#mutation");
    mutation.changed(init);

    message = "Message 0, Très complexe !"
    idMess = createInput(message,"text");
    idMess.size(200);
    idMess.parent("#message");
    // idMess.input(getText); // car sinon lecture des lettres une à une !
    idMess.changed(getText);

    init();
}

function getText() {
    message = this.value();
    init();
}

function init() {
    pop = new Population(dim.value(),message);
    iter = 0;
    maxFitness = 0;
    graphe = new Graphe(width*2/3-50, 20,width/3,200);
    graphe.nouvelle(color(255,0,0));
    graphe.nouvelle(color(255,255,255));
    loop();
}

function draw() {
    background(98);
    pop.show(12);
    // Evaluation de la Population
    if ( pop.fitness()) {
        background(200);
        pop.solution.bkColor = color(6, 77, 38);
        pop.solution.show(height/3,35);
        noLoop();
    }
    // Croisement / Mutation
    pop.evolution(mutation.value());
    //--
    iter++;
    if (pop.maxScore > maxFitness) maxFitness=pop.maxScore;
    //----
    graphe.ajoute(1,pop.maxScore);
    graphe.ajoute(0,maxFitness);

    fill(255);
    textAlign(RIGHT,CENTER);
    textSize(18);
    text("Population : #"+dim.value(), width-100,height-160);
    text("Taux de Mutation : "+nf(mutation.value()*100,1,1)+"%", width-100,height-130);
    text("Max Fitness Score : "+nf(maxFitness,1,3), width-100,height-100);
    text("Actual Fitness Score : "+nf(pop.maxScore,1,3), width-100,height-70);
    text("Générations : "+iter, width-100,height-40);

    graphe.show();
}