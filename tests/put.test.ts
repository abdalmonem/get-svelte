import {describe, it, expect, vi, beforeEach} from "vitest";
import Get from "../src/Get";
import DemoController from "./src/controllers/DemoController";


describe('put()', () => {
    beforeEach(() => {
        Get.controllerIDS = [];
    });

    it('Test when put controller it should get registered with a random id and the type should be registered.', () => {
        Get.put(new DemoController());
        expect(Get.controllerIDS.length).toBe(1);
        expect(Get.controllerIDS[0].id).toBeDefined();
        expect(Get.controllerIDS[0].type).toBe("DemoController");
    });

    it('Test when put controller it should get registered with a tag.', () => {
        Get.put(new DemoController(), {tag: "test-tag"});
        expect(Get.controllerIDS[0].tag).toBe("test-tag");
    });

    it('Test when put controller with a same tag, it should not get register as new controller.', () => {
        Get.put(new DemoController(), {tag: "test-tag"});
        Get.put(new DemoController(), {tag: "test-tag"});

        expect(Get.controllerIDS.length).toBe(1);
        expect(Get.controllerIDS[0].tag).toBe("test-tag");
        expect(Get.controllerIDS[0].type).toBe("DemoController");
    });

    it('Test when put controller it should call init method of the controller.', () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const controller = new DemoController();
        Get.put(controller);
        expect(logSpy).toHaveBeenCalledWith('demo controller initialized');
        logSpy.mockRestore();
    });


});
