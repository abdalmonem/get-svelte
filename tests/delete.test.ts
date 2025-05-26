import {describe, it, expect, vi} from "vitest";
import Get from "../src/Get";
import DemoController from "./src/controllers/DemoController";

describe('delete()', () => {

    it('Test when delete controller it should remove the controller by type.', () => {
        const controller: DemoController = Get.put(new DemoController());
        Get.delete(DemoController);
        expect(() => {
            Get.find(DemoController);
        }).toThrowError("No instance of DemoController found.");
    });

    it('Test when delete controller with tag it should remove the controller by type and tag.', () => {
        const controller: DemoController = Get.put(new DemoController(), {tag: "test-tag"});
        Get.delete(DemoController, {tag: "test-tag"});
        expect(() => {
            Get.find<DemoController>(DemoController, {tag: "test-tag"});
        }).toThrowError("No instance of DemoController with tag 'test-tag' found.");
    });

    it('Test when delete non-existing controller it should not throw an error.', () => {
        expect(() => {
            Get.delete(DemoController);
        }).not.toThrow();
    });

    it('Test when delete non-existing controller with tag it should not throw an error.', () => {
        expect(() => {
            Get.delete(DemoController, {tag: "non-existing-tag"});
        }).not.toThrow();
    });

    it('Test when delete controller it should call dispose method.', () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const controller: DemoController = Get.put(new DemoController());
        Get.delete(DemoController,);
        expect(logSpy).toHaveBeenCalledWith('demo controller disposed');
        logSpy.mockRestore();
    });


});