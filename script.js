const timer = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const notification = document.getElementById("notification");
const warning = document.getElementById("warning");
const startOptions = document.getElementById("startOptions");
const minuteInput = document.getElementById("minuteInput");
const newTSButton = document.getElementById("newTSButton");
const confirmTimeButton = document.getElementById("confirmTime");

const INITIAL_TIME = 60 * 60; // 60 dakika
let timeLeft = INITIAL_TIME;
let timerId = null;
let lastNotificationTime = null;
let isPaused = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function playNotification() {
  notification.currentTime = 0;
  notification.play();
}

function showWarning() {
  warning.classList.remove("hidden");
}

function hideWarning() {
  warning.classList.add("hidden");
}

function showStartButton() {
  startOptions.classList.add("hidden");
  startButton.classList.remove("hidden");
}

function showStartOptions() {
  startOptions.classList.remove("hidden");
  startButton.classList.add("hidden");
  minuteInput.value = "";
}

function checkAndNotify(currentTime) {
  // Son 30 saniye için kontrol
  if (currentTime <= 30) {
    playNotification();
    showWarning();
    return;
  }

  // 1, 2, 3 ve 5 dakika kala bildirim
  const notificationMinutes = [1, 2, 5];
  const currentMinutes = Math.ceil(currentTime / 60);

  if (
    notificationMinutes.includes(currentMinutes) &&
    (lastNotificationTime === null || lastNotificationTime !== currentMinutes)
  ) {
    playNotification();
    showWarning();
    // 3 saniye sonra uyarıyı gizle
    setTimeout(hideWarning, 3000);
    lastNotificationTime = currentMinutes;
  }
}

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timerId);
    timer.textContent = "00:00";
    resetControls();
    playNotification();
    showWarning();
    return;
  }

  checkAndNotify(timeLeft);
  timer.textContent = formatTime(timeLeft);
  timeLeft--;
}

function resetControls() {
  showStartOptions();
  startButton.textContent = "Durdur";
  startButton.classList.remove("paused");
  resetButton.disabled = true;
  isPaused = false;
  hideWarning();
}

function startControls() {
  showStartButton();
  startButton.textContent = "Durdur";
  startButton.classList.remove("paused");
  resetButton.disabled = false;
  isPaused = false;
}

function pauseControls() {
  startButton.textContent = "Devam Et";
  startButton.classList.add("paused");
  resetButton.disabled = false;
  isPaused = true;
  hideWarning();
}

function startTimer(minutes) {
  timeLeft = minutes * 60;
  lastNotificationTime = null;
  timer.textContent = formatTime(timeLeft);
  startControls();
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

newTSButton.addEventListener("click", () => {
  startTimer(60);
});

confirmTimeButton.addEventListener("click", () => {
  const minutes = parseInt(minuteInput.value);
  if (minutes && minutes > 0 && minutes < 60) {
    startTimer(minutes);
  } else {
    alert("Lütfen 1-59 arası bir dakika girin!");
  }
});

// Enter tuşu ile de başlatma
minuteInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    confirmTimeButton.click();
  }
});

startButton.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    pauseControls();
    return;
  }

  if (isPaused) {
    startControls();
    updateTimer();
    timerId = setInterval(updateTimer, 1000);
  }
});

resetButton.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  timeLeft = INITIAL_TIME;
  lastNotificationTime = null;
  timer.textContent = formatTime(INITIAL_TIME);
  resetControls();
});
