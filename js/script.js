let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let achievements = {};

async function loadAchievements() {
  const res = await fetch('achievements.json');
  achievements = await res.json();
  startGame();
}

function startGame() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';

  const skills = Object.keys(achievements);
  const cards = [...skills, ...skills]; // two of each skill
  cards.sort(() => 0.5 - Math.random());

  cards.forEach(skill => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.skill = skill;

    card.innerHTML = `
      <img class="front-face" src="images/${skill.toLowerCase()}.png" alt="${skill} icon" />
      <div class="back-face">?</div>
    `;

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
  previewTiles();
}

function previewTiles() {
  const allCards = document.querySelectorAll('.memory-card');
  
  allCards.forEach(card => card.classList.add('flip'));  // Show all tiles

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flip'));  // Flip back after 3s
  }, 3000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.skill === secondCard.dataset.skill;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  showAchievement(firstCard.dataset.skill);
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function showAchievement(skill) {
  const box = document.getElementById('achievementBox');
  document.getElementById('achievementName').innerText = achievements[skill].title;
  document.getElementById('achievementDesc').innerText = achievements[skill].description;

  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), 6000);
}

function restartGame() {
  document.getElementById('gameBoard').innerHTML = '';
  loadAchievements();
}

loadAchievements();