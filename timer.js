// Seletores DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const alarmSound = document.getElementById('alarmSound');
const stateLabel = document.getElementById('stateLabel');
const cycleInfo = document.getElementById('cycleInfo');
const container = document.querySelector(".container");
const focusInput = document.getElementById("focusInput");
const shortBreakInput = document.getElementById("shortBreakInput");
const longBreakInput = document.getElementById("longBreakInput");
const cycleInput = document.getElementById("cycleInput");
const applyBtn = document.getElementById("applySettings");
const historyList = document.getElementById("historyList");
const totalSessionsEl = document.getElementById("totalSessions");
const totalMinutesEl = document.getElementById("totalMinutes");
const clearHistoryBtn = document.getElementById("clearHistory");

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

// Configuração Dinâmica do Timer
function applySettings() {
  if (intervalId !== null) {
    alert("Pause o timer antes de alterar as configurações.");
    return;
  }

  const newFocus = parseInt(focusInput.value);
  const newShort = parseInt(shortBreakInput.value);
  const newLong = parseInt(longBreakInput.value);
  const newCycles = parseInt(cycleInput.value);

  if (
    isNaN(newFocus) || newFocus <= 0 ||
    isNaN(newShort) || newShort <= 0 ||
    isNaN(newLong) || newLong <= 0 ||
    isNaN(newCycles) || newCycles <= 0
  ) {
    alert("Insira valores válidos maiores que zero.");
    return;
  }

  focusTime = newFocus * 60;
  shortBreakTime = newShort * 60;
  longBreakTime = newLong * 60;
  maxCycles = newCycles;

  resetTimer();
}

// Salva Sessão de Foco
function saveFocusSession() {
  const history = JSON.parse(localStorage.getItem("pomodoroHistory")) || [];

  const newSession = {
    date: new Date().toISOString(),
    duration: focusTime / 60
  };

  history.unshift(newSession); // adiciona no início (mais recente primeiro)

  if (history.length > 20) {
  history.pop();
}

  localStorage.setItem("pomodoroHistory", JSON.stringify(history));

  renderHistory();
}

// Renderiza Histórico
function renderHistory() {
  const history = JSON.parse(localStorage.getItem("pomodoroHistory")) || [];

  historyList.innerHTML = "";

  history.forEach(session => {
    const li = document.createElement("li");

    const formattedDate = new Date(session.date).toLocaleString("pt-BR");

    li.textContent = `${formattedDate} - ${session.duration} min`;

    historyList.appendChild(li);
  });

  updateTotals(history);
}

// Atualiza Estatísticas
function updateTotals(history) {
  const totalSessions = history.length;

  const totalMinutes = history.reduce((acc, session) => {
    return acc + session.duration;
  }, 0);

  totalSessionsEl.textContent = `Total de focos: ${totalSessions}`;
  totalMinutesEl.textContent = `Total de minutos focados: ${totalMinutes}`;
}

// Limpa Histórico
function clearHistory() {
  localStorage.removeItem("pomodoroHistory");
  renderHistory();
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
      saveFocusSession();
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
  startTimer();
}


// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
applyBtn.addEventListener("click", applySettings);
clearHistoryBtn.addEventListener("click", clearHistory);

updateDisplay();
updateStateUI();
renderHistory();