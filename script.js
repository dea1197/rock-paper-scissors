// ==================== STATE ====================
const score = JSON.parse(localStorage.getItem("score")) || {
  menang: 0,
  kalah: 0,
  seri: 0
};

// ==================== ELEMENT CACHE ====================
const resultEl = document.querySelector(".result");

const scoreEl = document.querySelector(".score");
const autoBtn = document.querySelector(".auto-play");

const playerHand = document.querySelector(".player-hand");
const computerHand = document.querySelector(".computer-hand");

const hitSound = new Audio("sounds/hit.wav");
const winSound = new Audio("sounds/win.wav");
winSound.volume = 0.7;
const loseSound = new Audio("sounds/lose.wav");
const clickSound = new Audio("sounds/click.wav");
clickSound.volume = 0.5;

const flash = document.querySelector(".impact-flash");

// ==================== LOGIC ====================
function pickComputerMove() {
  const moves = ["Gunting", "Batu", "Kertas"];
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

function getResult(playerMove, computerMove) {
  if (playerMove === computerMove) return "Seri";

  if (
    (playerMove === "Gunting" && computerMove === "Kertas") ||
    (playerMove === "Batu" && computerMove === "Gunting") ||
    (playerMove === "Kertas" && computerMove === "Batu")
  ) {
    return "Kamu Menang";
  }

  return "Kamu Kalah";
}

// ==================== UI ====================
function updateUI(playerMove, computerMove, result) {

  const iconMap = {
    "Gunting": `
    <svg viewBox="0 0 64 64" width="40">

          <!-- Handle kiri -->
          <circle cx="20" cy="46" r="8" stroke="#94a3b8" stroke-width="3" fill="none" />

          <!-- Handle kanan -->
          <circle cx="44" cy="46" r="8" stroke="#94a3b8" stroke-width="3" fill="none" />

          <!-- Blade kiri -->
          <line x1="24" y1="40" x2="50" y2="12" stroke="white" stroke-width="4" stroke-linecap="round" />

          <!-- Blade kanan -->
          <line x1="40" y1="40" x2="14" y2="12" stroke="white" stroke-width="4" stroke-linecap="round" />

          <!-- Pivot (tengah) -->
          <circle cx="32" cy="36" r="3" fill="#94a3b8" />

        </svg>
  `,
    "Batu": `
    <svg viewBox="0 0 64 64" width="60">
      <path d="M20 40 Q15 30 25 25 Q30 15 40 20 Q50 25 45 40 Q40 50 25 48 Q18 45 20 40Z"
        fill="#64666b" stroke="#0f172a" stroke-width="2"/>
    </svg>
  `,
    "Kertas": `
    <svg viewBox="0 0 64 64" width="60">
      <rect x="18" y="12" width="28" height="40" rx="4" fill="#e2e8f0"/>
      <line x1="22" y1="20" x2="42" y2="20" stroke="#94a3b8" stroke-width="2"/>
      <line x1="22" y1="26" x2="42" y2="26" stroke="#94a3b8" stroke-width="2"/>
      <line x1="22" y1="32" x2="38" y2="32" stroke="#94a3b8" stroke-width="2"/>
    </svg>
  `
  };

  // tampilkan icon
  playerHand.innerHTML = iconMap[playerMove];
  computerHand.innerHTML = iconMap[computerMove];

  // reset class
  playerHand.classList.remove("clash-left", "win-glow", "lose-effect");
  computerHand.classList.remove("clash-right", "win-glow", "lose-effect");

  // 💥 tabrakan
  playerHand.classList.add("clash-left");
  computerHand.classList.add("clash-right");

  hitSound.currentTime = 0;
  hitSound.play();

  // FLASH EFFECT
  flash.classList.remove("flash-active");
  void flash.offsetWidth;
  flash.classList.add("flash-active");

  // tunggu clash selesai
  setTimeout(() => {

    resultEl.innerText = result;

    resultEl.classList.remove("win-color", "lose-color", "tie-color");

    if (result === "Kamu Menang") {
      resultEl.classList.add("win-color");

      playerHand.classList.add("win-glow");

      computerHand.classList.add("lose-effect");

      // ✨ glow setelah shake selesai
      setTimeout(() => {
        computerHand.classList.remove("lose-effect");
        void computerHand.offsetWidth;
        computerHand.classList.add("lose-effect");
      }, 400);

      winSound.currentTime = 0;
      winSound.play();

    } else if (result === "Kamu Kalah") {
      resultEl.classList.add("lose-color");

      computerHand.classList.add("win-glow");

      playerHand.classList.add("lose-effect");

      setTimeout(() => {
        playerHand.classList.remove("lose-effect");
        void playerHand.offsetWidth;
        playerHand.classList.add("lose-effect");
      }, 400);

      loseSound.currentTime = 0;
      loseSound.play();

    } else {
      resultEl.classList.add("tie-color");
    }

  }, 400); // samakan dengan durasi clash


}



function updateScore(result) {

  if (result === "Kamu Menang") score.menang++;
  else if (result === "Kamu Kalah") score.kalah++;
  else if (result === "Seri") score.seri++;

  localStorage.setItem("score", JSON.stringify(score));

  scoreEl.innerHTML = `
    Menang : ${score.menang}, 
    Kalah : ${score.kalah}, 
    Seri : ${score.seri}
  `;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => { });
}

// ==================== GAME ====================
function playGame(playerMove) {
  const computerMove = pickComputerMove();
  const result = getResult(playerMove, computerMove);

  updateUI(playerMove, computerMove, result);
  updateScore(result);
}

// ==================== BUTTON HANDLER ====================
function handleClick(move) {
  playerHand.textContent = "⏳";
  computerHand.textContent = "⏳";
  resultEl.innerText = "Fighting...";

  setTimeout(() => {
    playGame(move);
  }, 1000);
}

document.querySelector(".js-gunting")
  .addEventListener("click", () => {
    playSound(clickSound);
    handleClick("Gunting");
  });

document.querySelector(".js-batu")
  .addEventListener("click", () => {
    playSound(clickSound);
    handleClick("Batu");
  });

document.querySelector(".js-kertas")
  .addEventListener("click", () => {
    playSound(clickSound);
    handleClick("Kertas");
  });

// ==================== RESET ====================
document.querySelector(".reset-score")
  .addEventListener("click", () => {
    score.menang = 0;
    score.kalah = 0;
    score.seri = 0;
    updateScore("reset");
    playSound(clickSound);
  });

// ==================== AUTOPLAY ====================
let intervalId = null;

function toggleAutoPlay() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    autoBtn.innerText = "Auto Play";
    autoBtn.style.backgroundColor = "#0ea5e9";
    return;
  }

  intervalId = setInterval(() => {

    // loading effect
    playerHand.textContent = "⏳";
    computerHand.textContent = "⏳";
    resultEl.innerText = "Fighting...";

    setTimeout(() => {
      const move = pickComputerMove();
      playGame(move);
    }, 800);

  }, 2000);

  autoBtn.innerText = "Stop Play";
  autoBtn.style.backgroundColor = "red";
}

autoBtn.addEventListener("click", () => {
  playSound(clickSound);
  toggleAutoPlay();
});

// ==================== INIT ====================
function renderScore() {
  scoreEl.innerHTML = `
    Menang : ${score.menang}, 
    Kalah : ${score.kalah}, 
    Seri : ${score.seri}
  `;
}

renderScore();