import GetxController from "./GetxController";
import {InnerCaller} from "./InnerCaller";

/**
 * Interface defining the parameters required for creating a GetxControllerID instance.
 * This represents the identification and metadata for a controller in the Get system.
 */
export interface GetxControllerIDParams {
    id: string;
    type: string;
    tag: string | undefined;
    controller: GetxController,
    innerCaller: InnerCaller;
}

/**
 * Class representing a unique identifier for a GetxController instance.
 * Stores metadata about the controller including its identifier, type, and tag
 * along with references to the controller and its inner caller.
 */
export default class GetxControllerID {
    /** Unique identifier for the controller */
    public readonly id: string;

    /** Optional tag for categorizing or finding controllers */
    public readonly tag: string | undefined;

    /** Type name of the controller, typically the class name */
    public readonly type: string;

    /** Reference to the actual controller instance */
    public readonly controller: GetxController;

    /** Reference to the controller's inner caller for lifecycle management */
    public readonly innerCaller: InnerCaller;

    /**
     * Creates a new GetxControllerID instance.
     * @param {GetxControllerIDParams} params - The parameters for initializing the controller ID
     */
    constructor({ id , type, tag, controller, innerCaller }: GetxControllerIDParams) {
        this.id = id;
        this.tag = tag;
        this.type = type;
        this.controller = controller;
        this.innerCaller = innerCaller;
    }

    /**
     * Lifecycle hook called when the controller is deleted.
     * This method can be overridden by subclasses to perform cleanup actions.
     */
    public onDelete(): void {
        // This method can be overridden by subclasses to perform actions when the controller is deleted.
        // For example, you might want to clean up resources or unsubscribe from events.
    }
}
