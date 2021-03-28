<script>
  // Importing modules
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  // Importing stores
  import { stores } from "@sapper/app";
  const { page } = stores();

  // Importing components
  import PageTransition from "../components/Loader/PageTransition.svelte";
  import Background from '../components/Layout/Background.svelte';
  import Spinner from "../components/Loader/Spinner.svelte";

  // onMoune event
  // - Here we'll just redirect user
  // to /authorize/callback page
  onMount(() => {
    if ($page.params.code.split('').length == 3) {
      goto(`/authorize/callback/${$page.params.code}?type=minecraft`);
    } else {
      goto('/error');
    };
  });
</script>

<!-- Background Component -->
<Background /> <PageTransition />

<!-- Spinner -->
<main class="relative w-full h-screen flex justify-center items-center">
  <Spinner size="20" color="#fff" />
</main>