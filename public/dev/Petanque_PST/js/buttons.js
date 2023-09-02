function showSwitch(txt,x,y,l,r) {
    textAlign(CENTER,CENTER);
    fill(color(couleur.bg));
    rect(x,y-10,l-20,20);
    circle(x,y,20);
    circle(x+l-20,y,20);
    fill(color(couleur.f));
    rect(x+l-2.5*r,y-r/2,1.5*r+2,r);
    circle(x+l-2.5*r,y,r+2);
    circle(x+l-r,y,r+2);
    fill(255);
    textAlign(LEFT,CENTER);
    if (mode==0) {
        text(txt,x,y);
        fill(color(couleur.bk));
        circle(x+l-2.5*r,y,r);
    } else {
        text(txt,x,y);
        fill(color(couleur.cur));
        circle(x+l-r,y,r);
    }
}