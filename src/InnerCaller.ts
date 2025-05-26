/**
 * A utility class that acts as a bridge for calling lifecycle methods on controllers.
 * It stores references to controller lifecycle methods and provides a way to invoke them.
 */
export class InnerCaller{
    /** Reference to the controller's close/cleanup method */
    declare close: Function;

    /** Reference to the controller's initialization method */
    declare init : Function;

    /** Reference to the controller's ready method */
    declare ready: Function;

    /** Reference to the callback function to be executed when disposing the controller */
    declare onDisposeCallBack: Function;

    /**
     * Calls the close lifecycle method on the associated controller
     */
    public callClose(): void {
        this.close();
    }

    /**
     * Calls the initialization lifecycle method on the associated controller
     */
    public callInit(): void {
        this.init();
    }

    /**
     * Calls the ready lifecycle method on the associated controller
     */
    public callReady(): void {
        this.ready();
    }
}

