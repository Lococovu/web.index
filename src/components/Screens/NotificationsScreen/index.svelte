<script>
  // Importing notifications + friends stores
  import notifications from "../../../stores/notifications.js";
  import NotificationCard from "./components/NotificationCard.svelte";

</script>

<!-- Notifications List -->
<div class="w-full mt-2 flex flex-wrap">
  { #each $notifications as notification }
    <NotificationCard notification={notification} />
  { /each }
</div>