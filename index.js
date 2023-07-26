const targetDate = new Date(+Date.now() + 12096e5);

function minTwoDigits(number) {
  return (number < 10 ? '0' : '') + number;
}

function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector('.segment-display');
  const segmentDisplayTop = segmentDisplay.querySelector('.segment-display__top');
  const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display__bottom');
  
  const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
  const segmentOverlayTop = segmentDisplay.querySelector('.segment-overlay__top');
  const segmentOverlayBottom = segmentDisplay.querySelector('.segment-overlay__bottom');

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom
  }
}

function updateSegmentValues(displayElement, overlayElement, value) {
  displayElement.textContent = value;
  overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(segmentElement);

  if (parseInt(segmentElements.segmentDisplayTop.textContent, 10) == timeValue) return;

  segmentElements.segmentOverlay.classList.add('flip');

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove('flip');
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener('animationend', finishAnimation);
  }

  segmentElements.segmentOverlay.addEventListener('animationend', finishAnimation);
}

function updateTimeSection(sectionID, timeValue) {
  const sectionElement = document.getElementById(sectionID);
  const timeSegment = sectionElement.querySelector('.time-segment');

  timeValue = minTwoDigits(timeValue);

  updateTimeSegment(timeSegment, timeValue);
}

function getTimeRemaining(targetDateTime) {
  const nowTime = Date.now();
  let secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);

  const complete = nowTime >= targetDateTime;

  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
    }
  }

  const days = Math.floor(secondsRemaining / 86400);
  secondsRemaining -= days * 86400;

  const hours = Math.floor(secondsRemaining / 3600) % 24;
  secondsRemaining -= hours * 3600;

  const minutes = Math.floor(secondsRemaining / 60) % 60;
  secondsRemaining -= minutes * 60;

  const seconds = secondsRemaining % 60;

  return {
    complete,
    days,
    hours,
    minutes,
    seconds
  }
}

function updateAllSegments() {
  const targetTimeStamp = targetDate.getTime();
  const timeRemainingBits = getTimeRemaining(targetTimeStamp);
  

  updateTimeSection('seconds', timeRemainingBits.seconds);
  updateTimeSection('minutes', timeRemainingBits.minutes);
  updateTimeSection('hours', timeRemainingBits.hours);
  updateTimeSection('days', timeRemainingBits.days);

  return timeRemainingBits.complete;
}

const countdownTimer = setInterval(() => {
  const isComplete = updateAllSegments();
  if (isComplete) {
   clearInterval(countdownTimer);
  }
}, 1000);
