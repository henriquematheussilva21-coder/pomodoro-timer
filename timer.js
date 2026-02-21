// Seletores DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const alarmSound = document.getElementById('alarmSound');
const stateLabel = document.getElementById('stateLabel');
const cycleInfo = document.getElementById('cycleInfo');
const container = document.querySelector(".container");

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

// Atualização da Interface
function updateStateUI(){
  if (currentState === 'focus'){
    stateLabel.textContent = '🔥 Foco';
  } else if (currentState === 'shortBreak'){
    stateLabel.textContent = '☕ Pausa Curta';
  } else if (currentState === 'longBreak'){
    stateLabel.textContent = '🌙 Pausa Longa';
  }
  cycleInfo.textContent = `Ciclo: ${currentCycle} / ${maxCycles}`;

  container.classList.remove("focus", "shortBreak", "longBreak");
  container.classList.add(currentState);
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
  totalSeconds = focusTime;
  updateDisplay();
  updateStateUI();
}


// Lógica de Estados
function handleTimerEnd(){
  pauseTimer();
  playSound();

  switch (currentState) {
    case 'focus':
      currentCycle++;
      if (currentCycle < maxCycles) {
        currentState = 'shortBreak';
        totalSeconds = shortBreakTime;
      } else {
        currentState = 'longBreak';
        totalSeconds = longBreakTime;
      }
      break;
    
    case 'shortBreak':
      currentState = 'focus';
      totalSeconds = focusTime;
      break;
    
    case 'longBreak':
      currentCycle = 0;
      currentState = 'focus';
      totalSeconds = focusTime;
      break;
      }

    

  updateDisplay();
  updateStateUI();
  
}


// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
updateStateUI();