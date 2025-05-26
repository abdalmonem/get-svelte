import {describe, it, expect} from "vitest";
import Get from "../src/Get";
import DemoController from "./src/controllers/DemoController";
import DemoController2 from "./src/controllers/DemoController2";


describe('find()', () => {

    it('Test when find controller it should return the controller by type.', () => {
        const controller: DemoController = Get.put(new DemoController());
        const foundController = Get.find(DemoController);
        expect(foundController).toBe(controller);
    });

    it('Test when find controller with tag it should return the controller by type and tag.', () => {
        const controller: DemoController = Get.put(new DemoController(), {tag: "test-tag"});
        const controller2: DemoController = Get.put(new DemoController(), {tag: "test-tag2"});

        const foundController = Get.find<DemoController>(DemoController, {tag: "test-tag"});
        expect(foundController).toBe(controller);

        const foundController2 = Get.find<DemoController>(DemoController, {tag: "test-tag2"});
        expect(foundController2).toBe(controller2);
    });

    it('Test when find controller with non-existing tag it should throw an error.', () => {
        Get.put(new DemoController(), {tag: "test-tag"});
        expect(() => {
            Get.find<DemoController>(DemoController, {tag: "non-existing-tag"});
        }).toThrowError("No instance of DemoController with tag 'non-existing-tag' found.");
    });

    it('Test when find controller with non-existing type it should throw an error.', async () => {
        // await for 1 second to ensure the controller is registered
        expect(() => {
            Get.find(DemoController2);
        }).toThrowError("No instance of DemoController2 found.");
    });



});