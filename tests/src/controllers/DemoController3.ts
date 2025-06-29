import {GetxController} from "../../../src";

export class DemoModel3 {
    id: number = 0;
}
export class DemoController3 extends GetxController{
    _model:DemoModel3 = new DemoModel3();
    get model(): DemoModel3 {
        return this._model;
    }
    setNewModelWithId(id: number) {
        this._model = new DemoModel3();
        this._model.id = id;
        this.notifyListener();
    }
}