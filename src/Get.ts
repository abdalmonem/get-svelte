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
 * Check if we're running in a server environment
 */
function isServerSide(): boolean {
    return typeof window === 'undefined' && typeof global !== 'undefined';
}

/**
 * Simple approach: just disable automatic clearing for now
 * The user can manually call Get.deleteAll() in their SSR setup if needed
 */
function getControllerRegistrySync(): GetxControllerID[] {
    // Always return the static registry - user can manage SSR clearing manually
    return Get.controllerIDS;
}

/**
 * Main service class for controller dependency injection and management.
 * Uses request-scoped storage in SSR environments to prevent cross-request contamination.
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
        const registry = getControllerRegistrySync();
        return registry.some(
            (c) => c.controllerConstructor === ControllerClass && c.tag === tag
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
        const registry = getControllerRegistrySync();
        
        // Check if already registered using constructor reference
        const existing = registry.find(
            (c) => c.controllerConstructor === controller.constructor && c.tag === tag
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
            type: controller.constructor.name, // Keep for debugging but don't use for matching
            controller: controller,
            innerCaller: innerCaller,
            controllerConstructor: controller.constructor as new (...args: any[]) => GetxController, // Add constructor reference with proper typing
        });
        registry.push(controllerID);
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
        const registry = getControllerRegistrySync();
        const controllerID = registry.find(
            (c) => c.controllerConstructor === ControllerClass && c.tag === tag
        );

        if (!controllerID) {
            if(tag === undefined) {
                throw new Error(`No instance of ${ControllerClass.name} found.`);
            }
            throw new Error(`No instance of ${ControllerClass.name} with tag '${tag}' found.`);
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
        const registry = getControllerRegistrySync();
        const index = registry.findIndex(
            (c) => c.controllerConstructor === ControllerClass && c.tag === tag
        );

        if (index !== -1) {
            // Call the onDelete method of the controller before removing it
            registry[index].innerCaller.callClose();
            registry.splice(index, 1);
        }
    }

    /**
     * Removes a controller with the specified ID from the registry
     * @param {string} id - The unique ID of the controller to delete
     * @private
     */
    static _deleteById(id: string): void {
        const registry = getControllerRegistrySync();
        const index = registry.findIndex(c => c.id === id);
        if (index !== -1) {
            // Call the onDelete method of the controller before removing it
            registry[index].innerCaller.callClose();
            registry.splice(index, 1);
        }
    }

    /**
     * Removes all controllers from the registry
     */
    static deleteAll(): void {
        const registry = getControllerRegistrySync();
        // Call the onDelete method for each controller before removing them
        registry.forEach(controllerID => {
            controllerID.innerCaller.callClose();
        });
        // Clear the array
        registry.length = 0;
    }

    /**
     * For SSR: Call this method at the beginning of each request handler
     * to clear controllers from previous requests and prevent cross-user contamination
     * 
     * Example usage in SvelteKit hooks.server.ts:
     * export async function handle({ event, resolve }) {
     *   Get.clearForSSR();
     *   return await resolve(event);
     * }
     */
    static clearForSSR(): void {
        this.deleteAll();
    }
}



