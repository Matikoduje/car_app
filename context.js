import os from 'os'; 
import { NeutralGear } from './gearStates.js'
import { printAvailableKeysForActiveGear } from './helpers.js'

export class Context {

  constructor(display, event, car) {
    this.event = event;
    this.display = display;
    this.car = car;
    this.currentState = undefined;
    this.steps = [this.processMessageStep, this.processEventStep, this.processNextStateStep];
    this.step = 0;
    this.first();
  }

  process(eventType) {
    this.currentEventType = eventType;
    return this.steps[this.step].call(this);
  }

  processMessageStep() {
    console.clear();

    if (undefined === this.currentState) {
      throw new Error("Current state is undefined");
    }
    const isReverseGear = this.currentState._gearSymbol === 'R';
    let message = "*** Current gear: " + this.currentState.name + " ***" + os.EOL;

    message += "Keys: " + printAvailableKeysForActiveGear(this.currentState.processedAvailableTransitions()) + os.EOL;
    message += this.currentState.prepareMessage() + os.EOL;
    if (this.currentState._gearSymbol === 'N' && this.currentState._car.getSpeed() > 0) {
      this.currentState._car.engineCheck();
    }

    message += this.currentState._car.prepareCarMessage(isReverseGear) + os.EOL;

    this.display(message);

    ++this.step;

    return true;
  }

  processEventStep() {
    if (undefined === this.currentState) {
      throw new Error("Current state is undefined");
    }

    if (!this.currentState.processEvent(this.currentEventType, this.event.getKey())) {
      if (this.currentState.refreshProcessEvent) {
        return this.steps[--this.step].call(this);
      }
      return false;
    }
 
    ++this.step;

    return true;
  }

  processNextStateStep() {
    if (!this.next()) {
      this.first();
    }

    return true;
  }

  first() {
    this.step = 0;
    this.car.clear();
    this.currentState = new NeutralGear(this.car);
  }

  next() {
    this.step = 0;
    this.currentState = this.currentState.next();
    return (undefined !== this.currentState);
  }  

}