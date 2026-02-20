// Seletores DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const alarmSound = document.getElementById('alarmSound');

// Configurações de Tempo
let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

// Estados do sistema
let currentState = 'focus'; // 'focus' | 'shortBreak' | 'longBreak'
let currentCycle = 0;
let maxCycles = 4;

let totalSeconds = focusTime;
let intervalId = null;

// Funções Auxiliares

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

// Toca o som
function playSound() {
  alarmSound.currentTime = 0;
  alarmSound.play();
}

// Controle do Timer
function startTimer() {
  if (intervalId !== null) return; // evita múltiplos intervals

  intervalId = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      handleTimerEnd();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetTimer() {
  pauseTimer();
  currentState = 'focus';
  currentCycle = 0;
  totalSeconds = focusTime
  updateDisplay();
}

// Lógica de Estados
function handleTimerEnd(){
  pauseTimer();
  playSound();
  
  if (currentState === 'focus') {
    currentCycle++;
    
    if (currentCycle < maxCycles){
      currentState = 'shortBreak';
      totalSeconds = shortBreakTime;
    } else {
      currentState = 'longBreak';
      totalSeconds = longBreakTime;
    }
  } else if (currentState === 'shortBreak') {
    currentState = 'focus';
    totalSeconds = focusTime;
    
  } else if (currentState === 'longBreak') {
    currentCycle = 0;
    currentState = 'focus';
    totalSeconds = focusTime;
  }
  updateDisplay();
  
}

// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();