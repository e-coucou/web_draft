let startX, startY;
let swipeThreshold = 50; // distance mini du swipe

function touchStarted() {
  startX = mouseX;
  startY = mouseY;
  return false; // empêche le scrolling de la page sur iphone
}

function touchEnded() {
  let dx = mouseX - startX;
  let dy = mouseY - startY;

  if (abs(dx) > abs(dy)) {
    if (dx > swipeThreshold) onSwipeRight();
    else if (dx < -swipeThreshold) onSwipeLeft();
  } else {
    if (dy > swipeThreshold) onSwipeDown();
    else if (dy < -swipeThreshold) onSwipeUp();
  }
  return false; //idem empeche le scrolling
}

// Fonctions à personnaliser
function onSwipeUp() {
  console.log("Swipe vers le haut");
  couleur_sel = 1;
}
function onSwipeDown() {
  console.log("Swipe vers le bas");
}
function onSwipeLeft() {
  console.log("Swipe vers la gauche");
  annee = 2023;
}
function onSwipeRight() {
  console.log("Swipe vers la droite");
}
