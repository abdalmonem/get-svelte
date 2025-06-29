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


    let updatedController = $state(controller);

    onMount(() => {
        if (!controller) {
            throw new Error("GetListener must be used with a GetxController instance.");
        }
        controller.addListener(() => {
            updateState();
            console.log("GetListener: Controller state updated");
        });
    });

    let updateState = () => {
        // Create a proxy that maintains live access to the original controller
        // while triggering Svelte's reactivity system
        updatedController = new Proxy(controller, {
            get(target, prop) {
                return target[prop];
            }
        });
    }

    onDestroy(() => {
        if (autoDestroy) {
            controller.dispose();
        }
    });


</script>

{@render builder(updatedController)}
