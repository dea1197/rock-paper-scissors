
let score = JSON.parse(localStorage.getItem("score")) || {
  menang: 0,
  kalah: 0,
  seri: 0
}

function pickComputerMove() {
  const randomNum = Math.floor((Math.random() * 3) + 1);
  let computerMove = "";

  if (randomNum === 1) {
    computerMove = "Gunting";
  } else if (randomNum === 2) {
    computerMove = "Batu";
  } else if (randomNum === 3) {
    computerMove = "Kertas";
  }

  return computerMove;
}

function playGame(playerMove) {

  let computerMove = pickComputerMove();

  let result = "";

  if (playerMove === "Gunting") {
    if (computerMove === "Gunting") {
      result = "Seri";
    } else if (computerMove === "Batu") {
      result = "Kamu Kalah";
    } else if (computerMove === "Kertas") {
      result = "Kamu Menang";
    }
  }
  else if (playerMove === "Batu") {
    if (computerMove === "Gunting") {
      result = "Kamu Menang";
    } else if (computerMove === "Batu") {
      result = "Seri";
    } else if (computerMove === "Kertas") {
      result = "Kamu Kalah";
    }
  }
  else if (playerMove === "Kertas") {
    if (computerMove === "Gunting") {
      result = "Kamu Kalah";
    } else if (computerMove === "Batu") {
      result = "Kamu Menang";
    } else if (computerMove === "Kertas") {
      result = "Seri";
    }
  }

  document.querySelector(".result").innerText = result;

  document.querySelector(".move").innerHTML =
    `
    Kamu
      <img class="img-emoji" src="images/${playerMove}-emoji.png">
      <img class="img-emoji" src="images/${computerMove}-emoji.png">
    Komputer
  `;

  if (result === "Kamu Menang") {
    score.menang++;
  } else if (result === "Kamu Kalah") {
    score.kalah++;
  } else if (result === "Seri") {
    score.seri++;
  }

  displayScore();
}

displayScore();

function displayScore() {
  document.querySelector(".score").innerHTML =
    `Menang : ${score.menang}, Kalah : ${score.kalah}, Seri : ${score.seri}`

  localStorage.setItem("score", JSON.stringify(score));
}

document.querySelector(".js-gunting")
  .addEventListener("click", () => {

    document.querySelector(".move").innerHTML =
      `
         Loading... Loading...
      `;
    
    document.querySelector(".result").innerText = "Loading...";

    setTimeout(() => {
      playGame('Gunting');
    }, 2000)

  });

document.querySelector(".js-batu")
  .addEventListener("click", () => {

    document.querySelector(".move").innerHTML =
      `
         Loading... Loading...
      `;

    document.querySelector(".result").innerText = "Loading...";

    setTimeout(() => {
      playGame('Batu');
    }, 2000)
  })

document.querySelector(".js-kertas")
  .addEventListener("click", () => {

    document.querySelector(".move").innerHTML =
      `
         Loading... Loading...
      `;

    document.querySelector(".result").innerText = "Loading...";

    setTimeout(() => {
      playGame('Kertas');
    }, 2000)
  })

document.querySelector(".reset-score")
  .addEventListener("click", () => {
    score.menang = 0;
    score.kalah = 0;
    score.seri = 0;
    displayScore();
  })

let inervalID;
let inervalID2;
let isAutoPlay = false;

function autoPlay() {

  if (!isAutoPlay) {

    inervalID2 = setInterval(() => {
      document.querySelector(".move").innerHTML =
        `
         Loading... Loading...
      `;

      document.querySelector(".result").innerText = "Loading...";

      isAutoPlay = true;
    }, 2000)

    inervalID = setInterval(() => {

      const playerMove = pickComputerMove();
      playGame(playerMove);

      isAutoPlay = true;
    }, 4000)
  } else {
    clearInterval(inervalID)
    clearInterval(inervalID2)
    isAutoPlay = false;
 
  }

  const autoName = document.querySelector(".auto-play");
  if (autoName.innerText === "Auto Play") {
    autoName.innerText = "Stop Play"
  } else {
    autoName.innerText = "Auto Play"
  }


}

document.querySelector(".auto-play")
  .addEventListener("click", () => {
    autoPlay();
  })
