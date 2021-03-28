<script>
  // Importing modules
  import { onMount } from "svelte";
  import { fade } from "svelte/transition"

  let loaded;

  onMount(() => {
    setTimeout(() => {
      loaded = true;
    }, 10)
  });
</script>

{ #if !loaded }
  <div out:fade style="z-index: 998;" class="absolute inset-0 w-full h-full bg-container"></div>
{ /if }