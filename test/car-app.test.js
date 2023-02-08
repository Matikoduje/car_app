import {expect} from "chai";
import { EventType } from "../event.js";
import { Context } from "../context.js";
import {NeutralGear, FirstGear, ThirdGear, SecondGear} from "../gearStates.js";
import { Car } from "../car.js";
import {MAX_FIRST_GEAR_SPEED} from "../gearbase.js";

const SPEED_UP = 'w';
const SPEED_DOWN = 's';

describe("Tests of the car's operation", () => {
    let car;
    beforeEach(() => {
        car = new Car();
    })

    it('At application start context should be set in state Neutral Gear and car speed should be equal 0', () => {
        const display = () => undefined;
        let context = new Context(display, {}, car);
        context.process(EventType.NONE);
        expect(context.currentState.name).to.equal('Neutral Gear');
        expect(context.currentState.car.getSpeed()).to.equal(0);
        expect(context.currentState.processedAvailableTransitions()).to.be.not.empty;
        expect(context.currentState.processedAvailableTransitions()).to.include('R');
        expect(context.currentState.processedAvailableTransitions()).to.not.include('2');
    });

    it('The car should not accelerate in neutral gear', () => {
        const state = new NeutralGear(car);
        state.processEvent(EventType.KEY_PRESSED, SPEED_UP);
        expect(state.car.getSpeed()).to.equal(0);
    });

    it('The car should start only the correct way. From neutral gear.', () => {
        const state = new NeutralGear(car);
        state.processEvent(EventType.KEY_PRESSED, '1');
        const newState = state.next();
        expect(newState.name).to.equal('First Gear');
        newState.processEvent(EventType.KEY_PRESSED, SPEED_UP);
        expect(newState.car.getSpeed()).to.equal(1);
    })

    it('The car cannot shift into reverse while driving forward', () => {
        car.setSpeed(10);
        const state = new FirstGear(car);
        expect(state.car.getSpeed()).to.equal(10);
        state.processEvent(EventType.KEY_PRESSED, 'R');
        const newState = state.next();
        expect(newState).to.be.null;
    })

    it('The car should drive backward in reverse gear', () => {
        const state = new NeutralGear(car);
        state.processEvent(EventType.KEY_PRESSED, 'R');
        const newState = state.next();
        expect(newState.name).to.equal('Reverse Gear');
        newState.processEvent(EventType.KEY_PRESSED, SPEED_UP);
        expect(newState.car.getSpeed()).to.equal(1);
    })

    it('The car should be able to lose speed by braking', () => {
        car.setSpeed(10);
        const state = new FirstGear(car);
        state.processEvent(EventType.KEY_PRESSED, SPEED_DOWN);
        expect(state.car.getSpeed()).to.equal(9);
    })

    it('The car should be able to use every available gear', () => {
        const state = new NeutralGear(car);
        state.processEvent(EventType.KEY_PRESSED, '1');
        const firstGearState = state.next();
        firstGearState.car.setSpeed(10);
        expect(firstGearState.name).to.equal('First Gear');
        firstGearState.processEvent(EventType.KEY_PRESSED, '2');
        const secondGearState = firstGearState.next();
        expect(secondGearState.name).to.equal('Second Gear');
        secondGearState.car.setSpeed(25);
        secondGearState.processEvent(EventType.KEY_PRESSED, '3');
        const thirdGearState = secondGearState.next();
        expect(thirdGearState.name).to.equal('Third Gear');
        thirdGearState.car.setSpeed(55);
        thirdGearState.processEvent(EventType.KEY_PRESSED, '4');
        const fourthGearState = thirdGearState.next();
        expect(fourthGearState.name).to.equal('Fourth Gear');
        expect(fourthGearState.car.getSpeed()).to.equal(55);
        for (let i = 100; i > 0; i--) {
            fourthGearState.processEvent(EventType.KEY_PRESSED, SPEED_DOWN);
        }
        expect(fourthGearState.car.getSpeed()).to.equal(0);
    })

    it('The car should be able to shift to idle while driving. A warning message should then appear about possible engine damage.', () => {
        car.setSpeed(40);
        const state = new ThirdGear(car);
        state.processEvent(EventType.KEY_PRESSED, SPEED_DOWN);
        expect(state.car.getWarningMessage()).to.be.empty;
        state.processEvent(EventType.KEY_PRESSED, 'N');
        const newState = state.next();
        newState.processEvent(EventType.KEY_PRESSED, SPEED_DOWN);
        expect(newState.car.getWarningMessage()).to.not.be.empty;
    })

    it('The car can shift from higher to first gear only if the speed is less than the speed allowed for first gear (15 km/h)', () => {
        car.setSpeed(20);
        const state = new SecondGear(car);
        /** Should not change state because speed is bigger than expect */
        expect(state.car.getSpeed()).to.be.greaterThan(MAX_FIRST_GEAR_SPEED);
        state.processEvent(EventType.KEY_PRESSED, '1');
        const tryChangeToFirstGearState = state.next();
        expect(tryChangeToFirstGearState).to.be.null;
        state.car.setSpeed(12);
        /** Should CHANGE state because speed is lesser than expect */
        expect(state.car.getSpeed()).to.be.lessThan(MAX_FIRST_GEAR_SPEED);
        state.processEvent(EventType.KEY_PRESSED, '1');
        const firstGearState = state.next();
        expect(firstGearState.name).to.equal('First Gear');
    })
})