import { Event, EventType } from './event.js'
import { Car } from './car.js';
import { Context } from './context.js'
import { display } from './display.js'

let event = new Event(processContext);
let car = new Car();
let context = new Context(display, event, car);

export function processContext(eventType) {
  if (context.process(eventType)) {
    while (context.process(EventType.NONE));
  }
}
