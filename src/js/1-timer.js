import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';



const startButton = document.querySelector('[data-start]');
const dateClick = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate.getTime() <= Date.now()) {
      iziToast.warning({
        title: "Warning",
        message: "Please choose a date in the future",
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(dateClick, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function timerStart() {

  const timerPromise = new Promise((resolve) => {
    const timerId = setInterval(() => {
      const chooseTime = new Date().getTime();
      const timeDiff = userSelectedDate.getTime() - chooseTime;

      if (timeDiff <= 0) {
        clearInterval(timerId);
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        resolve(); 
        return;
      }

      const timeLeft = convertMs(timeDiff);
      updateTimerDisplay(timeLeft);
    }, 1000);
  });

  timerPromise.then(() => {
    iziToast.success({
      title: "Timer Complete",
      message: "The countdown has finished!",
    });
    dateTimePicker.disabled = false;
    startButton.disabled = false;
  });
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.addEventListener('click', timerStart);
