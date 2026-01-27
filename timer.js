const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

let totalSeconds = 25 * 60;
let intervalId = null;

// Formata segundos para MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Atualiza o display
function updateDisplay() {
  timerDisplay.textContent = formatTime(totalSeconds);
}

// Inicia o timer
function startTimer() {
  if (intervalId !== null) return; // evita múltiplos intervals

  intervalId = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      clearInterval(intervalId);
      intervalId = null;
    }
  }, 1000);
}

// Pausa o timer
function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

// Reseta o timer
function resetTimer() {
  pauseTimer();
  totalSeconds = 25 * 60;
  updateDisplay();
}

// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Inicializa display
updateDisplay();
