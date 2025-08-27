<script lang="ts">
    import Get from "./Get";
    import DemoController from "../tests/src/controllers/DemoController";
    import {GetListener} from "./index";
    import GetListenerWithAutoDestroy from "../tests/components/WithAutoDispose/GetListenerWithAutoDestroy.svelte";
    import {DuNotificationsWorker} from "./demo/DuNotificationsWorker";
    import {onMount} from "svelte";
    import NotificationsComponent from "./demo/NotificationsComponent.svelte";





    const doIt = () => {
        Get.find(DuNotificationsWorker).createNotification({
            title: "dddd",
            icon: "info",
        });
    }

</script>


<main>

    <NotificationsComponent />

    <button onclick={doIt}>doIt</button>



    <GetListener controller="{Get.find(DuNotificationsWorker)}">
        {#snippet builder(controller)}
            <button onclick={(e) => controller.createNotification({title: 'ddddd', icon: ''})}>HEEEe</button>
        {/snippet}
    </GetListener>






</main>
