const letters = Array.from(document.querySelectorAll('.letter'));
const timerDisplay = document.querySelector('#timer');
const statusText = document.querySelector('#status');
const nextLetterDisplay = document.querySelector('#next-letter');
const startButton = document.querySelector('#start-btn');
const restartButton = document.querySelector('#restart-btn');
const playerNameInput = document.querySelector('#player-name');
const leaderboardList = document.querySelector('#leaderboard');
const bestTimeDisplay = document.querySelector('#best-time');
const attemptCountDisplay = document.querySelector('#attempt-count');

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const leaderboardKey = 'alphabetGameLeaderboard';

let currentLetterIndex = 0;
let startTime = null;
let timerId = null;
let finished = false;
let attemptCount = 0;

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

function setTimer(ms) {
  timerDisplay.textContent = formatTime(ms);
}

function setStatus(message, type = 'normal') {
  statusText.textContent = message;
  statusText.dataset.variant = type;
}

function loadLeaderboard() {
  const stored = localStorage.getItem(leaderboardKey);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboard(score) {
  const entries = loadLeaderboard();
  entries.push(score);
  entries.sort((a, b) => a.time - b.time);
  localStorage.setItem(leaderboardKey, JSON.stringify(entries.slice(0, 5)));
}

function renderLeaderboard() {
  const entries = loadLeaderboard();
  leaderboardList.innerHTML = '';

  if (entries.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No scores yet. Complete a round to save your best time.';
    emptyItem.className = 'leaderboard-empty';
    leaderboardList.appendChild(emptyItem);
    bestTimeDisplay.textContent = '--:--.---';
    return;
  }

  entries.forEach((entry, index) => {
    const row = document.createElement('li');
    row.className = 'leaderboard-row';
    row.innerHTML = `
      <span class="leader-name">${index + 1}. ${entry.name}</span>
      <span class="leader-time">${formatTime(entry.time)}</span>
    `;
    leaderboardList.appendChild(row);
  });

  bestTimeDisplay.textContent = formatTime(entries[0].time);
}

function updateNextLetter() {
  nextLetterDisplay.textContent = alphabet[currentLetterIndex].toUpperCase();
}

function startTimer() {
  startTime = Date.now();
  timerId = setInterval(() => {
    setTimer(Date.now() - startTime);
  }, 33);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function resetBoard() {
  letters.forEach((button) => {
    button.classList.remove('highlighted', 'correct', 'incorrect');
  });
}

function resetGame() {
  stopTimer();
  currentLetterIndex = 0;
  finished = false;
  setTimer(0);
  resetBoard();
  updateNextLetter();
  setStatus('Press Start or type the letter A to begin.', 'normal');
  startButton.disabled = false;
  restartButton.disabled = false;
}

function finishGame() {
  stopTimer();
  finished = true;
  const elapsed = Date.now() - startTime;
  const playerName = playerNameInput.value.trim() || 'Guest';
  saveLeaderboard({ name: playerName, time: elapsed, createdAt: new Date().toISOString() });
  renderLeaderboard();
  attemptCount += 1;
  attemptCountDisplay.textContent = attemptCount;
  setStatus(`Nice! Completed in ${formatTime(elapsed)}. Your score has been saved locally.`, 'success');
  startButton.disabled = false;
}

function highlightLetter(index) {
  letters[index].classList.add('highlighted');
}

function handleCorrectAnswer(button) {
  button.classList.add('correct');
  button.classList.remove('highlighted');
  currentLetterIndex += 1;

  if (currentLetterIndex >= letters.length) {
    finishGame();
    return;
  }

  highlightLetter(currentLetterIndex);
  updateNextLetter();
  setStatus('Keep going! Type the next highlighted letter.', 'normal');
}

function handleIncorrectAnswer(button) {
  button.classList.add('incorrect');
  setStatus(`Oops, that was not the right letter. Try ${alphabet[currentLetterIndex].toUpperCase()}.`, 'error');
  setTimeout(() => {
    button.classList.remove('incorrect');
  }, 250);
}

function handleInput(input) {
  if (finished) {
    setStatus('Game over. Reset or press Start to play again.', 'normal');
    return;
  }

  const key = input.toLowerCase();
  const letterButton = letters.find((btn) => btn.dataset.letter.toLowerCase() === key);

  if (!letterButton) {
    return;
  }

  if (currentLetterIndex === 0 && key === 'a' && !timerId) {
    startButton.disabled = true;
    setStatus('Game started. Keep typing!', 'normal');
    startTimer();
    highlightLetter(0);
  }

  const currentLetter = alphabet[currentLetterIndex];
  if (key === currentLetter) {
    handleCorrectAnswer(letterButton);
  } else {
    handleIncorrectAnswer(letters[currentLetterIndex]);
  }
}

function handleKeyPress(event) {
  handleInput(event.key);
}

function handleLetterClick(event) {
  handleInput(event.currentTarget.dataset.letter);
}

startButton.addEventListener('click', () => {
  resetGame();
  startButton.disabled = true;
  setStatus('Game started. Type the highlighted letter.', 'normal');
  highlightLetter(currentLetterIndex);
  startTimer();
});

restartButton.addEventListener('click', resetGame);
letters.forEach((button) => button.addEventListener('click', handleLetterClick));
document.addEventListener('keydown', handleKeyPress);

resetGame();
renderLeaderboard();