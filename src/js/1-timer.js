import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate.getTime() <= Date.now()) {
      userSelectedDate = null;
      startButton.disabled = true;
      showError();
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', onStartClick);

function onStartClick() {
  if (!userSelectedDate || userSelectedDate.getTime() <= Date.now()) {
    userSelectedDate = null;
    startButton.disabled = true;
    showError();
    return;
  }

  startButton.disabled = true;
  datetimePicker.disabled = true;

  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const msLeft = userSelectedDate.getTime() - Date.now();

  if (msLeft <= 0) {
    clearInterval(intervalId);
    renderTime(convertMs(0));
    userSelectedDate = null;
    datetimePicker.disabled = false;
    return;
  }

  renderTime(convertMs(msLeft));
}

function renderTime({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function showError() {
  iziToast.error({
    title: 'Error',
    message: 'Please choose a date in the future',
    position: 'topRight',
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
