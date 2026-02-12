const platform = document.getElementById("platform");
const difficulties = document.querySelectorAll(".difficulty");
const menu = document.getElementById("menu");

let posX = (window.innerWidth - platform.offsetWidth) / 2;
platform.style.left = posX + "px";

let baseSpeed = 5;
const keys = {};

const fallingHearts = [];
const heartSize = 80;
let heartSpeed = 3;
let spawnInterval = 1000;
let spawnIntervalId = null;

let score = 0;
let scoreDisplay = null;
let gameRunning = false;

platform.style.display = "none";

document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));
window.addEventListener("blur", () => {
  for (let key in keys) keys[key] = false;
});

function animate() {
  if (!gameRunning) return;

  let speed =
    keys["ShiftLeft"] || keys["ShiftRight"] ? baseSpeed * 1.5 : baseSpeed;
  if (keys["KeyA"]) posX -= speed;
  if (keys["KeyD"]) posX += speed;

  posX = Math.max(0, Math.min(window.innerWidth - platform.offsetWidth, posX));
  platform.style.left = posX + "px";

  const platTop = window.innerHeight - platform.offsetHeight;
  const platLeft = posX;
  const platRight = posX + platform.offsetWidth;

  for (let i = fallingHearts.length - 1; i >= 0; i--) {
    const heart = fallingHearts[i];
    heart.y += heartSpeed;

    const sqLeft = heart.x;
    const sqRight = heart.x + heartSize;
    const sqBottom = heart.y + heartSize;

    if (sqRight > platLeft && sqLeft < platRight && sqBottom >= platTop - 50) {
      heart.y = platTop - heartSize;
      heart.el.style.top = heart.y + "px";

      heart.el.remove();
      fallingHearts.splice(i, 1);

      score += 100;
      if (scoreDisplay) scoreDisplay.innerText = `Score: ${score}`;
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

function spawnHeart() {
  if (!gameRunning) return;

  const heart = document.createElement("img");
  heart.src = "asset/heart.png";
  heart.className = "falling-heart";
  heart.style.width = heartSize + "px";
  heart.style.height = heartSize + "px";
  heart.style.position = "absolute";
  heart.style.top = "-80px";
  heart.style.left = Math.random() * (window.innerWidth - heartSize) + "px";

  document.body.appendChild(heart);

  fallingHearts.push({
    el: heart,
    x: parseFloat(heart.style.left),
    y: -heartSize,
  });
}

function stopGame() {
  gameRunning = false;

  fallingHearts.forEach((h) => h.el.remove());
  fallingHearts.length = 0;

  if (spawnIntervalId) clearInterval(spawnIntervalId);
  spawnIntervalId = null;

  platform.style.display = "none";

  if (scoreDisplay) scoreDisplay.remove();
  scoreDisplay = null;

  const leaveButton = document.getElementById("leaveButton");
  if (leaveButton) leaveButton.remove();

  menu.style.display = "block";
  score = 0;
}

difficulties.forEach((d) => {
  d.addEventListener("click", (e) => {
    const level = e.target.innerText.toLowerCase();
    menu.style.display = "none";
    platform.style.display = "block";

    switch (level) {
      case "easy":
        spawnInterval = 1000;
        heartSpeed = 3;
        baseSpeed = 5;
        break;
      case "medium":
        spawnInterval = 800;
        heartSpeed = 5;
        baseSpeed = 7;
        break;
      case "hard":
        spawnInterval = 500;
        heartSpeed = 7;
        baseSpeed = 9;
        break;
      case "extreme":
        spawnInterval = 400;
        heartSpeed = 10;
        baseSpeed = 12;
        break;
      case "im cool as fuck":
        spawnInterval = 300;
        heartSpeed = 15;
        baseSpeed = 25;
        break;
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
    leaveButton.id = "leaveButton";
    leaveButton.innerText = "Leave Game";
    leaveButton.style.position = "absolute";
    leaveButton.style.top = "10px";
    leaveButton.style.right = "10px";
    leaveButton.style.padding = "10px 15px";
    leaveButton.style.fontSize = "16px";
    leaveButton.style.cursor = "pointer";
    leaveButton.onclick = stopGame;
    document.body.appendChild(leaveButton);

    gameRunning = true;
    animate();

    if (!spawnIntervalId)
      spawnIntervalId = setInterval(spawnHeart, spawnInterval);
  });
});
