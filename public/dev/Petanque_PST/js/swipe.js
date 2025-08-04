let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let swipeThreshold = 150; // distance mini du swipe

let swipeSel = 0

const swH = [0,1,3,10];

function initSwipe() {
    let canvasElement = document.querySelector("canvas");

    canvasElement.ontouchstart = function (e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        console.log("ici touch")
    };

    canvasElement.ontouchmove = function (e) {
        const touch = e.touches[0];
        endX = touch.clientX;
        endY = touch.clientY;
        console.log("ici move")
        e.preventDefault(); // Empêche le scroll pendant le swipe
    };

    canvasElement.ontouchend = function (e) {
        const dx = endX - startX;
        const dy = endY - startY;
        console.log("ici end")

        if (abs(dx) > abs(dy)) {
            mouseSelection = true
            if (dx > swipeThreshold) onSwipeRight();
            else if (dx < -swipeThreshold) onSwipeLeft();
            } else {
            if (dy > swipeThreshold) onSwipeDown();
            else if (dy < -swipeThreshold) onSwipeUp();
            }
    };
}

// Fonctions à personnaliser
function onSwipeUp() {
//   console.log("Swipe vers le haut");
    if (mode === 2) {
        update_Nav(0);
    }
}
function onSwipeDown() {
//   console.log("Swipe vers le bas");
    if (mode === 2) {
        update_Nav(1);
    }
}
function onSwipeLeft() {
//   console.log("Swipe vers la gauche");
  if (swH.includes(mode)) {
    swipeSel = (swipeSel-1 + 4) % 4;
    switch (swipeSel) {
        case 0: BtTournoi();break;
        case 1: BtListe();break;
        case 2: BtGraphe();break;
        case 3: BtEnCours();break;
    }
  }
}
function onSwipeRight() {
//   console.log("Swipe vers la droite");
  if (swH.includes(mode)) {
    swipeSel = (swipeSel+1) % 4;
    switch (swipeSel) {
        case 0: BtTournoi();break;
        case 1: BtListe();break;
        case 2: BtGraphe();break;
        case 3: BtEnCours();break;
    }
  }
}
