<script lang="ts">
    import Get from "../../../src/Get";
    import IncrementalController from "../../../src/svelteComponents/IncrementalController";
    import GetListener from "../../../src/svelteComponents/GetListener.svelte";

    Get.put(new IncrementalController(0));
    let isVisible = $state(true);

    const toggleVisibility = () => {
        isVisible = !isVisible;
    };


</script>

<button id="toggleButton" onclick={toggleVisibility} data-testid="toggleButton">Toggle</button>

{#if isVisible}
    <GetListener
            autoDestroy={false}
            controller={Get.find(IncrementalController)}>
        {#snippet builder(controller)}
            <button onclick={() => controller.increment()} id="incrementButton" data-testid="incrementButton">
                Increment count: <span id="count" data-testid="count">{controller.counter}</span>
            </button>
        {/snippet}
    </GetListener>
{/if}
