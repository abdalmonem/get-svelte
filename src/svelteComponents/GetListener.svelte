<script lang="ts" generics="T extends GetxController">
    import GetxController from "../GetxController";
    import {onDestroy, onMount} from "svelte";

    let {
        controller,
        autoDestroy = true,
        builder
    }: {
        controller: T;
        autoDestroy?: boolean;
        builder: (controller: T) => T;
    } = $props();

    // Create proxy immediately when controller is available - no delays
    let updatedController = $state(
        controller ? new Proxy(controller, {
            get(target, prop) {
                return target[prop];
            }
        }) : undefined
    ) as T;

    // Update proxy when controller changes
    $effect(() => {
        if (controller) {
            updatedController = new Proxy(controller, {
                get(target, prop) {
                    return target[prop];
                }
            });
        }
    });

    onMount(() => {
        if (!controller) {
            throw new Error("GetListener must be used with a GetxController instance.");
        }

        // Add listener for future updates
        controller.addListener(() => {
            // Force reactivity by creating new proxy
            updatedController = new Proxy(controller, {
                get(target, prop) {
                    return target[prop];
                }
            });
            console.log("GetListener: Controller state updated");
        });
    });

    onDestroy(() => {
        if (autoDestroy) {
            controller.dispose();
        }
    });

</script>

<!-- Render immediately when controller is available -->
{#if controller && updatedController}
    {@render builder(updatedController)}
{/if}
