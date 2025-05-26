import { writable } from 'svelte/store';
import {InnerCaller} from "./InnerCaller";

/**
 * Abstract base class for controllers in the Get system.
 * Provides state management functionality and listener management for reactive updates.
 * Controllers created from this base class can be registered and managed by the Get class.
 */
export default abstract class GetxController{

    /**
     * Collection of listener functions that will be called when state changes
     * @private
     */
    private listeners: (() => void)[] = [];

    /**
     * Registers a new listener function to be notified of state changes
     * @param {Function} listener - The callback function to execute when state changes
     */
    public addListener(listener: () => void) {
        this.listeners.push(listener);
    }

    /**
     * Removes a previously registered listener function
     * @param {Function} listener - The callback function to remove from listeners
     */
    public removeListener(listener: () => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Notifies all registered listeners of a state change
     * Should be called by subclasses when their state changes
     * @protected
     */
    protected notifyListener() {
        this.listeners.forEach(listener => listener());
    }

    /**
     * Lifecycle hook called when the controller is initialized
     * Can be overridden by subclasses to perform initialization tasks
     * @protected
     */
    protected onInit(): void {
        // This method can be overridden by subclasses to perform actions when the controller is initialized.
        // For example, you might want to set up initial state or subscribe to events.
    }

    /**
     * Lifecycle hook called when the controller is closed/deleted
     * Can be overridden by subclasses to perform cleanup tasks
     */
    public onClose(): void {
        // This method can be overridden by subclasses to perform actions when the controller is deleted.
        // For example, you might want to clean up resources or unsubscribe from events.
        this.listeners = [];
    }

    /**
     * Reference to the InnerCaller instance that manages this controller's lifecycle
     * @private
     */
    private declare innerCaller: InnerCaller;

    /**
     * Sets the inner caller for this controller
     * This is typically called by the Get class when registering the controller
     * @param {InnerCaller} innerCaller - The inner caller instance
     * @param {Function} onDisposeCallBack - Callback function to execute when the controller is disposed
     */
    public setInnerCaller(innerCaller: any, onDisposeCallBack: Function): void {
        this.innerCaller = innerCaller;
        this.innerCaller.close = this.onClose.bind(this);
        this.innerCaller.init = this.onInit.bind(this);
        this.innerCaller.onDisposeCallBack = onDisposeCallBack;
    }

    /**
     * Disposes of this controller instance
     * Triggers the disposal callback which typically removes it from the Get registry
     * @returns {any} Result of the disposal callback
     */
    public dispose() {
        return this.innerCaller.onDisposeCallBack();
    }
}

// Prevent overwriting the dispose method
Object.defineProperty(GetxController.prototype, 'dispose', {
    writable: false,
    configurable: false,
});

