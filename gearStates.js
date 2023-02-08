import { GearStateBase, MAX_FIRST_GEAR_SPEED } from './gearbase.js'
import { EventType } from './event.js';

///////////////////////////////////////////////////////////////////////////////////////

export class FirstGear extends GearStateBase {
  constructor(car) {
    super("First Gear", car, ['N', '2', '3', '4'], '1', 10, MAX_FIRST_GEAR_SPEED);
  }

  processEvent(eventType, char) {
    super.processEvent(eventType, char);

    if (this.processedGearChange) {
      return true;
    }

    if (EventType.KEY_PRESSED === eventType) {
      if (this._car.allowedCarOperations(char)) {
        this._car.carProcess(char, this._optimalShiftGearSpeed, this._maxSpeedForGear);
        this._refreshProcessEvent = true;
      }
    }

    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////////////

export class SecondGear extends GearStateBase {
  constructor(car) {
    super("Second Gear", car, ['N', '1', '3', '4'], '2', 20, 40);
  }

  processEvent(eventType, char) {
    super.processEvent(eventType, char);

    if (this.processedGearChange) {
      return true;
    }

    if (EventType.KEY_PRESSED === eventType) {
      if (this._car.allowedCarOperations(char)) {
        this._car.carProcess(char, this._optimalShiftGearSpeed, this._maxSpeedForGear);
        this._refreshProcessEvent = true;
      }
    }

    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////////////

export class ThirdGear extends GearStateBase {
  constructor(car) {
    super("Third Gear", car, ['N', '1', '2', '4'], '3', 50, 80);
  }

  processEvent(eventType, char) {
    super.processEvent(eventType, char);

    if (this.processedGearChange) {
      return true;
    }

    if (EventType.KEY_PRESSED === eventType) {
      if (this._car.allowedCarOperations(char)) {
        this._car.carProcess(char, this._optimalShiftGearSpeed, this._maxSpeedForGear);
        this._refreshProcessEvent = true;
      }
    }

    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////

export class FourthGear extends GearStateBase {
  constructor(car) {
    super("Fourth Gear", car, ['N', '1', '2', '3'], '4', 90, 110);
  }

  processEvent(eventType, char) {
    super.processEvent(eventType, char);

    if (this.processedGearChange) {
      return true;
    }

    if (EventType.KEY_PRESSED === eventType) {
      if (this._car.allowedCarOperations(char)) {
        this._car.carProcess(char, this._optimalShiftGearSpeed, this._maxSpeedForGear);
        this._refreshProcessEvent = true;
      }
    }

    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////

export class ReverseGear extends GearStateBase {
  constructor(car) {
    super("Reverse Gear", car, ['N'], 'R', 15, 15);
  }

  processEvent(eventType, char) {
    super.processEvent(eventType, char);

    if (this.processedGearChange) {
      if (this._car.getSpeed() === 0) {
        return true;
      }
    }

    if (EventType.KEY_PRESSED === eventType) {
      if (this._car.allowedCarOperations(char)) {
        this._car.carProcess(char, this._optimalShiftGearSpeed, this._maxSpeedForGear);
        this._refreshProcessEvent = true;
      }
    }

    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////

export class NeutralGear extends GearStateBase {
  constructor(car) {
    super("Neutral Gear", car, ['R', '1'], 'N');
  }

  processEvent(eventType, char) {
    super.processEvent(eventType, char);

    if (this.processedGearChange) {
      return true;
    }

    if (EventType.KEY_PRESSED === eventType) {
      if (this._car.allowedCarOperations(char, false)) {
        this._car.carProcess(char, 0, 0, false);
        this._refreshProcessEvent = true;
      }
    }

    return false;
  }
}
