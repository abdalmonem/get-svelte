import {GetxController} from "../index";

type DuNotificationParams = {
    title?: string,
    message?: string,
    color?: string,
    icon?: string,
    removeAfter?: number,
    onClick?: () => void,
    onClose?: () => void,
}

export class DuNotification{
    title?: string;
    message?: string;
    color?: string;
    icon?: string;
    removeAfter?: number;
    onClick?: () => void;
    onClose?: () => void;
    id: string = Math.random().toString(36).substring(2, 15); // unique ID for the notification
    isAutoRemoving: boolean = false; // Flag for auto removal animation
    isHovered: boolean = false; // Flag to track hover state
    autoRemovalTimeout?: NodeJS.Timeout; // Store timeout reference

    onRemove?: () => void;
    onAnimateRemoval?: () => void; // Callback to trigger animation in component

    constructor(params: DuNotificationParams, onRemove?: () => void) {
        this.title = params.title;
        this.message = params.message;
        this.color = params.color || '#37C68F';
        this.icon = params.icon || '';
        this.removeAfter = params.removeAfter; // default to 5 seconds
        this.onClick = params.onClick;
        this.onClose = params.onClose;
        this.onRemove = onRemove;
    }

    public remove(): void {
        if (this.autoRemovalTimeout) {
            clearTimeout(this.autoRemovalTimeout);
        }
        if (this.onRemove) {
            this.onRemove();
        }
    }

    public pauseAutoRemoval(): void {
        this.isHovered = true;
        if (this.autoRemovalTimeout) {
            clearTimeout(this.autoRemovalTimeout);
        }
    }

    public resumeAutoRemoval(worker: DuNotificationsWorker): void {
        this.isHovered = false;
        if (this.removeAfter !== undefined && !this.isAutoRemoving) {
            this.autoRemovalTimeout = setTimeout(() => {
                console.log('🔥 Auto-removal time reached, triggering animation');
                this.isAutoRemoving = true;
                if (this.onAnimateRemoval) {
                    this.onAnimateRemoval();
                }
                // Wait for animation to complete
                setTimeout(() => {
                    worker.removeNotification(this);
                }, 300); // Match faster animation duration
            }, this.removeAfter);
        }
    }
}

export class DuNotificationsWorker extends GetxController{
    notifications: DuNotification[] = [];
    removalQueue: DuNotification[] = [];
    additionQueue: DuNotification[] = [];
    isProcessingRemovals: boolean = false;
    isProcessingAdditions: boolean = false;
    removalBatchTimeout?: NodeJS.Timeout;

    createNotification(notificationData: DuNotificationParams): DuNotification{
        const notification = new DuNotification(
            notificationData,
            () => {
                this.removeNotification(notification);
            }
        );

        // Add to addition queue to coordinate with removals
        this.additionQueue.push(notification);
        this.processAdditionQueue();

        if (notification.removeAfter !== undefined) {
            notification.autoRemovalTimeout = setTimeout(() => {
                console.log('🔥 Auto-removal time reached, triggering animation');
                notification.isAutoRemoving = true;
                if (notification.onAnimateRemoval) {
                    notification.onAnimateRemoval();
                }
                this.notifyListener(); // Update UI
                // Wait for animation to complete
                setTimeout(() => {
                    this.removeNotification(notification);
                }, 120); // Match faster fade animation duration
            }, notification.removeAfter);
        }
        return notification;
    }

    removeNotification(notification: DuNotification): void {
        // Add to removal queue instead of immediate removal
        if (!this.removalQueue.includes(notification)) {
            this.removalQueue.push(notification);
        }

        // Clear existing batch timeout and set a new one
        if (this.removalBatchTimeout) {
            clearTimeout(this.removalBatchTimeout);
        }

        // Batch removals that happen within 150ms of each other
        this.removalBatchTimeout = setTimeout(() => {
            this.processBatchedRemovals();
        }, 150);
    }

    private async processBatchedRemovals(): Promise<void> {
        if (this.isProcessingRemovals || this.removalQueue.length === 0) {
            return;
        }

        this.isProcessingRemovals = true;

        // Determine if this is a rapid batch (multiple items) or single removal
        const isBatchRemoval = this.removalQueue.length > 1;

        if (isBatchRemoval) {
            // For rapid batch removals, remove all at once with minimal delays
            while (this.removalQueue.length > 0) {
                const notification = this.removalQueue.shift();
                if (notification) {
                    const index = this.notifications.indexOf(notification);
                    if (index !== -1) {
                        this.notifications.splice(index, 1);
                        if (notification.onClose) {
                            notification.onClose();
                        }
                    }
                }
            }
            // Single update for all removals
            this.notifyListener();
            // Wait for all exit animations to complete
            await new Promise(resolve => setTimeout(resolve, 200));
        } else {
            // Single removal - use original smooth method
            const notification = this.removalQueue.shift();
            if (notification) {
                const index = this.notifications.indexOf(notification);
                if (index !== -1) {
                    this.notifications.splice(index, 1);
                    if (notification.onClose) {
                        notification.onClose();
                    }
                    this.notifyListener();
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        }

        this.isProcessingRemovals = false;
        // Process any pending additions after removals complete
        this.processAdditionQueue();
    }

    private async processRemovalQueue(): Promise<void> {
        // This method is kept for backward compatibility but now calls the batched version
        return this.processBatchedRemovals();
    }

    private async processAdditionQueue(): Promise<void> {
        // Wait for removals to complete first
        if (this.isProcessingRemovals || this.isProcessingAdditions || this.additionQueue.length === 0) {
            return;
        }

        this.isProcessingAdditions = true;

        while (this.additionQueue.length > 0) {
            const notification = this.additionQueue.shift();
            if (notification) {
                this.notifications.push(notification);
                this.notifyListener();
                // Small delay between additions for staggered entry
                await new Promise(resolve => setTimeout(resolve, 80));
            }
        }

        this.isProcessingAdditions = false;
    }

    public clearNotifications(): void {
        this.notifications.forEach(notification => {
            if (notification.onClose) {
                notification.onClose();
            }
        });
        this.notifications = [];
        this.notifyListener();
    }
}