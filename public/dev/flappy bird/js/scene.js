class Scene {
    constructor() {
        this.soleil = createVector(width/5*4 , height / 9, width/10);
    }

    show() {
        noStroke();
        texture(soleil);
        textureMode(NORMAL);
        rect(this.soleil.x,this.soleil.y, this.soleil.z,this.soleil.z);
    }
}