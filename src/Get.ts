import GetxController from "./GetxController";
import GetxControllerID from "./GetxControllerID";
import {InnerCaller} from "./InnerCaller";

/**
 * Interface for optional parameters when registering a controller with the Get system
 */
export interface GetxControllerIDParams {
    tag: string;
}

/**
 * Main service class for controller dependency injection and management.
 * Provides methods to register, find, and manage the lifecycle of controllers.
 */
export default class Get{

    /** Registry of all controllers currently managed by the Get system */
    static controllerIDS: GetxControllerID[] = [];

    /**
     * Generates a unique random ID for a controller
     * @returns {string} A randomly generated unique identifier
     */
    static generateRandomControllerID(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Checks if a controller of the given type and optional tag is already registered
     * @template T - Type extending GetxController
     * @param {new (...args: any[]) => T} ControllerClass - Constructor of the controller class to check
     * @param {{tag?: string}} params - Optional params containing a tag
     * @returns {boolean} True if a matching controller is registered, false otherwise
     */
    static isRegistered<T extends GetxController>(
        ControllerClass: new (...args: any[]) => T,
        { tag }: { tag?: string } = {}
    ): boolean {
        const type = ControllerClass.name;
        return this.controllerIDS.some(
            (c) => c.type === type && c.tag === tag
        );
    }

    /**
     * Registers a controller instance with the Get system
     * If a controller of the same type and tag already exists, returns the existing instance
     * @template T - Type extending GetxController
     * @param {T} controller - The controller instance to register
     * @param {GetxControllerIDParams} [params] - Optional parameters including tag
     * @returns {T} The registered controller instance
     */
    static put<T extends GetxController>(controller: T, params?:GetxControllerIDParams): T {
        const id = this.generateRandomControllerID();
        const tag = params?.tag;
        const type = controller.constructor.name;
        // Check if already registered
        const existing = this.controllerIDS.find(
            (c) => c.type === type && c.tag === tag
        );
        if (existing) {
            return existing.controller as T;
        }
        // Set the inner caller for the controller
        const innerCaller = new InnerCaller();
        controller.setInnerCaller(innerCaller, () => {
            this._deleteById(id);
        });
        const controllerID = new GetxControllerID({
            tag: tag,
            id: id,
            type: type,
            controller: controller,
            innerCaller: innerCaller,
        });
        this.controllerIDS.push(controllerID);
        innerCaller.callInit();
        return controller;
    }

    /**
     * Finds and returns a registered controller of the specified type and optional tag
     * @template T - Type extending GetxController
     * @param {new (...args: any[]) => T} ControllerClass - Constructor of the controller class to find
     * @param {{tag?: string}} params - Optional params containing a tag
     * @returns {T} The found controller instance
     * @throws {Error} If no matching controller is found
     */
    static find<T extends GetxController>(
        ControllerClass: new (...args: any[]) => T,
        { tag }: { tag?: string } = {}
    ): T {
        const type = ControllerClass.name;
        const controllerID = this.controllerIDS.find(
            (c) => c.type === type && c.tag === tag
        );

        if (!controllerID) {
            if(tag === undefined) {
                throw new Error(`No instance of ${type} found.`);
            }
            throw new Error(`No instance of ${type} with tag '${tag}' found.`);
        }

        return controllerID.controller as T;
    }

    /**
     * Removes a controller of the specified type and optional tag from the registry
     * @template T - Type extending GetxController
     * @param {new (...args: any[]) => T} ControllerClass - Constructor of the controller class to delete
     * @param {{tag?: string}} params - Optional params containing a tag
     */
    static delete<T extends GetxController>(
        ControllerClass: new (...args: any[]) => T,
        { tag }: { tag?: string } = {}
    ): void {
        const type = ControllerClass.name;
        const index = this.controllerIDS.findIndex(
            (c) => c.type === type && (tag === tag)
        );

        if (index !== -1) {
            // Call the onDelete method of the controller before removing it
            this.controllerIDS[index].innerCaller.callClose();
            this.controllerIDS.splice(index, 1);
        }
    }

    /**
     * Removes a controller with the specified ID from the registry
     * @param {string} id - The unique ID of the controller to delete
     * @private
     */
    static _deleteById(id: string): void {
        const index = this.controllerIDS.findIndex(c => c.id === id);
        if (index !== -1) {
            // Call the onDelete method of the controller before removing it
            this.controllerIDS[index].innerCaller.callClose();
            this.controllerIDS.splice(index, 1);
        }
    }

    /**
     * Removes all controllers from the registry
     */
    static deleteAll(): void {
        // Call the onDelete method for each controller before removing them
        this.controllerIDS.forEach(controllerID => {
            controllerID.innerCaller.callClose();
        });
        // Clear the array
        this.controllerIDS = [];
    }
}
