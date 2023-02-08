import { FirstGear, FourthGear, NeutralGear, ReverseGear, SecondGear, ThirdGear } from "./gearStates.js";
import { EventType } from "./event.js";

export const MAX_FIRST_GEAR_SPEED = 15;

export class GearStateBase {
  
  constructor(name, car, transitionsAvailable, gearSymbol, optimalShiftGearSpeed = 0, maxSpeedForGear = 0) {
    this._name = name;
    this._car = car;
    this._transitionsAvailable = transitionsAvailable;
    this._gearSymbol = gearSymbol;
    this._optimalShiftGearSpeed = optimalShiftGearSpeed;
    this._maxSpeedForGear = maxSpeedForGear;
    this._nextGear = null;
    this._processedGearChange = false;
    this._refreshProcessEvent = false;
  }

  prepareMessage() {
    const gearSymbol = this._gearSymbol;
  
    return `Current gear: ${gearSymbol}`;
  }

  processEvent(eventType, char) {
    this._refreshProcessEvent = false;
    if (EventType.KEY_PRESSED === eventType) {
      if (this.isTransitionValid(char.toUpperCase())) {
        this._nextGear = char.toUpperCase();
        this._processedGearChange = true;
      }
    }
  }

  next() {
    if (this.nextGear === '1') {
      return new FirstGear(this._car);
    } else if (this.nextGear === '2') {
      return new SecondGear(this._car);
    } else if (this.nextGear === '3') {
      return new ThirdGear(this._car);
    } else if (this.nextGear === '4') {
      return new FourthGear(this._car);
    } else if (this.nextGear === 'N') {
      return new NeutralGear(this._car);
    } else if (this.nextGear === 'R') {
      return new ReverseGear(this._car);
    } else {
      return null;
    }
  }
  
  get name() { 
    return this._name; 
  }

  get car() {
    return this._car;
  }
  
  get transitionsAvailable() {
    return this._transitionsAvailable;
  }

  get gearSymbol() {
    return this._gearSymbol;
  }

  get nextGear() {
    return this._nextGear;
  }

  get processedGearChange() {
    return this._processedGearChange;
  }

  get refreshProcessEvent() {
    return this._refreshProcessEvent;
  }

  processedAvailableTransitions() {
    let availableTransitions = this._transitionsAvailable;
    let hideFirstGearTransition = this._transitionsAvailable.includes('1') && this._car.getSpeed() > MAX_FIRST_GEAR_SPEED;
    let hideReverseGearTransition = this._transitionsAvailable.includes('R') && this._gearSymbol === 'N' && this._car.getSpeed() > 0;

    if (hideFirstGearTransition) {
      availableTransitions = availableTransitions.filter(transition => transition !== '1');
    }

    if (hideReverseGearTransition) {
      availableTransitions = availableTransitions.filter(transition => transition !== 'R');
    }

    return availableTransitions;
  }
  isTransitionValid(transition) {
    let firstGearIsNotAllowed = this._gearSymbol !== '1' && transition === '1' && this._car.getSpeed() > MAX_FIRST_GEAR_SPEED;
    let reverseGearIsNotAllowed = this._gearSymbol === 'N' && transition === 'R' && this._car.getSpeed() > 0;

    if (firstGearIsNotAllowed) {
      return false;
    } else if (reverseGearIsNotAllowed) {
      return false;
    } else {
      return this._transitionsAvailable.includes(transition);
    }
  }
}