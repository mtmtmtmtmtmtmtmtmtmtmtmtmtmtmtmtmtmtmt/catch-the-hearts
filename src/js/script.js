const platform = document.getElementById("platform");
const difficulties = document.querySelectorAll(".difficulty");
const menu = document.getElementById("menu");

let keys = {};
let posX;
let baseSpeed;
let heartSpeed;
let spawnInterval;
let spawnIntervalId = null;

let score = 0;
let scoreDisplay = null;
let gameRunning = false;

const fallingHearts = [];
let heartSize;

// === SCREEN SCALING ===
function scaleValues() {
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;

  heartSize = 60 * scaleY;
  platform.style.width = 200 * scaleX + "px";

  posX = window.innerWidth / 2 - platform.offsetWidth / 2;
  platform.style.left = posX + "px";
}

scaleValues();
window.addEventListener("resize", scaleValues);

platform.style.display = "none";

// === DESKTOP CONTROLS ===
document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));
window.addEventListener("blur", () => (keys = {}));

// === MOBILE TOUCH CONTROLS ===
function movePlatform(x) {
  posX = x - platform.offsetWidth / 2;
  posX = Math.max(0, Math.min(window.innerWidth - platform.offsetWidth, posX));
  platform.style.left = posX + "px";
}

document.addEventListener("touchstart", (e) => {
  movePlatform(e.touches[0].clientX);
});

document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    movePlatform(e.touches[0].clientX);
  },
  { passive: false },
);

// === GAME LOOP ===
function animate() {
  if (!gameRunning) return;

  let speed =
    keys["ShiftLeft"] || keys["ShiftRight"] ? baseSpeed * 1.5 : baseSpeed;

  if (keys["KeyA"]) posX -= speed;
  if (keys["KeyD"]) posX += speed;

  posX = Math.max(0, Math.min(window.innerWidth - platform.offsetWidth, posX));
  platform.style.left = posX + "px";

  const platTop = platform.offsetTop;
  const platLeft = posX;
  const platRight = posX + platform.offsetWidth;

  for (let i = fallingHearts.length - 1; i >= 0; i--) {
    const heart = fallingHearts[i];
    heart.y += heartSpeed;

    const left = heart.x;
    const right = heart.x + heartSize;
    const bottom = heart.y + heartSize;

    // Proper collision (bottom hits platform top)
    if (right > platLeft && left < platRight && bottom >= platTop) {
      heart.el.remove();
      fallingHearts.splice(i, 1);

      score += 100;
      scoreDisplay.innerText = `Score: ${score}`;
      continue;
    }

    if (heart.y > window.innerHeight) {
      heart.el.remove();
      fallingHearts.splice(i, 1);
      continue;
    }

    heart.el.style.top = heart.y + "px";
  }

  requestAnimationFrame(animate);
}

// === SPAWN HEART ===
function spawnHeart() {
  if (!gameRunning) return;

  const heart = document.createElement("img");
  heart.src = "asset/heart.png";
  heart.className = "falling-heart";
  heart.style.width = heartSize + "px";
  heart.style.height = heartSize + "px";
  heart.style.position = "absolute";
  heart.style.top = -heartSize + "px";
  heart.style.left = Math.random() * (window.innerWidth - heartSize) + "px";

  document.body.appendChild(heart);

  fallingHearts.push({
    el: heart,
    x: parseFloat(heart.style.left),
    y: -heartSize,
  });
}

// === STOP GAME ===
function stopGame() {
  gameRunning = false;

  fallingHearts.forEach((h) => h.el.remove());
  fallingHearts.length = 0;

  clearInterval(spawnIntervalId);
  spawnIntervalId = null;

  platform.style.display = "none";
  scoreDisplay.remove();
  menu.style.display = "flex";
}

// === START GAME ===
difficulties.forEach((d) => {
  d.addEventListener("click", (e) => {
    const level = e.target.innerText.toLowerCase();

    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;

    switch (level) {
      case "easy":
        spawnInterval = 1000;
        heartSpeed = 3 * scaleY;
        baseSpeed = 6 * scaleX;
        break;
      case "medium":
        spawnInterval = 800;
        heartSpeed = 5 * scaleY;
        baseSpeed = 8 * scaleX;
        break;
      case "hard":
        spawnInterval = 500;
        heartSpeed = 7 * scaleY;
        baseSpeed = 10 * scaleX;
        break;
      case "extreme":
        spawnInterval = 400;
        heartSpeed = 10 * scaleY;
        baseSpeed = 13 * scaleX;
        break;
      default:
        spawnInterval = 300;
        heartSpeed = 15 * scaleY;
        baseSpeed = 18 * scaleX;
    }

    score = 0;

    scoreDisplay = document.createElement("div");
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "10px";
    scoreDisplay.style.left = "10px";
    scoreDisplay.style.color = "white";
    scoreDisplay.style.fontSize = "24px";
    scoreDisplay.style.fontWeight = "bold";
    scoreDisplay.innerText = `Score: ${score}`;
    document.body.appendChild(scoreDisplay);

    const leaveButton = document.createElement("button");
    leaveButton.innerText = "Leave Game";
    leaveButton.style.position = "absolute";
    leaveButton.style.top = "10px";
    leaveButton.style.right = "10px";
    leaveButton.onclick = stopGame;
    document.body.appendChild(leaveButton);

    menu.style.display = "none";
    platform.style.display = "block";

    gameRunning = true;
    animate();
    spawnIntervalId = setInterval(spawnHeart, spawnInterval);
  });
});
