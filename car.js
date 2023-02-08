import os from 'os';

const CAR_ACCELERATE_KEY = 'w';
const CAR_BRAKING_KEY = 's';

export function Car () {
  let speed = 0;
  let warningMessage = '';

  function clear () {
    speed = 0;
    warningMessage = '';
  }
  
  function getSpeed() {
    return speed;
  }

  function getWarningMessage() {
    return warningMessage;
  }
  function accelerate() {
    ++speed;
  }

  function braking() {
    if (speed > 0) {
      --speed;
    }
  }

  function prepareCarMessage(isReverse) {
    let actualSpeed = isReverse && speed !== 0 ? ` -${speed} km/h` : ` ${speed} km/h`
    let message = 'Current speed:' + actualSpeed;
    if (warningMessage) {
      message += os.EOL + warningMessage;
      warningMessage = '';
    }
    return message;
  }

  function allowedCarOperations(char, isAccelerateAllowed = true) {
    let allowedCarOperations = [CAR_ACCELERATE_KEY, CAR_BRAKING_KEY];
    if (!isAccelerateAllowed) {
      allowedCarOperations = [CAR_BRAKING_KEY]
    }
    return allowedCarOperations.includes(char);
  }

  function engineCheck(isAccelerateAllowed, optimalSpeed, char) {
    if (isAccelerateAllowed) {
      const speedCheck = char === CAR_ACCELERATE_KEY ? speed >= optimalSpeed : speed > optimalSpeed+1;
      if (speedCheck) {
        warningMessage = 'Shift into a higher gear. Longer driving at high rpm risks damaging the engine.';
      }
    } else if (!isAccelerateAllowed && speed-1 > 0) {
      warningMessage = 'Driving at idle gear is not optimal for engine life.';
    }
  }

  function carProcess(char, optimalSpeed, maxSpeed, isAccelerateAllowed = true) {
    this.engineCheck(isAccelerateAllowed, optimalSpeed, char);
    if (char === CAR_ACCELERATE_KEY && isAccelerateAllowed &&  speed < maxSpeed) {
      return this.accelerate();
    }
    if (char === CAR_BRAKING_KEY) {
      return this.braking();
    }
  }

  function setSpeed(newSpeed) {
    speed = newSpeed;
  }

  return {
    clear: clear,
    accelerate: accelerate,
    braking: braking,
    prepareCarMessage: prepareCarMessage,
    allowedCarOperations: allowedCarOperations,
    carProcess: carProcess,
    getSpeed: getSpeed,
    engineCheck: engineCheck,
    setSpeed: setSpeed,
    getWarningMessage: getWarningMessage,
  }
}
