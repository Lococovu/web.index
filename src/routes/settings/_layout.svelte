<script>
  // Importing modules
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";

  // Importing stores
  import profile from "../../stores/profile.js";
  import accounts from "../../stores/accounts.js";

  // Importing components
  import SettingsHeader from "../../components/Layout/SettingsHeader.svelte";

  // onMount event
  // - Here we'll check if user
  // even authorized or no
  onMount(() => {
    if ($profile.id == null) {
      if ($accounts.length > 0) {
        goto('/authorize?return=/settings&action=choose');
      } else {
        goto('/authorize?return=/settings');
      };
    };
  });
</script>

<!-- Main Page's Layout -->
<main>
  <SettingsHeader />

  <section class="h-full flex relative mx-8 pt-24">
    <!-- Settings -->
    <div class="w-full h-full px-2 relative">
      <div class="w-full h-full rounded-md pt-4 bg-input flex flex-col">
        <!-- List Itself -->
        <div class="w-full pb-8">
          <slot></slot>
        </div>
      </div>
    </div>
  </section>
</main>