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



    let update = $state(0); // dummy state to trigger reactivity

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
        update = update+1;
    }

    onDestroy(() => {
        if (autoDestroy) {
            controller.dispose();
        }
    });

</script>

{#key update}
    {@render builder(controller)}
{/key}
