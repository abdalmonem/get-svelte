import GetxController from "../../../src/GetxController";

export default class DemoController extends GetxController{

    counter = 0;

    increment() {
        this.counter++;
        this.notifyListener();
    }

    public onClose(): void {
        super.onClose();
        console.log("demo controller disposed");
    }

    public onInit(): void {
        super.onInit();
        console.log("demo controller initialized");
    }
}