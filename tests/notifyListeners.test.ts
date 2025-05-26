import {describe, it, expect} from "vitest";
import Get from "../src/Get";
import DemoController from "./src/controllers/DemoController";


describe('notifyListeners and addListener and removeListener', () => {

    it('Test when call notify listeners it should broadcast an update to all listeners.', () => {

        let controller:DemoController = Get.put(new DemoController());

        let counter:number|undefined;
        let updatesCount:number = controller.counter;

        controller.addListener(() => {
            updatesCount++;
            counter = controller.counter;
        });

        controller.increment();
        controller.increment();
        controller.increment();

        expect(counter).toBe(3);
        expect(updatesCount).toBe(3);
    });


    it('Test when removeListener() it should remove the listener and no longer update should get passed.', () => {

        let controller:DemoController = Get.put(new DemoController(), {tag: "test-remove-listener"});

        let counter:number|undefined;
        let updatesCount:number = controller.counter;

        const listener = () => {
            updatesCount++;
        };

        controller.addListener(listener);

        controller.increment();
        controller.increment();
        controller.increment();

        expect(updatesCount).toBe(3);

        // Remove the listener
        controller.removeListener(listener);

        // Increment again
        controller.increment();

        // Check that the listener was not called
        expect(updatesCount).toBe(3);
    });

});