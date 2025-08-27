<script lang="ts">
    import {DuNotificationsWorker} from "./DuNotificationsWorker";
    import Get from "../Get";
    import {GetListener} from "../index";

    const duNotificationsWorker:DuNotificationsWorker = Get.put(new DuNotificationsWorker());
</script>


<GetListener controller={duNotificationsWorker}>
    {#snippet builder(controller)}
        Notificaitons : <h1>{controller.notifications.length}</h1>
    {/snippet}
</GetListener>