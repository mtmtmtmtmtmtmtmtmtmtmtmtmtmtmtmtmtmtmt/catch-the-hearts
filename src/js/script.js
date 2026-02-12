const platform = document.getElementById("platform");

let posX = (window.innerWidth - platform.offsetWidth) / 2;
platform.style.left = posX + "px";
let baseSpeed = 5;
const keys = {};

function hidePlayer() {
  platform.style.display = "none";
}

// Track all keys by physical code
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Reset all keys when window loses focus
window.addEventListener("blur", () => {
  for (let key in keys) keys[key] = false;
});

function animate() {
  let speed = baseSpeed;

  // Sprint if ShiftLeft or ShiftRight is held
  if (keys["ShiftLeft"] || keys["ShiftRight"]) speed = 10;

  // Only move if the direction keys are physically pressed
  if (keys["KeyA"]) posX -= speed;
  if (keys["KeyD"]) posX += speed;

  // Keep inside window
  posX = Math.max(0, Math.min(window.innerWidth - platform.offsetWidth, posX));

  platform.style.left = posX + "px";

  requestAnimationFrame(animate);
}

// animate();
hidePlayer();
