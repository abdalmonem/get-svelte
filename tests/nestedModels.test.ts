import {describe, it, expect} from "vitest";
import Get from "../src/Get";
import {DemoController3} from "./src/controllers/DemoController3";


describe('Nested Models and Getters', () => {

    it('Test when accessing nested model properties through getters it should work correctly.', () => {

        let controller: DemoController3 = Get.put(new DemoController3());

        let modelId: number | undefined;
        let updatesCount: number = 0;

        controller.addListener(() => {
            updatesCount++;
            modelId = controller.model.id;
        });

        // Test initial values
        expect(controller.model.id).toBe(0);

        // Test setting nested model
        controller.setNewModelWithId(123);
        expect(updatesCount).toBe(1);
        expect(modelId).toBe(123);
        expect(controller.model.id).toBe(123);

        // Test multiple updates
        controller.setNewModelWithId(456);

        expect(updatesCount).toBe(2);
        expect(controller.model.id).toBe(456);
        expect(modelId).toBe(456);
    });

    it('Test when removing listener for nested models it should no longer receive updates.', () => {

        let controller: DemoController3 = Get.put(new DemoController3(), { tag: 'nested-test' });

        let modelId: number | undefined;
        let updatesCount: number = 0;

        const listener = () => {
            updatesCount++;
            modelId = controller.model.id;
        };

        controller.addListener(listener);

        // Test initial update
        controller.setNewModelWithId(100);
        expect(updatesCount).toBe(1);
        expect(modelId).toBe(100);

        // Remove listener
        controller.removeListener(listener);

        // Test that no more updates are received
        controller.setNewModelWithId(200);
        expect(updatesCount).toBe(1); // Should still be 1
        expect(modelId).toBe(100); // Should still be old value
        expect(controller.model.id).toBe(200); // But controller should have new value
    });

    it('Test when accessing getter properties directly they should return current values.', () => {

        let controller: DemoController3 = Get.put(new DemoController3(), { tag: 'direct-access' });

        // Test initial state
        expect(controller.model.id).toBe(0);

        // Test direct access after changes
        controller.setNewModelWithId(999);
        expect(controller.model.id).toBe(999);

        // Test that getter returns the current model instance
        const model1 = controller.model;
        controller.setNewModelWithId(888);
        const model2 = controller.model;

        expect(model1.id).toBe(999);
        expect(model2.id).toBe(888);
        expect(model1).not.toBe(model2); // Should be different instances
    });

    it('Test when controller is disposed nested model access should still work until cleanup.', () => {

        let controller: DemoController3 = Get.put(new DemoController3(), { tag: 'dispose-test' });

        controller.setNewModelWithId(777);
        expect(controller.model.id).toBe(777);

        // Dispose the controller
        controller.dispose();

        // Should still be able to access properties
        expect(controller.model.id).toBe(777);

        // Should not be registered anymore
        expect(Get.isRegistered(DemoController3, { tag: 'dispose-test' })).toBe(false);
    });

});
