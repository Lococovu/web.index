<script>
  // Importing modules
  import { goto } from "@sapper/app";
  import { fade } from "svelte/transition";
  
  // Importing components
  import PageTransition from "../components/Loader/PageTransition.svelte";
  import Background from "../components/Layout/Background.svelte";

  import Icon from "../components/Icon.svelte";
  import { Caption } from "../components/typography";

  let gamingHover = false;
  let accountsHover = false;
</script>

<!-- Main Page's Layout -->
<Background /> <PageTransition />

<main style="z-index: 1;" class="relative w-full h-screen flex items-center justify-center">
  <!-- Header -->
  <header class="absolute top-0 h-16 mt-6 px-8 w-full flex justify-between items-center">
    <!-- Logotype -->
    <div class="flex items-center">
      <img class="w-6 h-6" src="./logotype/small-white.svg" alt="">
    
      <!-- Links -->
      <div class="flex items-center">
        <a class="border-b border-solid border-indigo-400 text-sm text-white mx-4" href="/">Главная</a>
      </div>
    </div>
  </header>

  <!-- Text -->
  <div style="z-index: 0;" class="w-1/3 relative text-center">
    <h1 class="text-4xl text-white">Всё ещё в разработке</h1>
    <p class="mt-3 text-sm text-gray-100 opacity-80">Этот проект всё ещё находится на глубочайшей стадии разработки. Мы очень сильно стараеммся сделать этот проект как можно быстрее и как можно качественее.<br /><br />Пока что вы можете посетить наш Дискорд-канал. Ну или же можете попытать удачу и поискать что-то в исходном коде ВСЕГО проекта. (Он доступен всем и вся.)</p>

    <div class="w-full flex justify-center items-center mt-4">
      <!-- Discord -->
      <button class="w-full mr-2 flex items-center justify-center rounded-md bg-indigo-400 h-9">
        <img src="./icons/Discord-Logo-White.svg" class="w-6 h-6 text-white" alt="">

        <p class="text-white text-sm ml-2">Discord</p>
      </button>

      <!-- Github -->
      <button class="w-full flex items-center justify-center rounded-md bg-input h-9" on:click={(e) => window.location.href = "https://github.com/Lococovu"}>
        <Icon name="github" attrs={{ class: "w-5 h-5 text-white" }} />

        <p class="text-white text-sm ml-2">Github</p>
      </button>
    </div>
  </div>
</main>