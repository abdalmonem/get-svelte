import GetxController from "../GetxController";

export default class  IncrementalController extends GetxController {

    constructor(initialValue: number = 0) {
        super();
        this.counter = initialValue;
    }

    counter = 0;

    increment() {
        this.counter++;
        this.notifyListener();
    }

    public onClose(): void {
        super.onClose();
        console.log("incremental controller disposed");
    }

    public onInit(): void {
        super.onInit();
        console.log("incremental controller initialized");
    }

}
